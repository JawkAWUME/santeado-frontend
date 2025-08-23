import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RendezVous } from '../interfaces/rendez-vous';
import mapboxgl from 'mapbox-gl';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr'; // ⬅️ Français
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { RendezVousService } from '../services/rdv/rendez-vous.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tournee-optimisee',
  imports: [CommonModule, FullCalendarModule, SidebarComponent],
  templateUrl: './tournee-optimisee.component.html',
  styleUrl: './tournee-optimisee.component.css'
})
export class TourneeOptimiseeComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private rendezVousService: RendezVousService,
    private route: ActivatedRoute
  ) {}

  rdvs: RendezVous[] = [];
  optimizedRoute: { distance: number; duration: number } | null = null;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];

  calendarOptions: CalendarOptions = {
    locale: frLocale,
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    selectable: true,
    editable: true, // Glisser-déposer activé
    selectMirror: true,
    select: this.handleDateClick.bind(this),
    events: [],
    eventDrop: this.onEventDrop.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventDidMount: this.onEventMount.bind(this)
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const tourneeId = 24;
      if (tourneeId) {
        this.rendezVousService.getRendezVousPro(tourneeId).subscribe((rdvs: RendezVous[]) => {
          this.rdvs = rdvs;
          this.initCalendrier();
          if (this.map) {
            this.placerMarkers();
            this.tracerItineraire();
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamF3ayIsImEiOiJjbWJ4c2hnam8wcTFyMmtzNjlwODV3OXA5In0.mWgOmSTlFKW9eZF9WntwZA';
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [14.73, -17.44],
      zoom: 13
    });

    this.map.on('load', () => {
      if (this.rdvs.length > 0) {
        this.placerMarkers();
        this.tracerItineraire();
      }
      this.map.resize();
    });

    this.initCalendrier();
  }

  initCalendrier() {
    this.calendarOptions.events = this.rdvs.map(r => ({
      id: String(r.id),
      title: r.patient!.nom,
      date: r.dateHeure,
      color: '#60a5fa',
      textColor: '#fff',
      extendedProps: { adresse: r.patient!.adresse }
    }));
  }

  handleDateClick(selectInfo: any) {
    alert(`Date sélectionnée : ${selectInfo.startStr}`);
  }

  onEventDrop(info: any) {
    const newDate = info.event.start;
    alert(`📆 RDV déplacé au ${newDate.toLocaleString()}`);
    // TODO: Enregistrer côté backend
  }

  onEventClick(info: any) {
    const nom = info.event.title;
    const date = info.event.start;
    alert(`🩺 RDV avec ${nom} le ${date.toLocaleString()}`);
  }

  onEventMount(info: any) {
    info.el.addEventListener('dblclick', () => {
      const nom = info.event.title;
      const date = info.event.start;
      alert(`✏️ Modifier RDV : ${nom} le ${date.toLocaleString()}`);
      // TODO: Ouvrir modale pour édition
    });
  }

  placerMarkers() {
    const bounds = new mapboxgl.LngLatBounds();
    this.rdvs.forEach(rdv => {
      const { latitude, longitude } = rdv.patient!;
      if (latitude && longitude) {
        const marker = new mapboxgl.Marker({ color: '#2b82f6' })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<p>${rdv.patient!.adresse}</p>`))
          .addTo(this.map);
        this.markers.push(marker);
        bounds.extend([longitude, latitude]);
      }
    });
    if (!bounds.isEmpty()) {
      this.map.fitBounds(bounds, { padding: 60 });
    }
  }

  tracerItineraire() {
    const coords = this.rdvs.map(r => `${r.patient!.longitude},${r.patient!.latitude}`).join(';');
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
      .then(res => res.json())
      .then(data => {
        if (data.routes?.length) {
          const distance = data.routes[0].distance / 1000;
          const duration = data.routes[0].duration / 60;
          this.optimizedRoute = { distance, duration };

          const route = data.routes[0].geometry;
          this.map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route
            }
          });

          this.map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#00b894', 'line-width': 5 }
          });
        }
      })
      .catch(err => console.error('Erreur itinéraire Mapbox', err));
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }
}
