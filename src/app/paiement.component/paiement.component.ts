import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { PaiementService } from '../services/paiement/paiement.service';
import { PaiementRequest } from '../interfaces/paiement.request';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrCodeComponent } from '../qr-code/qr-code';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QrCodeComponent,
    SidebarComponent
  ],
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css']
})
export class PaiementComponent implements OnInit {

  montant: number = 0;
  selectedMethode: 'Wave' | 'Orange Money' | null = null;
  isProcessing = false;

  paiementStatus: 'SUCCES' | 'ECHEC' | 'EN_ATTENTE' | null = null;
  paiementDetails: any = null;

  // QR
  qrCodeData: string | null = null;
  showQrModal = false;

  private pollingSub: Subscription | null = null;

  constructor(private paiementService: PaiementService) {}

  ngOnInit(): void {
    // Ici tu pourrais charger un montant par défaut si nécessaire
  }

  selectMethode(methode: 'Wave' | 'Orange Money') {
    this.selectedMethode = methode;

    if (this.montant > 0) {
      this.initierPaiement();
    } else {
      alert('Veuillez saisir un montant avant de choisir la méthode.');
    }
  }

  initierPaiement() {
    if (!this.selectedMethode) return;

    this.isProcessing = true;

    const dto: PaiementRequest = {
      montant: this.montant,
      methode: this.selectedMethode,
      patient: { id: 1 }, // à remplacer par ton patientId réel
      professionnel: { id: 21 },
      statut: 'EN_ATTENTE'
    };

    console.log("DTO Paiement: ", dto);

    this.paiementService.initierPaiement(dto).subscribe({
      next: (res) => {
        // Génération de l'URL QR en fonction de la méthode choisie
        if (this.selectedMethode === 'Wave') {
          this.qrCodeData = `https://pay.wave.com/c/cos-209t5kqw81apr?a=${this.montant}&c=XOF&m=${encodeURIComponent("Paiement consultation")}`;
        } else if (this.selectedMethode === 'Orange Money') {
          this.qrCodeData = `https://qrcode.orange.sn/dmeQWeafgYJPdJlC7lF2?a=${this.montant}&c=XOF&m=${encodeURIComponent("Paiement consultation")}`;
        }

        console.log("QR Code URL générée:", this.qrCodeData);

        this.showQrModal = true;
        this.isProcessing = false;

        // Lancer le polling pour suivre le statut
        this.pollPaiement(res.paiementId);
      },
      error: (err) => {
        console.error(err);
        this.isProcessing = false;
        alert('Erreur lors de l\'initiation du paiement');
      }
    });
  }

  // Polling toutes les 5s pour vérifier statut
  pollPaiement(paiementId: string) {
    this.pollingSub = interval(5000).subscribe(() => {
      this.paiementService.getDetailPaiement(+paiementId).subscribe({
        next: (res) => {
          this.paiementStatus = res.statut;
          this.paiementDetails = res;

          if (res.statut === 'SUCCES' || res.statut === 'ECHEC') {
            this.pollingSub?.unsubscribe();
          }
        }
      });
    });
  }

  closeQrModal() {
    this.showQrModal = false;
    this.qrCodeData = null;
    this.pollingSub?.unsubscribe();
  }
}
