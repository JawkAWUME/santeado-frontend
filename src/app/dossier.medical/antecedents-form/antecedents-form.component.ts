import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

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
    MatInputModule
  ],
  templateUrl: './antecedents-form.component.html',
  styleUrl: './antecedents-form.component.css',
  animations: [
    trigger('chipAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'scale(0.95)' }),
          stagger('50ms', animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })))
        ], { optional: true }),
        query(':leave', [
          stagger('50ms', animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class AntecedentsFormComponent implements OnInit {
  @Input() form!: FormGroup;
  chipInputControl = new FormControl();
  readonly separatorKeysCodes: number[] = [13, 188]; // Enter, comma

  antecedentsFields: AntecedentField[] = [
    { label: 'Antécédents médicaux', name: 'antecedentsMedicaux', placeholder: 'Ex: Diabète, Hypertension', icon: 'heart-pulse', iconBg: 'bg-rose-100 text-rose-600' },
    { label: 'Chirurgicaux', name: 'antecedentsChirurgicaux', placeholder: 'Ex: Appendicectomie...', icon: 'scissors-line-dashed', iconBg: 'bg-blue-100 text-blue-600' },
    { label: 'Obstétricaux', name: 'antecedentsObstetricaux', placeholder: 'Ex: Accouchements...', icon: 'baby', iconBg: 'bg-pink-100 text-pink-600' },
    { label: 'Maladies familiales', name: 'maladiesFamiliales', placeholder: 'Ex: Diabète héréditaire...', icon: 'users', iconBg: 'bg-yellow-100 text-yellow-600' },
    { label: 'Allergies', name: 'allergies', placeholder: 'Ex: Pollen, pénicilline...', icon: 'alert-triangle', iconBg: 'bg-red-100 text-red-600' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const group: Record<string, FormArray> = {};
    this.antecedentsFields.forEach(field => {
      group[field.name] = this.fb.array([]);
    });
    this.form = this.fb.group(group);
  }

  getChips(fieldName: string): FormArray {
    return this.form.get(fieldName) as FormArray;
  }

  addChip(event: MatChipInputEvent, fieldName: string): void {
    const input = event.input;
    const value = event.value?.trim();
    if (value && this.getChips(fieldName).controls.every(c => c.value !== value)) {
      this.getChips(fieldName).push(this.fb.control(value));
    }
    if (input) input.value = '';
    this.chipInputControl.setValue(null);
  }

  removeChip(fieldName: string, index: number): void {
    this.getChips(fieldName).removeAt(index);
  }

  handleAutocompleteSelection(event: KeyboardEvent, fieldName: string) {
    const value = this.chipInputControl.value?.trim();
    if ((event.key === 'Enter' || event.key === 'Tab') && value) {
      if (this.getChips(fieldName).controls.every(c => c.value !== value)) {
        this.getChips(fieldName).push(this.fb.control(value));
      }
      this.chipInputControl.reset();
      event.preventDefault();
    }
  }
}
