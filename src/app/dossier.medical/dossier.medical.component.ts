import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DossierMedical } from '../interfaces/dossier.medical';
import { DossierMedicalService } from '../services/dossier-medical/dossier-medical.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AntecedentsFormComponent } from './antecedents-form/antecedents-form.component';
import { ExamenCliniqueFormComponent } from './examen-clinique-form/examen-clinique-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { ExamensComplementairesComponent } from './examens.complementaires/examens.complementaires.component';
import { TraitementsComponent } from './traitements/traitements.component';
import { PhoneRegexService, CountryCallingCode } from '../services/phone.regex/phone.regex.service';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { InfosUrgenceComponent } from './infos.urgence/infos.urgence.component';
import { DiagnosticMedicalComponent } from './diagnostic-medical/diagnostic-medical.component';
import { EvolutionSuiviComponent } from './evolution-suivi/evolution-suivi.component';
import { CorrespondancesComponent } from "./correspondances/correspondances.component";
import { TraitementPrescription } from '../interfaces/traitement-prescription';
import { EvolutionSuivi } from '../interfaces/evolution-suivi';
import { DiagnosticMedical } from '../interfaces/diagnostic.medical';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { PatientService } from '../services/patient/patient.service';
import { Patient } from '../interfaces/patient';

@Component({
  selector: 'app-dossier.medical',
  imports: [
    AntecedentsFormComponent,
    ExamenCliniqueFormComponent,
    ExamensComplementairesComponent,
    DiagnosticMedicalComponent,
    TraitementsComponent,
    InfosUrgenceComponent,
    EvolutionSuiviComponent,
    CorrespondancesComponent,
    MatFormFieldModule,
    MatStepperModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
],
  templateUrl: './dossier.medical.component.html',
  styleUrl: './dossier.medical.component.css',
  animations: [
    trigger('stepContentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('900ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('900ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' })),
      ]),
    ]),
  ],
})
export class DossierMedicalComponent {
  dossierForm: FormGroup;
  dossierMedical!: DossierMedical;
  patientId!: number;
  currentPatient!: Patient | null; // Type selon ton interface Patient
  countryCallingCodes: CountryCallingCode[] = [];
  selectedCallingCode?: CountryCallingCode;
  filteredCodes: CountryCallingCode[] = [];

  steps: any[] = [];
  visibleSteps: any[] = [];
  activeStepIndex = 0; // Index global
  currentIndex = 0; // Début du groupe visible
  groupSize = 3; // Nombre de steps visibles à la fois

