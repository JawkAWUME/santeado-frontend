import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { DossierMedicalService } from '../services/dossier-medical/dossier-medical.service';
import { AuthService } from '../services/auth/auth.service';
import { Patient } from '../interfaces/patient';
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

constructor(private dossierService: DossierMedicalService, 
            private authService: AuthService,
            private patientService: PatientService,
            private router: Router) {}

ngOnInit() {
  this.userRole = this.authService.getRole();
  this.loadDossiers();
  if (this.userRole === 'PROFESSIONNEL_SANTE') {
    this.loadPatients();
  }
}

loadDossiers() {
  this.dossierService.getMesDossiers().subscribe(dossiers => {
    this.dossiers = dossiers;
  });
}

loadPatients() {
  this.patientService.getPatients().subscribe(patients => {
    this.patients = patients;
  });
}


search() {
  const patientId = this.selectedPatient ? this.selectedPatient.id : undefined;
  const filterDate = this.filterDate || undefined;
  const patientName = this.searchPatient || undefined;

  this.dossierService.searchDossiers(patientId, filterDate, patientName)
    .subscribe({
      next: (results) => {
        this.dossiers = results;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
        this.dossiers = [];
      }
    });
}

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

canDownload(dossier: any): boolean {
    if (this.userRole === 'PROFESSIONNEL_SANTE') {
        return true;
    }
    if (this.userRole === 'PATIENT') {
        let canDownload = false;
        this.authService.getCurrentUser().subscribe(user => {
            canDownload = dossier.patient.id === user.id;
        });
        return canDownload;
    }
    return false;
}

viewDossier(dossierId: number) {
  this.router.navigate(['/dossier', dossierId]);  
}

}
