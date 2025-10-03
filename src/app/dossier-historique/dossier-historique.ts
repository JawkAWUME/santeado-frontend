import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { DossierMedicalService } from '../services/dossier-medical/dossier-medical.service';
import { AuthService } from '../services/auth/auth.service';
import { PatientService } from '../services/patient/patient.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-dossier-historique',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, NgSelectModule],
  templateUrl: './dossier-historique.html',
  styleUrls: ['./dossier-historique.css']
})
export class DossierHistorique implements OnInit {

  dossiers: any[] = [];
  patients: any[] = [];
  userRole: string | null = '';
  searchPatient: string = '';
  filterDate: string | null = '';
  selectedPatient: any = null;

  constructor(
    private dossierService: DossierMedicalService, 
    private authService: AuthService,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getRole();

    if (this.userRole === 'PATIENT') {
      this.loadDossiersForCurrentPatient();
    }

    if (this.userRole === 'PRO_SANTE') {
      this.loadPatients();
    }
  }

  // 🔹 Charge les dossiers du patient connecté
  loadDossiersForCurrentPatient() {
  const user = this.authService.getUser();
    console.log('Utilisateur connecté :', user.id);
  if (user && user.id) {
    this.dossierService.getDossierByPatientId(20).subscribe({
      next: (dossiers) => {
        console.log('Dossiers chargés :', dossiers);
        this.dossiers = dossiers;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des dossiers patient :', err);
      }
    });
  } else {
    console.error("⚠️ Aucun utilisateur trouvé dans le localStorage.");
  }
}

  // 🔹 Pour le médecin : charger tous les patients
  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des patients :", err);
      }
    });
  }

  // 🔹 Recherche avec filtres
  search() {
    const patientId = this.selectedPatient ? this.selectedPatient.id : undefined;
    const filterDate = this.filterDate || undefined;
    const patientName = this.searchPatient || undefined;

    this.dossierService.searchDossiers(patientId, filterDate, patientName).subscribe({
      next: (results) => {
        this.dossiers = results;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
        this.dossiers = [];
      }
    });
  }

  // 🔹 Téléchargement PDF
  downloadFiche(dossierId: number) {
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
        console.error('Erreur lors de la génération du PDF :', err);
      }
    });
  }

  // 🔹 Vérifie si le user peut télécharger un dossier
  canDownload(dossier: any): boolean {
    if (this.userRole === 'PRO_SANTE') {
      return true;
    }
    if (this.userRole === 'PATIENT') {
      const currentUser = this.authService.getUser();
      return dossier.patient?.id === currentUser?.id;
    }
    return false;
  }

  // 🔹 Ouvre le détail
  viewDossier(dossierId: number) {
    this.router.navigate(['/dossier', dossierId]);  
  }
}
