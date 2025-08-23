import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-examen-clinique-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './examen-clinique-form.component.html',
  styleUrl: './examen-clinique-form.component.css'
})
export class ExamenCliniqueFormComponent implements OnInit {
  @Input() form!: FormGroup;

  chipInputControl = new FormControl('');
  readonly separatorKeysCodes: number[] = [13, 188];

  constructor(private fb: FormBuilder) {}

  signesVitaux = [
    { label: 'Poids (kg)', control: 'poids', type: 'number' },
    { label: 'Taille (cm)', control: 'taille', type: 'number' },
    { label: 'Tension artérielle', control: 'tensionArterielle', type: 'text' },
    { label: 'Température (°C)', control: 'temperature', type: 'number' },
    { label: 'Fréquence cardiaque', control: 'frequenceCardiaque', type: 'number' },
    { label: 'Saturation O₂ (%)', control: 'saturationOxygene', type: 'number' },
  ];

  ngOnInit(): void {
    if (!this.form.get('bilanPhysique')) {
      this.form.addControl('bilanPhysique', this.fb.array([]));
    }

    if (!this.form.get('observations')) {
      this.form.addControl('observations', this.fb.array([]));
    }
  }

  get bilanPhysique(): FormArray {
    return this.form.get('bilanPhysique') as FormArray;
  }

 addBilanPhysique(): void {
  const last = this.bilanPhysique.at(this.bilanPhysique.length - 1);

  // Si le dernier champ est vide, ne rien faire
  if (last && (!last.value.partie.trim() || !last.value.observation.trim())) {
    return;
  }

  const bilanGroup = this.fb.group({
    partie: [''],
    observation: ['']
  });
  this.bilanPhysique.push(bilanGroup);
}

  removeBilanPhysique(index: number): void {
    this.bilanPhysique.removeAt(index);
  }

  get observations(): FormArray {
    return this.form.get('observations') as FormArray;
  }

  removeObservation(index: number): void {
    this.observations.removeAt(index);
  }

  handleObservationInput(event: KeyboardEvent) {
    const value = this.chipInputControl.value?.trim();

    if ((event.key === 'Enter' || event.key === 'Tab') && value) {
      const exists = this.observations.controls.some(c => c.value === value);
      if (!exists) {
        this.observations.push(this.fb.control(value));
      }
      this.chipInputControl.reset();
      event.preventDefault();
    }
  }

  addObservationFromClick(): void {
    const value = this.chipInputControl.value?.trim();
    if (value && this.observations.controls.every(c => c.value !== value)) {
      this.observations.push(new FormControl(value));
      this.chipInputControl.reset();
    }
  }
}
