import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RendezVous } from '../interfaces/rendez-vous';
import mapboxgl from 'mapbox-gl';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { RendezVousService } from '../services/rdv/rendez-vous.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-tournee-optimisee',
  imports: [CommonModule, FullCalendarModule, SidebarComponent, RouterLink],
  templateUrl: './tournee-optimisee.component.html',
  styleUrl: './tournee-optimisee.component.css'
})
export class TourneeOptimiseeComponent implements AfterViewInit, OnDestroy, OnInit {
  constructor(
    private rendezVousService: RendezVousService,
    private authService: AuthService,
    private router: Router
  ) {}

  rdvs: RendezVous[] = [];
  optimizedRoute: { distance: number; duration: number } | null = null;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];

  // 🎨 Etat pour le modal générique
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalConfirmCallback: (() => void) | null = null;

  // 🎨 Etat pour le modal dossier médical
  showMedicalModal = false;
  medicalPatientName = '';
  medicalPatientId: number | null = null;
  medicalDate = '';

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
    editable: true,
    selectMirror: true,
    select: this.handleDateClick.bind(this),
    events: [],
    eventDrop: this.onEventDrop.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventDidMount: this.onEventMount.bind(this)
  };

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    const proId = currentUser?.id;
    if (proId) {
      this.rendezVousService.getRendezVousPro(proId).subscribe((rdvs: RendezVous[]) => {
        this.rdvs = rdvs;
        this.initCalendrier();
        if (this.map) {
          this.placerMarkers();
          this.tracerItineraire();
        }
      });
    }
  }

  ngAfterViewInit(): void {
    mapboxgl.accessToken = 'pk.xxxxxxx'; // ✅ ton token Mapbox
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
      extendedProps: {
        idPatient: r.patient!.id,
        adresse: r.patient!.adresse,
        latitude: r.patient!.latitude,
        longitude: r.patient!.longitude
      }
    }));
  }

  handleDateClick(selectInfo: any) {
    this.openModal("📅 Date sélectionnée", `Vous avez sélectionné la date : ${selectInfo.startStr}`);
  }

  onEventDrop(info: any) {
    const newDate = info.event.start;
    this.openModal("📆 Déplacement de RDV", `Le RDV a été déplacé au ${newDate.toLocaleString()}`);
    // TODO: enregistrer côté backend
  }

  onEventClick(info: any) {
    const patientId = info.event.extendedProps.idPatient;
    const nom = info.event.title;
    const date = info.event.start.toLocaleDateString();

    // 👉 Affiche le modal médical
    this.openMedicalModal(nom, patientId, date);

    const latitude = info.event.extendedProps['latitude'];
    const longitude = info.event.extendedProps['longitude'];
    if (latitude && longitude) {
      this.map.flyTo({ center: [longitude, latitude], zoom: 15, essential: true });
    }
  }

  onEventMount(info: any) {
    info.el.addEventListener('dblclick', () => {
      const nom = info.event.title;
      const date = info.event.start;
      this.openModal("✏ Modifier RDV", `Modifier le RDV de ${nom} le ${date.toLocaleString()}`);
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
          if (this.map.getSource('route')) {
            (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData({
              type: 'Feature',
              properties: {},
              geometry: route
            });
          } else {
            this.map.addSource('route', {
              type: 'geojson',
              data: { type: 'Feature', properties: {}, geometry: route }
            });

            this.map.addLayer({
              id: 'route-line',
              type: 'line',
              source: 'route',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: { 'line-color': '#00b894', 'line-width': 5 }
            });
          }
        }
      })
      .catch(err => console.error('Erreur itinéraire Mapbox', err));
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  // 🔹 Modal générique
  openModal(title: string, message: string, confirmCallback?: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalConfirmCallback = confirmCallback ?? null;
    this.showModal = true;
  }

  closeModal(confirm: boolean) {
    this.showModal = false;
    if (confirm && this.modalConfirmCallback) {
      this.modalConfirmCallback();
    }
  }

  // 🔹 Modal médical spécifique
  openMedicalModal(nom: string, patientId: number, date: string) {
    this.medicalPatientName = nom;
    this.medicalPatientId = patientId;
    this.medicalDate = date;
    this.showMedicalModal = true;
  }

  closeMedicalModal(confirm: boolean) {
    this.showMedicalModal = false;
    if (confirm && this.medicalPatientId) {
      this.router.navigate(['/medical-dossier', this.medicalPatientId]);
    }
  }
}