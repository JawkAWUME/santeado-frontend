import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ExamensComplementaires {
  analysesSanguines?: { nom: string; valeur: string }[];
  analysesUrines?: { nom: string; valeur: string }[];
  testsSpeciaux?: { nom: string; valeur: string }[];
  radiographies?: string[];
  echographies?: string[];
  irm?: string[];
  scanners?: string[];
}

@Component({
  selector: 'app-examens-complementaires',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './examens.complementaires.component.html',
  styleUrl: './examens.complementaires.component.css'
})
export class ExamensComplementairesComponent implements OnInit {
  @Input() form!: FormGroup;

  // Inputs indépendants pour les simples entrées (texte)
  radioInputControl = new FormControl('');
  echoInputControl = new FormControl('');
  irmInputControl = new FormControl('');
  scannerInputControl = new FormControl('');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.form) {
      // Champs avec clé/valeur
      ['analysesSanguines', 'analysesUrines', 'testsSpeciaux'].forEach(field => {
        if (!this.form.get(field)) {
          this.form.addControl(field, this.fb.array([]));
        }
      });

      // Champs simples (liste de chaînes)
      ['radiographies', 'echographies', 'irm', 'scanners'].forEach(field => {
        if (!this.form.get(field)) {
          this.form.addControl(field, this.fb.array([]));
        }
      });
    }
  }

  // Helpers
  getArray(fieldName: string): FormArray {
    return this.form.get(fieldName) as FormArray;
  }

  // 🔹 Ajout pour paires clé/valeur
  addPair(fieldName: string): void {
    this.getArray(fieldName).push(
      this.fb.group({
        nom: ['', Validators.required],
        valeur: ['', Validators.required]
      })
    );
  }

  removePair(fieldName: string, index: number): void {
    this.getArray(fieldName).removeAt(index);
  }

  // 🔹 Ajout pour simples entrées
  addSimpleEntry(event: KeyboardEvent, control: FormControl, array: FormArray): void {
    const value = control.value?.trim();
    if ((event.key === 'Enter' || event.key === 'Tab') && value) {
      if (array.controls.every(c => c.value !== value)) {
        array.push(this.fb.control(value));
      }
      control.reset();
      event.preventDefault();
    }
  }

  addEntryFromClick(control: FormControl, array: FormArray): void {
    const value = control.value?.trim();
    if (value && array.controls.every(c => c.value !== value)) {
      array.push(this.fb.control(value));
    }
    control.reset();
  }

  removeSimpleEntry(array: FormArray, index: number): void {
    array.removeAt(index);
  }
}
