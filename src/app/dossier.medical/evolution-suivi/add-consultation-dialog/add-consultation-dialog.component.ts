import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatDialogContent, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { ProSante } from '../../../interfaces/pro-sante';
import { ProSanteService } from '../../../services/pro-sante.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-consultation-dialog',
  imports: [MatDialogContent,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule, MatDialogActions, MatDialogModule],
  templateUrl: './add-consultation-dialog.component.html',
  styleUrl: './add-consultation-dialog.component.css'
})
export class AddConsultationDialogComponent implements OnInit{
  form!: FormGroup;
  medecinControl = new FormControl('');
  medecins$: Observable<ProSante[]> | undefined; // Remplacez any par le type approprié pour vos médecins

  constructor(private fb: FormBuilder,
    private proSanteService: ProSanteService,
    private dialogRef: MatDialogRef<AddConsultationDialogComponent>) {
      this.form = this.fb.group({
        date: [new Date().toISOString().split('T')[0], Validators.required],
        medecin: this.medecinControl,
        resume: ['', Validators.required],
      })
  }

  ngOnInit(): void {
this.medecins$ = this.medecinControl.valueChanges.pipe(
  startWith(''),
  switchMap(value => {
    console.log('Recherche médecin pour:', value);
    console.log(this.medecins$);
    return this.proSanteService.getPros(value ?? '').pipe(
      map(response => {
        console.log('Résultats reçus:', response);
        return response;
      })
    );
  })
 
);
 

  }

  displayMedecin(medecin: ProSante): string {
    return medecin ? `${medecin.nom}  (${medecin.specialite})` : '';
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched(); // Marque tous les champs comme touchés pour afficher les erreurs
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