  constructor(
    private fb: FormBuilder,
    private dossierService: DossierMedicalService,
    private phoneRegexService: PhoneRegexService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private patientService: PatientService
  ) {
    // Initialisation du formulaire principal
    this.dossierForm = this.fb.group({
      infos: this.fb.group({
        couvertureSociale: [''],
        personneUrgence: [''],
        indicatifUrgence: ['', Validators.required],
        telPersonneUrgence: ['', Validators.required],
      }),
      antecedents: this.fb.group({
        antecedentsMedicaux: this.fb.array([]),
        antecedentsChirurgicaux: this.fb.array([]),
        antecedentsObstetricaux: this.fb.array([]),
        antecedentsPsychologiques: this.fb.array([]),
        maladiesFamiliales: this.fb.array([]),
        allergies: this.fb.array([]),
      }),
      examenClinique: this.fb.group({
        poids: [0],
        taille: [0],
        tensionArterielle: [''],
        temperature: [0],
        frequenceCardiaque: [0],
        saturationOxygene: [0],
        bilanPhysique: this.fb.array([]),
        observations: this.fb.array([]),
      }),
      examensComplementaires: this.fb.group({
        analysesSanguines: this.fb.array([]),
        analysesUrines: this.fb.array([]),
        radiographies: this.fb.array([]),
        echographies: this.fb.array([]),
        irm: this.fb.array([]),
        testsSpeciaux: this.fb.array([]),
        scanners: this.fb.array([]),
      }),
      traitements: this.fb.group({
        medicaments: this.fb.array([]),
        soinsParamedicaux: this.fb.array([]),
        interventions: this.fb.array([]),
      }),
      diagnosticMedical: this.fb.group({
            diagnosticPrincipal: [''],
            codePrincipal: [''],
            systemeCodification: [''],
            diagnosticsSecondaires: this.fb.array([])
      }),
      evolutionSuivi: this.fb.group({
        notesEvolution: this.fb.array([]),
        consultations: this.fb.array([]),
        courbes: this.fb.array([]),
      }),
      correspondances: this.fb.group({
        compteRenduHospitalisation: this.fb.group({
          dateAdmission: [''],
          dateSortie: [''],
          diagnosticAdmission: [''],
          diagnosticSortie: [''],
          examensEffectues: [''],
          traitements: this.fb.array([]),
          evolution: this.fb.array([]),
          recommandationsSortie: ['']
        }),
        compteRenduOperatoire: this.fb.group({
          nomIntervention: [''],
          indicationOperatoire: [''],
          descriptionActe: [''],
          conclusion: [''],
          complications: this.fb.array([]),
        }),
        lettreConfrere: this.fb.group({
          motifConsultation: [''],
          diagnostic: [''],
          traitementsProposes: this.fb.array([]),
          recommandationsSuivi: this.fb.array([]),
          resultatsExamens: this.fb.array([])
        })
      })
        });

        // Définition des steps
    this.steps = [
      { key: 'infos', title: 'Infos personnelles', subtitle: 'Couverture & urgence', form: this.infosForm },
      { key: 'antecedents', title: 'Antécédents', subtitle: 'Historique médical', form: this.antecedentsForm },
      { key: 'examenClinique', title: 'Examen Clinique', subtitle: 'Analyse du jour', form: this.examenCliniqueForm },
      { key: 'examensComplementaires', title: 'Examens Complémentaires', subtitle: 'Résultats médicaux', form: this.examensComplementairesForm },
      { key: 'traitements', title: 'Traitements', subtitle: 'Plan thérapeutique', form: this.traitementsForm },
      { key: 'diagnosticMedical', title: 'Diagnostic Médical', subtitle: 'Évaluation clinique', form: this.diagnosticMedicalForm },
      { key: 'evolutionSuivi', title: 'Évolution & Suivi', subtitle: 'Notes et courbes', form: this.evolutionSuiviForm},
      { key: 'correspondances', title: 'Correspondances', subtitle: 'Médecin référent', form: this.correspondancesForm },

    ];
  }

 ngOnInit(): void {
  this.patientId = +this.route.snapshot.paramMap.get('id')!;
  console.log(this.patientId);
  this.updateVisibleSteps();

  // Charger les indicatifs téléphoniques
  this.phoneRegexService.getCountryCallingCodes().subscribe({
    next: (codes) => {
      this.countryCallingCodes = codes;
      const indicatif = this.infosForm.get('indicatifUrgence')?.value;
      if (indicatif) {
        this.selectedCallingCode = this.countryCallingCodes.find(c => c.code === indicatif);
      }
    },
    error: (err) => console.error('Erreur chargement indicatifs téléphoniques', err),
  });

  // ✅ Récupérer l’utilisateur connecté
  const currentUser = this.authService.getUser();
  console.log('👤 Utilisateur connecté:', currentUser);

  if (currentUser && currentUser.id) {
    // ✅ Récupérer d’abord le patient
    this.patientService.getPatientById(this.patientId).pipe(
      switchMap(patient => {
        this.currentPatient = patient; // on garde le patient en mémoire
        console.log('🧍 Patient chargé:', patient);

        // Ensuite → charger le dossier pour ce patient
        return this.dossierService.getDossierByPatientId(this.patientId).pipe(
          map(dossiers => dossiers.length > 0 ? dossiers[dossiers.length - 1] : null),
          switchMap(dossier => {
            if (dossier) {
              this.dossierMedical = dossier;
              this.patchForm(dossier); // ici tu peux injecter currentPatient
              this.setupPhoneValidation();
              return of(dossier);
            } else {
              // Aucun dossier → on en crée un pour ce patient
              return this.dossierService.creerDossier(this.patientId).pipe(
                map(newDossier => {
                  this.dossierMedical = newDossier;
                  return newDossier;
                })
              );
            }
          })
        );
      }),
      catchError(err => {
        console.error("❌ Erreur lors de la récupération du patient/dossier:", err);
        return of(null);
      })
    ).subscribe();
  } else {
    console.error("⚠️ Impossible de récupérer l’utilisateur connecté.");
  }

  // Revalidation dynamique
  this.infosForm.get('indicatifUrgence')?.valueChanges.subscribe(() => this.setupPhoneValidation());
  this.infosForm.get('telPersonneUrgence')?.valueChanges.subscribe(() => this.setupPhoneValidation());
}

