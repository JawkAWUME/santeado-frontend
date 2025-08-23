import { Component, AfterViewInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProSanteService } from '../services/pro-sante.service';
import { ProSante } from '../interfaces/pro-sante';
import { RendezVousService } from '../services/rdv/rendez-vous.service';
import { RendezVous } from '../interfaces/rendez-vous';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  map!: mapboxgl.Map;
  latitude!: number;
  longitude!: number;
  rayonKm: number = 10;
  searchQuery: string = '';
  specialites: string[] = ['Cardiologue', 'Généraliste', 'Dermatologue', 'Pédiatre'];
  selectedSpecialite: string = '';
  tarifMax: number = 100;
  marker!: mapboxgl.Marker;
  pros: ProSante[] = [];
  filteredPros: ProSante[] = [];

  selectedPro: ProSante | null = null;
  rendezVousDate!: string;
  creneauxDisponibles: string[] = [];
  selectedCreneau: string = '';

  constructor(
    private proSanteService: ProSanteService,
    private rendezVousService: RendezVousService
  ) {}

  ngAfterViewInit(): void {
    this.detectLocation();
  }

  detectLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          this.initMap(); // Initialise la carte avec la position détectée
          this.reverseGeocode(this.longitude, this.latitude); // Mets à jour searchQuery
          this.search(); // Recherche avec ces coordonnées

          // Suivi en temps réel
          navigator.geolocation.watchPosition(
            (pos) => {
              this.latitude = pos.coords.latitude;
              this.longitude = pos.coords.longitude;
              this.map.setCenter([this.longitude, this.latitude]);
              this.marker.setLngLat([this.longitude, this.latitude]);
              this.reverseGeocode(this.longitude, this.latitude);
              this.search();
            },
            (error) => console.error('Erreur de géolocalisation', error),
            { enableHighAccuracy: true }
          );
        },
        (error) => {
          console.error('Erreur de géolocalisation initiale', error);
          // Défaut Paris
          this.latitude = 48.8566;
          this.longitude = 2.3522;
          this.initMap();
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.warn('La géolocalisation n’est pas supportée par ce navigateur.');
      this.latitude = 48.8566;
      this.longitude = 2.3522;
      this.initMap();
    }
  }

  initMap(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiamF3ayIsImEiOiJjbWJ4c2hnam8wcTFyMmtzNjlwODV3OXA5In0.mWgOmSTlFKW9eZF9WntwZA';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [this.longitude, this.latitude],
      zoom: 12
    });

    this.marker = new mapboxgl.Marker({ color: 'blue' , draggable: true })
      .setLngLat([this.longitude, this.latitude])
      .addTo(this.map);

    this.marker.on('dragend', () => {
      const lngLat = this.marker.getLngLat();
      this.longitude = lngLat.lng;
      this.latitude = lngLat.lat;
      this.reverseGeocode(this.longitude, this.latitude);
      this.search(); // Recherche après le déplacement du marker
    });

    
  }

  reverseGeocode(lon: number, lat: number): void {
    const accessToken = (mapboxgl as any).accessToken;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${accessToken}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.features && data.features.length > 0) {
          this.searchQuery = data.features[0].place_name;
        }
      })
      .catch(error => {
        console.error('Erreur lors du reverse geocoding', error);
      });
  }

  searchLocation(): void {
    this.search(); // recherche manuelle par adresse
  }

  search(): void {
    const criteres = {
      specialite: this.selectedSpecialite,
      tarifMax: this.tarifMax,
      latitude: this.latitude,
      longitude: this.longitude,
      rayonKm: this.rayonKm
    };

    this.proSanteService.rechercherPro(criteres).subscribe((pros) => {
      this.pros = pros;
      this.filtrerDisponibles();
    });
  }

  filtrerDisponibles(): void {
    if (!this.rendezVousDate) {
      this.filteredPros = [...this.pros];
      return;
    }

    const dateStr = this.rendezVousDate;
    const verifs = this.pros.map(pro =>
      this.rendezVousService.getCreneauxDisponibles(pro.id!, dateStr).toPromise().then(creneaux => ({
        pro,
        disponible: Array.isArray(creneaux) && creneaux.length > 0
      }))
    );

    Promise.all(verifs).then(resultats => {
      this.filteredPros = resultats
        .filter(r => r.disponible)
        .map(r => r.pro);
    });
  }

  onProSelected(): void {
    if (this.selectedPro && this.rendezVousDate) {
      this.loadCreneauxDisponibles();
    }
  }

  onDateSelected(): void {
    this.filtrerDisponibles();
    if (this.selectedPro) {
      this.loadCreneauxDisponibles();
    }
  }

  loadCreneauxDisponibles(): void {
    if (!this.selectedPro || !this.rendezVousDate) return;

    this.rendezVousService.getCreneauxDisponibles(this.selectedPro.id!, this.rendezVousDate).subscribe((data: any) => {
      this.creneauxDisponibles = data;
    });
  }

  prendreRendezVous(): void {
    if (!this.selectedPro || !this.selectedCreneau || !this.rendezVousDate) return;

    const rdv: RendezVous = {
      proSante: this.selectedPro,
      dateHeure: new Date(`${this.rendezVousDate}T${this.selectedCreneau}`).toISOString(),
      statut: 'EN_ATTENTE',
    };

    this.rendezVousService.creerRendezVous(rdv).subscribe(() => {
      alert('Rendez-vous confirmé !');
      this.creneauxDisponibles = [];
    });
  }
}
