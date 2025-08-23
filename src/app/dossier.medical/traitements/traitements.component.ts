import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-traitements',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './traitements.component.html',
  styleUrl: './traitements.component.css'
})
export class TraitementsComponent implements OnInit {
    @Input() form!: FormGroup;

    constructor(private fb: FormBuilder) {}
    ngOnInit(): void {
        // Initialize component
    }

    get medicaments() {
        return this.form.get('medicaments') as FormArray;
    }

    get soinsParamedicaux() {
        return this.form.get('soinsParamedicaux') as FormArray;
    }

    get interventions() {
        return this.form.get('interventions') as FormArray;
    }

    addMedicament() {
        const medicamentForm = this.fb.group({
            nom: [''],
            posologie: [''],
            voie: [''],
            duree: [0],
            commentaire: ['']
        });
        this.medicaments.push(medicamentForm);
    }

    addSoin() {
        const soinForm = this.fb.group({
            typeSoin: [''],
            frequence: [''],  
            commentaire: ['']
        });
        this.soinsParamedicaux.push(soinForm);
    }

    addIntervention() {
        const interventionForm = this.fb.group({
            nom: [''],
            datePrevue: [''],
            objectif: [''],
            commentaire: ['']
        });
        this.interventions.push(interventionForm);
    }

    removeEntry(array: FormArray, index: number) {
        if (index >= 0 && index < array.length) {
            array.removeAt(index);
        }
    }

}
