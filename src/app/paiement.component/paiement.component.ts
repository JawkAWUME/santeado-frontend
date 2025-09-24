import { Component, OnInit } from '@angular/core';
import { PaiementService } from '../services/paiement/paiement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { PaiementRequest } from '../interfaces/paiement.request';
import { DossierMedicalService } from '../services/dossier-medical/dossier-medical.service';

@Component({
  selector: 'app-paiement.component',
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent implements OnInit {
  patientId!: number;             // Patient déjà identifié
  montant: number = 0;
  selectedMethode: 'WAVE' | 'ORANGE' = 'WAVE';
  isProcessing: boolean = false;

  paiementStatus: 'SUCCES' | 'ECHEC' | 'EN_ATTENTE' | null = null;
  paiementDetails: PaiementRequest | null = null;
  factures: any[] = [];

  constructor(
    private paiementService: PaiementService,
    private dossierService: DossierMedicalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupère l'ID patient depuis la route ou un service
    this.patientId = +this.route.snapshot.params['patientId'];
    this.loadFactures();
    this.loadMontant();
  }

  /** Charge le montant total ou restant à payer pour ce patient */
  loadMontant() {
    // Exemple : récupérer via le service
    // this.paiementService.getMontantAPayer(this.patientId).subscribe({
    //   next: (m: number) => this.montant = m,
    //   error: (err: any) => console.error('Erreur montant:', err)
    // });
  }

  /** Initie un paiement via l’API */
  payer() {
    if (!this.montant || this.montant <= 0) return;

    this.isProcessing = true;
    this.paiementService.initierPaiement({
      montant: this.montant,
      patient: { id: this.patientId }, // Remplacer par l'ID du patient
      professionnel: { id: 1 }, // Remplacer par l'ID du professionnel
      methode: this.selectedMethode,
      statut: ''
    }).subscribe({
      next: (paiement) => {
        this.paiementDetails = {
          id: paiement.paiementId,
          montant: this.montant,
          patient: { id: this.patientId },
          professionnel: { id: 1 },
          methode: this.selectedMethode,
          statut: this.paiementStatus || 'EN_ATTENTE', // Statut initial
          ...paiement
        };
        // Si le backend ne renvoie pas 'statut', on met à jour le statut manuellement
        this.paiementStatus = 'EN_ATTENTE';
        this.loadFactures(); // Actualise la liste des factures
        this.isProcessing = false;
      },
      error: (err) => {
        console.error('Erreur paiement:', err);
        this.paiementStatus = 'ECHEC';
        this.isProcessing = false;
      }
    });
  }

  /** Charge les factures du patient */
  loadFactures() {
    this.paiementService.getFacturesPatient(this.patientId).subscribe({
      next: (f) => this.factures = f,
      error: (err) => console.error('Erreur factures:', err)
    });
  }

  /** Télécharge la facture PDF */
  // telechargerFacture(factureId: number) {
  //   this.paiementService.telechargerFacture(factureId).subscribe({
  //     next: (blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `facture-${factureId}.pdf`;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     },
  //     error: (err) => console.error('Erreur téléchargement facture:', err)
  //   });
  // }

  /** Permet de changer la méthode de paiement facilement */
  selectMethode(methode: 'WAVE' | 'ORANGE') {
    this.selectedMethode = methode;
  }

  /** Recharger les informations du paiement */
  refreshPaiement() {
    if (!this.paiementDetails) return;
    if (this.paiementDetails.id !== undefined) {
      this.paiementService.getDetailPaiement(this.paiementDetails.id).subscribe({
        next: (p) => {
          this.paiementDetails = p;
          this.paiementStatus = p.statut as any;
        },
        error: (err) => console.error('Erreur détail paiement:', err)
      });
    }
  }
}
