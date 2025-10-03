import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-code.html'
})
export class QrCodeComponent implements OnChanges {
  /** Texte ou URL encodée dans le QR */
  @Input() value!: string;

  /** Taille en pixels */
  @Input() size: number = 200;

  /** Texte alternatif pour l’accessibilité */
  @Input() altText: string = 'QR Code';

  /** Légende affichée sous le QR code */
  @Input() caption: string | null = null;

  /** Données générées du QR */
  qrCodeSrc: string | null = null;

  ngOnChanges() {
    if (!this.value) {
      this.qrCodeSrc = null;
      return;
    }

    QRCode.toDataURL(this.value, {
      width: this.size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then(url => this.qrCodeSrc = url)
      .catch(err => {
        console.error('Erreur génération QR:', err);
        this.qrCodeSrc = null;
      });
  }
}
