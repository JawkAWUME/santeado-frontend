import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { trigger, transition, style, animate } from '@angular/animations';
import { DossierMedical } from '../../interfaces/dossier.medical';

@Component({
  selector: 'app-correspondances',
  templateUrl: './correspondances.component.html',
  styleUrls: ['./correspondances.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' }))
      ])
    ])
  ]
})
export class CorrespondancesComponent implements OnInit {
  @Input() form!: FormGroup;

  currentStep: 'CRH' | 'CRO' | 'Lettre Confrere' = 'CRH';

  diagnosticAdmissionInput = new FormControl('');
  diagnosticSortieInput = new FormControl('');
  diagnosticOptions: string[] = [];

  recommandationInput = new FormControl('');
  complicationsInput = new FormControl('');

  /** 🔹 Inputs pour chips */
  traitementsProposesInput = new FormControl('');
  recommandationsSuiviInput = new FormControl('');

  ngOnInit(): void {
    // 🔹 Diagnostics : initialisation depuis diagnosticMedical
    const diagForm = this.diagnosticMedicalForm;
    if (diagForm) {
      this.diagnosticOptions = [
        this.diagnosticPrincipal,
        ...this.diagnosticsSecondaires
      ].filter(Boolean);

      diagForm.valueChanges.subscribe(val => {
        const { diagnosticPrincipal, diagnosticsSecondaires } = val;
        this.diagnosticOptions = [
          diagnosticPrincipal ?? '',
          ...(diagnosticsSecondaires ?? [])
        ].filter(Boolean);
      });
    }
   
      this.examensEffectues.setValue(this.formatExamens(this.rootForm.value));
    
  }

  getExamenByKeyword(keyword: string): string | undefined {
  return this.examensEffectues?.value?.find((e: string) => e.includes(keyword));
}

hasExamen(keyword: string): boolean {
  // Adjust 'examensEffectues' as per your actual FormControl/array structure
  if (this.examensEffectues && this.examensEffectues.value) {
    return this.examensEffectues.value.some((examen: string) => examen && examen.includes(keyword));
  }
  return false;
}

