import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaiementService } from '../services/paiement/paiement.service';
import { AuthService } from '../services/auth/auth.service';
import { Subscription, interval, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrCodeComponent } from '../qr-code/qr-code';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { Facture } from '../interfaces/facture';
import { Paiement } from '../interfaces/paiement';
import { PaiementRequest } from '../interfaces/paiement.request';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [CommonModule, FormsModule, QrCodeComponent, SidebarComponent],
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css']
})
export class PaiementComponent implements OnInit, OnDestroy {

  factures: Facture[] = [];
  qrCodeData: string | null = null;
  showQrModal = false;
  paiementStatus: string | null = null;
  paiementDetails: Paiement | null = null;
  pollingSub: Subscription | null = null;

  searchTerm: string = '';
  filterStatus: string = '';

  totalFactures: number = 0;
  totalPaye: number = 0;
  totalRestant: number = 0;

  constructor(
    private paiementService: PaiementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFactures();
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  // === Chargement des factures avec fallback mock si aucune facture réelle ===
  loadFactures() {
    const user = this.authService.getUser();
    const patientId = user?.id || 10; // fallback pour tests

    this.paiementService.getFacturesPatient(patientId).subscribe({
      next: (f) => {
        if (f && f.length > 0) {
          // sécuriser chaque facture pour éviter paiement undefined
          this.factures = f.map(facture => ({
            ...facture,
            paiement: facture.paiement || undefined,
            montantASolder: null,
            methode: facture.paiement?.methode || 'Wave'
          }));
        } else {
          // fallback mock si aucune facture réelle
          this.factures = [
            {
              id: 1,
              numero: 'FAC-2025-001',
              dateEmission: new Date().toISOString(),
              paiement: {
                montant: 25000,
                patient: { id: patientId },
                professionnel: { id: 21 },
                id: 0,
                datePaiement: '',
                methode: '',
                statut: ''
              },
              montantASolder: null,
              methode: 'Wave'
            },
            {
              id: 2,
              numero: 'FAC-2025-002',
              dateEmission: new Date().toISOString(),
              paiement: {
                montant: 15000,
                patient: { id: patientId },
                professionnel: { id: 21 },
                id: 0,
                datePaiement: '',
                methode: '',
                statut: ''
              },
              montantASolder: null,
              methode: 'Orange Money'
            }
          ];
        }
        console.log("Factures chargées :", this.factures);
        this.calculateTotals();
      },
      error: (err) => console.error("Erreur lors du chargement des factures", err)
    });
  }

  // === Calcul des totaux ===
  calculateTotals() {
    this.totalFactures = this.factures.reduce((sum, f) => sum + (f.paiement?.montant || 0), 0);
    this.totalPaye = this.factures.reduce((sum, f) => {
      if (f.paiement && f.paiement.statut === 'SUCCES') return sum + (f.montantASolder || 0);
      return sum;
    }, 0);
    this.totalRestant = this.totalFactures - this.totalPaye;
  }

  // === Filtrer et rechercher ===
  filteredFactures(): Facture[] {
    return this.factures.filter(f => {
      const matchesSearch = f.numero.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.filterStatus || f.paiement?.statut === this.filterStatus;
      return matchesSearch && matchesStatus;
    });
  }

  // === Initier paiement ===
  initierPaiement(facture: Facture) {
    if (!facture.paiement) {
      console.warn("Paiement non disponible pour cette facture :", facture);
      return;
    }

    const dto: PaiementRequest = {
      datePaiement: new Date().toISOString(),
      montant: facture.montantASolder || facture.paiement.montant,
      methode: facture.methode as 'Wave' | 'Orange Money',
      patient: { id: facture.paiement.patient?.id },
      professionnel: { id: facture.paiement.professionnel?.id },
      statut: 'EN_ATTENTE'
    };

    this.paiementService.initierPaiementPourFacture(facture.id, dto).subscribe({
      next: (res) => {
        if (dto.methode === "Wave"){
          res.paiementUrl=`https://pay.wave.com/c/cos-209t5kqw81apr?a=${dto.montant}&c=XOF&m=Paiement%20facture%20${facture.numero} par ${facture.paiement?.patient?.nom}`;
        }
        this.qrCodeData = res.paiementUrl;
        this.showQrModal = true;
        this.pollPaiement(res.paiementId);
      },
      error: (err) => console.error("Erreur initier paiement", err, dto)
    });
  }

  // === Polling paiement ===
  pollPaiement(paiementId: string) {
    this.pollingSub = interval(5000).pipe(
      switchMap(() => this.paiementService.getDetailPaiement(+paiementId)),
      takeUntil(timer(120000))
    ).subscribe({
      next: (res) => {
        this.paiementStatus = res.statut;
        this.paiementDetails = res;
        this.calculateTotals();

        if (['SUCCES', 'ECHEC'].includes(res.statut)) {
          this.pollingSub?.unsubscribe();
        }
      },
      error: (err) => {
        console.error("Erreur polling paiement", err);
        this.pollingSub?.unsubscribe();
      }
    });
  }

  // === Fermer modal QR ===
  closeQrModal() {
    this.showQrModal = false;
    this.qrCodeData = null;
    this.pollingSub?.unsubscribe();
  }
}
