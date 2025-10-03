import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface AntecedentField {
  label: string;
  name: string;
  placeholder: string;
  icon: string;
  iconBg: string;
}

@Component({
  selector: 'app-antecedents-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './antecedents-form.component.html',
  styleUrl: './antecedents-form.component.css'
})
export class AntecedentsFormComponent implements OnInit {
  @Input() form!: FormGroup;

  // Map des champs -> input controls (indépendants)
  inputControls: { [key: string]: FormControl } = {};

  antecedentsFields: AntecedentField[] = [
    { label: 'Antécédents médicaux', name: 'antecedentsMedicaux', placeholder: 'Ex: Diabète, Hypertension', icon: 'favorite', iconBg: 'bg-rose-100 text-rose-600' },
    { label: 'Chirurgicaux', name: 'antecedentsChirurgicaux', placeholder: 'Ex: Appendicectomie...', icon: 'content_cut', iconBg: 'bg-blue-100 text-blue-600' },
    { label: 'Obstétricaux', name: 'antecedentsObstetricaux', placeholder: 'Ex: Accouchements...', icon: 'child_care', iconBg: 'bg-pink-100 text-pink-600' },
    { label: 'Psychologiques', name: 'antecedentsPsychologiques', placeholder: 'Ex: Anxiété, Autisme...', icon: 'psychology', iconBg: 'bg-indigo-100 text-indigo-600' },
    { label: 'Maladies familiales', name: 'maladiesFamiliales', placeholder: 'Ex: Diabète héréditaire...', icon: 'groups', iconBg: 'bg-yellow-100 text-yellow-600' },
    { label: 'Allergies', name: 'allergies', placeholder: 'Ex: Pollen, pénicilline...', icon: 'warning', iconBg: 'bg-red-100 text-red-600' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.form) {
      this.antecedentsFields.forEach(field => {
        if (!this.form.get(field.name)) {
          this.form.addControl(field.name, this.fb.array([]));
        }
        this.inputControls[field.name] = new FormControl('');
      });
    }
  }

  getChips(fieldName: string): FormArray {
    return this.form.get(fieldName) as FormArray;
  }

  addChip(fieldName: string): void {
    const value = this.inputControls[fieldName].value?.trim();
    if (value && this.getChips(fieldName).controls.every(c => c.value !== value)) {
      this.getChips(fieldName).push(this.fb.control(value));
    }
    this.inputControls[fieldName].reset();
  }

  handleChipInput(event: KeyboardEvent, fieldName: string): void {
    const value = this.inputControls[fieldName].value?.trim();
    if ((event.key === 'Enter' || event.key === 'Tab') && value) {
      this.addChip(fieldName);
      event.preventDefault();
    }
  }

  removeChip(fieldName: string, index: number): void {
    this.getChips(fieldName).removeAt(index);
  }
}