  public formatExamens(dossier: DossierMedical): string[] {
    const results: string[] = [];

    if (dossier.examenClinique) {
      const ec = dossier.examenClinique;
      if (ec.poids) results.push(`Poids: ${ec.poids} kg`);
      if (ec.taille) results.push(`Taille: ${ec.taille} cm`);
      if (ec.tensionArterielle) results.push(`Tension artérielle: ${ec.tensionArterielle}`);
      if (ec.temperature) results.push(`Température: ${ec.temperature} °C`);
      if (ec.frequenceCardiaque) results.push(`Fréquence cardiaque: ${ec.frequenceCardiaque} bpm`);
      if (ec.saturationOxygene) results.push(`Saturation en oxygène: ${ec.saturationOxygene}%`);
      if (ec.bilanPhysique) {
        ec.bilanPhysique.forEach((value, key) => {
          results.push(`Bilan ${key}: ${value}`);
        });
      }
      if (ec.observations && ec.observations.length > 0) {
        results.push('Observations: ' + ec.observations.join(', '));
      }
    }

    if (dossier.examensComplementaires) {
      const ex = dossier.examensComplementaires;
      Object.entries(ex).forEach(([type, liste]) => {
        if (Array.isArray(liste) && liste.length > 0) {
          results.push(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${liste.join(', ')}`);
        }
      });
    }

    return results;
  }
  
  /** Root FormGroup */
  get rootForm(): FormGroup {
    let parent: any = this.form;
    while (parent?.parent instanceof FormGroup) {
      parent = parent.parent;
    }
    return parent as FormGroup;
  }

  /** Sous-FormGroups */
  get compteRenduHospitalisation(): FormGroup {
    return this.form.get('compteRenduHospitalisation') as FormGroup;
  }

  get compteRenduOperatoire(): FormGroup {
    return this.form.get('compteRenduOperatoire') as FormGroup;
  }

  get diagnosticMedicalForm(): FormGroup {
    return this.rootForm.get('diagnosticMedical') as FormGroup;
  }

  /** 🔹 FormControls CRH */
  get dateAdmission(): FormControl { return this.compteRenduHospitalisation.get('dateAdmission') as FormControl; }
  get dateSortie(): FormControl { return this.compteRenduHospitalisation.get('dateSortie') as FormControl; }
  get diagnosticAdmission(): FormControl<string[]> { return this.compteRenduHospitalisation.get('diagnosticAdmission') as FormControl<string[]>; }
  get diagnosticSortie(): FormControl<string[]> { return this.compteRenduHospitalisation.get('diagnosticSortie') as FormControl<string[]>; }
  get examensEffectues(): FormControl<string[]> { return this.compteRenduHospitalisation.get('examensEffectues') as FormControl<string[]>; }
  get recommandationsSortie(): FormControl<string[]> { return this.compteRenduHospitalisation.get('recommandationsSortie') as FormControl<string[]>; }
  get traitements(): FormArray { return this.compteRenduHospitalisation.get('traitements') as FormArray; }
  get evolutions(): FormArray { return this.compteRenduHospitalisation.get('evolution') as FormArray; }

  /** 🔹 FormControls CRO */
  get nomIntervention(): FormControl { return this.compteRenduOperatoire.get('nomIntervention') as FormControl; }
  get indicationOperatoire(): FormControl { return this.compteRenduOperatoire.get('indicationOperatoire') as FormControl; }
  get descriptionActe(): FormControl { return this.compteRenduOperatoire.get('descriptionActe') as FormControl; }
  get conclusion(): FormControl { return this.compteRenduOperatoire.get('conclusion') as FormControl; }
  get complications(): FormControl<string[]> { return this.compteRenduOperatoire.get('complications') as FormControl<string[]>; }

  /** 🔹 Diagnostics Medical */
  get diagnosticPrincipal(): string { return this.diagnosticMedicalForm.get('diagnosticPrincipal')?.value; }
  get diagnosticsSecondaires(): string[] { return this.diagnosticMedicalForm.get('diagnosticsSecondaires')?.value || []; }

  get lettreConfrere(): FormGroup {
      return this.form.get('lettreConfrere') as FormGroup;
  }

  get motifConsultation():  FormControl { return this.lettreConfrere.get('motifConsultation') as FormControl; }
  get diagnosticLettre(): FormControl { return this.lettreConfrere.get('diagnostic') as FormControl;}
  get traitementsProposes(): FormControl<string[]> { return this.lettreConfrere.get('traitementsProposes') as FormControl<string[]>}
  get recommandationsSuivi(): FormControl<string[]> { return this.lettreConfrere.get('recommandationsSuivi') as FormControl<string[]>; }
  get resultatsExamens(): FormControl<string[]> { return this.lettreConfrere.get('resultatsExamens') as FormControl<string[]>; }

  /** 🔹 Navigation étapes */
  goToCRO() {
    if (this.compteRenduHospitalisation.valid) {
      this.currentStep = 'CRO';
    } else {
      this.compteRenduHospitalisation.markAllAsTouched();
    }
  }

  goBackToCRH() {
    this.currentStep = 'CRH';
  }

  submitCRO() {
    if (this.compteRenduOperatoire.valid) {
      console.log('Compte Rendu Opératoire soumis:', this.compteRenduOperatoire.value);
    } else {
      this.compteRenduOperatoire.markAllAsTouched();
    }
  }

  /** 🔹 Gestion Chips */
  addDiagnosticAdmission(value: string) {
    if (!value) return;
    const current = this.diagnosticAdmission.value ?? [];
    if (!current.includes(value)) this.diagnosticAdmission.setValue([...current, value]);
    this.diagnosticAdmissionInput.setValue('');
  }

  removeDiagnosticAdmission(value: string) {
    const current = this.diagnosticAdmission.value ?? [];
    this.diagnosticAdmission.setValue(current.filter(d => d !== value));
  }

  addDiagnosticSortie(value: string) {
    if (!value) return;
    const current = this.diagnosticSortie.value ?? [];
    if (!current.includes(value)) this.diagnosticSortie.setValue([...current, value]);
    this.diagnosticSortieInput.setValue('');
  }

  removeDiagnosticSortie(value: string) {
    const current = this.diagnosticSortie.value ?? [];
    this.diagnosticSortie.setValue(current.filter(d => d !== value));
  }

  addRecommandation(value: string) {
    if (!value) return;
    const current = this.recommandationsSortie.value ?? [];
    if (!current.includes(value)) this.recommandationsSortie.setValue([...current, value]);
    this.recommandationInput.setValue('');
  }

  removeRecommandation(value: string) {
    const current = this.recommandationsSortie.value ?? [];
    this.recommandationsSortie.setValue(current.filter(r => r !== value));
  }

  addComplication(value: string) {
    if (!value) return;
    const current = this.complications.value ?? [];
    if (!current.includes(value)) this.complications.setValue([...current, value]);
    this.complicationsInput.setValue('');
  }

  removeComplication(value: string) {
    const current = this.complications.value ?? [];
    this.complications.setValue(current.filter(c => c !== value));
  }
}