  getStepIcon(key: string): string {
  switch (key) {
    case 'infos': return 'bi-person-circle';
    case 'antecedents': return 'bi-journal-medical';
    case 'examenClinique': return 'bi-clipboard-heart';
    case 'examensComplementaires': return 'bi-file-medical';
    case 'traitements': return 'bi-capsule';
    default: return 'bi-circle';
  }
}


  /** Patch form avec données dossier */
  patchForm(dossier: DossierMedical) {
    const currentUser = this.authService.getUser();
    if (!currentUser || !currentUser.id) {
      console.error("⚠️ Impossible de récupérer l’utilisateur connecté.");
      return;
    }

    this.dossierForm.patchValue({
      infos: {
        couvertureSociale: dossier.couvertureSociale,
        personneUrgence: dossier.personneUrgence,
        indicatifUrgence: dossier.telPersonneUrgence
          ? this.getIndicatifFromNumber(dossier.telPersonneUrgence)
          : '',
        telPersonneUrgence: dossier.telPersonneUrgence
          ? this.stripIndicatifFromNumber(dossier.telPersonneUrgence)
          : '',
      },
      antecedents: dossier.antecedents || {},
      examenClinique: dossier.examenClinique || {},
      examensComplementaires: dossier.examensComplementaires || {},
      traitements: dossier.traitements || {},
      diagnosticMedical: dossier.diagnosticMedical || {
        diagnosticPrincipal: '',
        codePrincipal: '',
        systemeCodification: 'ICD-10',
        diagnosticsSecondaires: []
      },
      evolutionSuivi: dossier.evolutionSuivi || {},
      correspondances: {
      compteRenduHospitalisation: {
        dateAdmission: dossier.correspondances?.compteRenduHospitalisation?.dateAdmission || '',
        dateSortie: dossier.correspondances?.compteRenduHospitalisation?.dateSortie || '',
        diagnosticAdmission: dossier.correspondances?.compteRenduHospitalisation?.diagnosticAdmission || '',
        diagnosticSortie: dossier.correspondances?.compteRenduHospitalisation?.diagnosticSortie || '',
        examensEffectues: this.formatExamens(dossier),
        traitements: this.formatTraitements(dossier.traitements),
        evolution: this.formatEvolutions(dossier.evolutionSuivi),
        recommandationsSortie: dossier.correspondances?.compteRenduHospitalisation?.recommandationsSortie || [],
        dateRedaction: dossier.correspondances?.compteRenduHospitalisation?.dateRedaction || new Date(),
        auteur: currentUser,
        destinataire: dossier.correspondances?.compteRenduHospitalisation?.destinataire || null,
        patient: this.currentPatient
      },
      compteRenduOperatoire: {
        nomIntervention: dossier.correspondances?.compteRenduOperatoire?.nomIntervention || '',
        indicationOperatoire: dossier.correspondances?.compteRenduOperatoire?.indicationOperatoire || '',
        descriptionActe: dossier.correspondances?.compteRenduOperatoire?.descriptionActe || '',
        conclusion: dossier.correspondances?.compteRenduOperatoire?.conclusion || '',
        complications: dossier.correspondances?.compteRenduOperatoire?.complications || [],
         auteur: currentUser,
        destinataire: dossier.correspondances?.compteRenduHospitalisation?.destinataire || null,
        patient: this.currentPatient
      },
    
    }
    });

  }

public formatExamens(dossier: DossierMedical): string[] {
    const results: string[] = [];
    if(dossier.examenClinique) {
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

    if(dossier.examensComplementaires){
      const ex = dossier.examensComplementaires;
      Object.entries(ex).forEach(([type, liste]) => {
        if (Array.isArray(liste) && liste.length > 0) {
          results.push(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${liste.join(', ')}`);
        }
      });
    }

    return results;
  }
  private formatTraitements(traitements: TraitementPrescription | undefined): string[] {
      if (!traitements) return [];

      const formatted: string[] = [];
      traitements.medicaments?.forEach(med => {
        formatted.push(`${med.nom} : ${med.posologie} (${med.voie}, ${med.duree} jours)`)
      })

      traitements.interventions?.forEach(interv => {
        formatted.push(`${interv.nom} : ${interv.objectif || 'Objectif non spécifié'}`)
      })

      traitements.soinsParamedicaux?.forEach(soin => {
        formatted.push(`${soin.typeSoin} : ${soin.frequence}`)
      })

      return formatted;
  }

  private formatEvolutions(evolution: EvolutionSuivi | undefined): string[] {
    return evolution?.notesEvolution || [];
  }

  /** Pagination des steps */
  updateVisibleSteps() {
  // Si le step actif dépasse la fenêtre visible à droite
  const totalSteps = this.steps.length;
  const maxVisible = this.groupSize;
  let start = this.activeStepIndex;

  if (this.activeStepIndex >= this.currentIndex + maxVisible) {
    this.currentIndex = Math.max(0, this.activeStepIndex - maxVisible + 1);
  }
  

  if (start < 0) {
    start = 0;
  }

  this.currentIndex = start;
  this.visibleSteps = this.steps.slice(start, start + maxVisible);
}

    nextStep(): void {
    if (!this.isStepValid(this.activeStepIndex)) return;
    this.savePartial();
    console.log(this.steps[this.activeStepIndex].key, '✔ Étape validée');
    if (this.activeStepIndex < this.steps.length - 1) {
      this.activeStepIndex++;
      console.log('✔ Étape suivante:', this.steps[this.activeStepIndex].key);
      this.updateVisibleSteps();
    } else {
      this.finalize();
    }
  }

  previousStep(): void {
    if (this.activeStepIndex > 0) {
      this.savePartial();
      this.activeStepIndex--;
      this.updateVisibleSteps();
    }
  }

  jumpToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.savePartial();
      this.activeStepIndex = index;
      this.updateVisibleSteps();
    }
  }

  isStepValid(stepIndex: number): boolean {
    const stepForm = this.steps[stepIndex]?.form;
    if (!stepForm) return true;
    if (stepForm.invalid) {
      stepForm.markAllAsTouched();
      return false;
    }
    return true;
  }

  resetStepper(): void {
    this.activeStepIndex = 0;
    this.updateVisibleSteps();
    this.dossierForm.reset();
  }

  savePartial() {
  const id = this.dossierMedical.id;
  console.log('💾 Sauvegarde partielle du dossier ID:', id);

  const data = this.dossierForm.value;

  // ✅ Fusion indicatif + numéro
  if (data.infos.indicatifUrgence && data.infos.telPersonneUrgence) {
    data.infos.telPersonneUrgence =
      data.infos.indicatifUrgence + data.infos.telPersonneUrgence;
  }

  // ✅ Supprimer la clé indicatifUrgence après usage
  delete data.infos.indicatifUrgence;
    if (id !== undefined) {
      this.dossierService.updateInfosUrgence(id, data.infos).subscribe(() => {
        console.log('✔ Dossier médical mis à jour' , data.infos);
      });
      console.log("Antécédents",data.antecedents);
      this.dossierService.updateAntecedents(id, data.antecedents).subscribe(() => {
        console.log('✔ Dossier médical mis à jour' , data.antecedents);
      });
      this.dossierService.updateExamenClinique(id, data.examenClinique).subscribe(() => {
        console.log('✔ Dossier médical mis à jour' , data.examenClinique);
      });
      console.log("Examens complémentaires",data.examensComplementaires);
      this.dossierService.updateExamensComplementaires(21, data.examensComplementaires).subscribe(() => {
        console.log('✔ Dossier médical mis à jour' , data.examensComplementaires);
      });
      this.dossierService.updateTraitements(id, data.traitements).subscribe(() => {
        console.log('✔ Dossier médical mis à jour' , data.traitements);
      });
      this.dossierService.updateDiagnosticMedical(id, data.diagnosticMedical).subscribe(() => {
        console.log('✔ Dossier médical mis à jour' , data.diagnosticMedical);
      });
       console.log("Evolution Suivi",data.evolutionSuivi);
      this.dossierService.updateEvolutionSuivi(id, data.evolutionSuivi).subscribe(() => {
        console.log('✔ Dossier médical mis à jour' , data.evolutionSuivi);
      });
      console.log("Correspondances",data.correspondances);
      this.dossierService.updateCorrespondances(id, data.correspondances).subscribe(() => {
        console.log('✔ Correspondances mises à jour' , data.correspondances);
      });
    }
  }

  finalize() {
    console.log('✔ Sauvegarde complète terminée: ', this.dossierForm.value);

    // 🔹 Après la sauvegarde, redirection vers la tournée optimisée
    this.router.navigate(['/tournee-optimisee']);
  }

  /** Helpers */
  get infosForm(): FormGroup {
    return this.dossierForm.get('infos') as FormGroup;
  }

  get diagnosticMedicalForm(): FormGroup {
    return this.dossierForm.get('diagnosticMedical') as FormGroup;
  }

  

  get diagnosticMedical() {
        const diagGroup = this.dossierForm.get('diagnosticMedical') as FormGroup;
        console.log(diagGroup);
        return {
          diagnosticPrincipal: diagGroup.get('diagnosticPrincipal')?.value,
          diagnosticsSecondaires: diagGroup.get('diagnosticsSecondaires')?.value,
          codePrincipal: diagGroup.get('codePrincipal')?.value,
          systemeCodification: diagGroup.get('systemeCodification')?.value
        };
}

  get antecedentsForm(): FormGroup {
    console.log((this.dossierForm.get('antecedents') as FormGroup).value);
    return this.dossierForm.get('antecedents') as FormGroup;
  }

  get examenCliniqueForm(): FormGroup {
    return this.dossierForm.get('examenClinique') as FormGroup;
  }

  get examensComplementairesForm(): FormGroup {
    return this.dossierForm.get('examensComplementaires') as FormGroup;
  }

  get traitementsForm(): FormGroup {
    return this.dossierForm.get('traitements') as FormGroup;
  }

  get evolutionSuiviForm(): FormGroup {
    return this.dossierForm.get('evolutionSuivi') as FormGroup;
  }

  get correspondancesForm(): FormGroup {
    return this.dossierForm.get('correspondances') as FormGroup;
  }

  /** Validation téléphone */
  setupPhoneValidation() {
    const indicatif = this.infosForm.get('indicatifUrgence')?.value;
    const telControl = this.infosForm.get('telPersonneUrgence') as FormControl;
    const selected = this.countryCallingCodes.find(c => c.code === indicatif);
    const countryCodeISO = selected?.countryCode;

    telControl.setValidators([
      Validators.required,
      (control) => {
        const fullNumber = indicatif + control.value;
        if (!fullNumber) return null;
        const valid = this.phoneRegexService.isValidPhoneNumber(fullNumber, countryCodeISO);
        return valid ? null : { invalidPhone: true };
      },
    ]);
    telControl.updateValueAndValidity();
  }

  getIndicatifFromNumber(phone: string): string {
    const code = this.countryCallingCodes.find(c => phone.startsWith(c.code));
    return code ? code.code : '';
  }

  getStepUnicode(key: string): string {
  switch (key) {
    case 'infos': return "\F4E1"; // bi-person-circle
    case 'antecedents': return "\F5D2"; // bi-journal-medical
    case 'examenClinique': return "\F4DE"; // bi-clipboard-heart
    case 'examensComplementaires': return "\F4C7"; // bi-file-medical
    case 'traitements': return "\F62B"; // bi-capsule
    default: return "\F28A"; // bi-circle
  }
}


  stripIndicatifFromNumber(phone: string): string {
    const code = this.countryCallingCodes.find(c => phone.startsWith(c.code));
    return code ? phone.slice(code.code.length) : phone;
  }

  /** Conditions UI */
  get isFirstStep(): boolean {
    return this.activeStepIndex === 0;
  }

  get isLastStep(): boolean {
    return this.activeStepIndex === this.steps.length - 1;
  }

  get visibleActiveIndex(): number {
    return this.activeStepIndex - this.currentIndex;
  }

}
