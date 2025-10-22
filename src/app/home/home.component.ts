import { Component, AfterViewInit, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProSanteService } from '../services/pro-sante/pro-sante.service';
import { ProSante } from '../interfaces/pro-sante';
import { RendezVousService } from '../services/rdv/rendez-vous.service';
import { RendezVous } from '../interfaces/rendez-vous';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnInit {
  map!: mapboxgl.Map;
  latitude: number = 0;
  longitude: number = 0;
  rayonKm: number = 10;

  searchQuery: string = '';
  specialites: string[] = [
    "Généraliste", "Pédiatre", "Cardiologue", "Gynécologue", "Dentiste",
    "Dermatologue", "Ophtalmologue", "Orthopédiste", "ORL", "Neurologue"
  ];

  selectedSpecialite: string = '';
  tarifMax: number = 100;
  marker!: mapboxgl.Marker;
  pros: ProSante[] = [];
  filteredPros: ProSante[] = [];

  selectedPro: ProSante | null = null;
  rendezVousDate: string = '';
  creneauxDisponibles: string[] = [];
  selectedCreneau: string = '';

  showErrorModal: boolean = false;
  showSuccessModal: boolean = false;

  constructor(
    private proSanteService: ProSanteService,
    private rendezVousService: RendezVousService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    if (!currentUser || currentUser.role !== 'PATIENT') {
      this.router.navigate(['/tournee-optimisee']);
    }
  }

  ngAfterViewInit(): void {
    this.detectLocation();
  }

  detectLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          this.initMap();
          this.reverseGeocode(this.longitude, this.latitude);
          this.search();

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

    this.marker = new mapboxgl.Marker({ color: 'blue', draggable: true })
      .setLngLat([this.longitude, this.latitude])
      .addTo(this.map);

    this.marker.on('dragend', () => {
      const lngLat = this.marker.getLngLat();
      this.longitude = lngLat.lng;
      this.latitude = lngLat.lat;
      this.reverseGeocode(this.longitude, this.latitude);
      this.search();
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
    this.search();
  }

  search(): void {
    const criteres = {
      specialite: this.selectedSpecialite,
      tarifMax: this.tarifMax,
      latitude: this.latitude,
      longitude: this.longitude,
      rayonKm: this.rayonKm
    };

    this.proSanteService.rechercherPro(criteres).subscribe((pros: ProSante[] | null) => {
      this.pros = pros ?? [];
      this.filtrerDisponibles();
    });
  }

  async filtrerDisponibles(): Promise<void> {
    if (!this.pros || this.pros.length === 0) {
      this.filteredPros = [];
      return;
    }

    if (!this.rendezVousDate) {
      this.filteredPros = [...this.pros];
      return;
    }

    const dateStr = this.rendezVousDate;
    const verifs = this.pros.map(async pro => {
      const creneaux = await firstValueFrom(this.rendezVousService.getCreneauxDisponibles(pro.id!, dateStr));
      return { pro, disponible: Array.isArray(creneaux) && creneaux.length > 0 };
    });

    const resultats = await Promise.all(verifs);
    this.filteredPros = resultats.filter(r => r.disponible).map(r => r.pro);
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
      this.creneauxDisponibles = Array.isArray(data) ? data : [];
    });
  }

  prendreRendezVous(): void {
    if (!this.selectedPro || !this.selectedCreneau || !this.rendezVousDate) {
      this.showErrorModal = true;
      return;
    }

    const dateStr = `${this.rendezVousDate}T${this.selectedCreneau}`;
    const dateObj = new Date(dateStr);

    if (isNaN(dateObj.getTime())) {
      alert("La date ou le créneau est invalide.");
      return;
    }

    const rdv: RendezVous = {
      proSante: this.selectedPro,
      patient: this.authService.getUser(),
      dateHeure: dateObj.toISOString(),
      statut: 'EN_ATTENTE',
    };

    this.rendezVousService.creerRendezVous(rdv).subscribe({
      next: () => {
        this.showSuccessModal = true;
        this.creneauxDisponibles = [];
      },
      error: (err) => {
        console.error('Erreur prise de RDV', err);
        this.showErrorModal = true;
      }
    });
  }

  fermerErrorModal(): void {
    this.showErrorModal = false;
  }

  fermerSuccessModal(): void {
    this.showSuccessModal = false;
  }

  allerMesRdv(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/rdv']);
  }

  allerMesFiches(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/dossiers-historique']);
  }
}
