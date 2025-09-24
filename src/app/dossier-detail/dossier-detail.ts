import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DossierMedicalService } from '../services/dossier-medical/dossier-medical.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dossier-detail',
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './dossier-detail.html',
  styleUrl: './dossier-detail.css'
})
export class DossierDetail implements OnInit {

  dossier: any;
  activeTab: string = 'infos'; // Onglet par défaut

  constructor(
    private route: ActivatedRoute,
    private dossierService: DossierMedicalService
  ) {}

  ngOnInit(): void {
    const dossierId = Number(this.route.snapshot.paramMap.get('id'));
    if (dossierId) {
      this.loadDossier(dossierId);
    }
  }

  loadDossier(id: number): void {
    this.dossierService.getDossierById(id).subscribe({
      next: (data) => {
        this.dossier = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du dossier :', err);
      }
    });
  }

  downloadFiche(dossierId: number): void {
    this.dossierService.generateFiche(dossierId).subscribe({
      next: (pdfBlob) => {
        const fileURL = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `fiche-${dossierId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(fileURL);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du PDF :', err);
      }
    });
  }
}