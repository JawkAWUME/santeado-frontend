import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RendezVousService } from '../services/rdv/rendez-vous.service';
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { FullCalendarModule } from '@fullcalendar/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification/notification.service';

@Component({
  selector: 'app-calendar-rendezvous',
  templateUrl: './calendar-rendezvous.component.html',
  styleUrls: ['./calendar-rendezvous.component.css'],
  standalone: true,
  imports: [SidebarComponent, FullCalendarModule, CommonModule, FormsModule],
  animations: [
    trigger('fadeIn', [transition(':enter', [style({ opacity: 0 }), animate('300ms ease-in', style({ opacity: 1 }))])]),
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))])
    ]),
    trigger('scale-in', [transition(':enter', [style({ transform: 'scale(0.9)', opacity: 0 }), animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))])])
  ]
})
export class CalendarRendezvousComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    editable: true,
    selectable: true,
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
  };

  filters = { nomPro: '', date: '', statut: '' };
  loading = false;
  showModal = false;
  toastMessage = '';
  modalData: { id: number | null, date: string, heure: string, nomPro: string } = { id: null, date: '', heure: '09:00', nomPro: '' };

  constructor(private rdvService: RendezVousService, private notificationService: NotificationService) {}

  handleDateClick(arg: any) {
    this.modalData.id = null; // Reset ID for new appointment
    this.modalData.date = arg.dateStr;
    this.modalData.nomPro = '';
    this.modalData.heure = '09:00';
    this.showModal = true;
  }

  handleEventClick(info: any) {
    const event = info.event;
    this.modalData.id = parseInt(event.id);
    this.modalData.date = event.start.toISOString().split('T')[0];
    this.modalData.heure = event.start.toTimeString().split(' ')[0].substring(0, 5);
    this.modalData.nomPro = event.title;
    this.showModal = true;
  }

  annulerRdv(){
    if(!this.modalData.id) {
      this.showToast('Veuillez sélectionner un rendez-vous à annuler.');
      return;
    } else {
      const updatedRdv = {
        id: this.modalData.id,
        dateHeure: `${this.modalData.date}T${this.modalData.heure}`,
        statut: 'ANNULÉ'
      };
      this.rdvService.modifierRendezVous(this.modalData.id, updatedRdv).subscribe({
        next: () => {
          const eventIndex = (this.calendarOptions.events as any[]).findIndex(event => event.id === this.modalData.id);
          if (eventIndex !== -1) {
            (this.calendarOptions.events as any[])[eventIndex] = {
              ...updatedRdv,
              color: updatedRdv.statut === 'ANNULÉ' ? '#e74c3c' : '#2ecc71'
            };
          }
          this.fermerModal();
          this.showToast('Rendez-vous annulé avec succès.');
        },
        error: (err) => console.error('Erreur de mise à jour', err)
      });
    }
  }

  fermerModal() {
    this.showModal = false;
    this.modalData = { id: null, date: '', heure: '09:00', nomPro: '' };
  }

  validerRdv() {
    const dateHeure = `${this.modalData.date}T${this.modalData.heure}`;
    const nouveauRdv = {
      dateHeure,
      proSante: { nom: this.modalData.nomPro },
      statut: 'EN_ATTENTE',
      patient: { nom: 'Doe John' }
    };
    if(!this.modalData.id) {
    this.rdvService.creerRendezVous(nouveauRdv).subscribe(response => {
      (this.calendarOptions.events as any[]).push({
        title: response.proSante!.nom,
        date: response.dateHeure,
        color: response.statut === 'ANNULÉ' ? '#e74c3c' : '#2ecc71'
      });
      this.fermerModal();
      this.showToast('Rendez-vous ajouté avec succès.');
    });
    } else {
      const updatedRdv = {
        id: this.modalData.id,
        dateHeure: `${this.modalData.date}T${this.modalData.heure}`,
        proSante: { nom: this.modalData.nomPro },
        statut: 'EN_ATTENTE',
        patient: { nom: 'Doe John' }
      };
      this.rdvService.modifierRendezVous(this.modalData.id, updatedRdv).subscribe({
        next: () => {
          const eventIndex = (this.calendarOptions.events as any[]).findIndex(event => event.id === this.modalData.id);
          if (eventIndex !== -1) {
            (this.calendarOptions.events as any[])[eventIndex] = {
              ...updatedRdv,
              color: updatedRdv.statut === 'ANNULÉ' ? '#e74c3c' : '#2ecc71'
            };
          }
          this.fermerModal();
          this.showToast('Rendez-vous modifié avec succès.');
        },
        error: (err) => console.error('Erreur de mise à jour', err)
      });
    }
  }

  handleEventDrop(info: any) {
    const event = info.event;
    const newDate = event.start.toISOString();
    const updatedRdv = {
      id: parseInt(event.id),
      dateHeure: newDate,
      statut: 'EN_ATTENTE'
    };

    this.rdvService.modifierRendezVous(event.id, updatedRdv).subscribe({
      next: () => this.showToast('Rendez-vous modifié avec succès.'),
      error: (err) => console.error('Erreur de mise à jour', err)
    });
  }

  appliquerFiltres() {
    this.chargerRendezVous();
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => (this.toastMessage = ''), 3000);
  }

  chargerRendezVous() {
    this.loading = true;
    this.rdvService.getRendezVousPatient(20).subscribe(data => {
      const filtered = data.filter(rdv => {
        const matchesNom = this.filters.nomPro === '' || rdv.proSante?.nom?.toLowerCase().includes(this.filters.nomPro.toLowerCase());
        const matchesDate = this.filters.date === '' || rdv.dateHeure?.startsWith(this.filters.date);
        const matchesStatut = this.filters.statut === '' || rdv.statut === this.filters.statut;
        return matchesNom && matchesDate && matchesStatut;
      });
      console.log(filtered);
      this.calendarOptions.events = filtered.map(rdv => ({
        id: rdv.id ? rdv.id.toString() : '',
        title: `${rdv.proSante!.nom}` || 'Professionnel inconnu',
        date: rdv.dateHeure,
        color: rdv.statut === 'ANNULÉ' ? '#e74c3c' : '#2ecc71'
      }));

      setTimeout(() => (this.loading = false), 400);
    });
  }

  ngOnInit(): void {
    this.chargerRendezVous();

    this.notificationService.notification$.subscribe(message => {
      this.showToast(message);
      this.chargerRendezVous(); 
    });
  }
}
