import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-examens-complementaires',
  templateUrl: './examens.complementaires.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class ExamensComplementairesComponent implements OnInit{
  @Input() form!: FormGroup;

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    if (!this.form.get('analysesSanguines')) {
      this.form.addControl('analysesSanguines', this.fb.array([]));
    }

    if (!this.form.get('analysesUrines')) {
      this.form.addControl('analysesUrines', this.fb.array([]));
    }

    if (!this.form.get('testsSpeciaux')) {
      this.form.addControl('testsSpeciaux', this.fb.array([]));
    }

    if (!this.form.get('radiographies')) {
      this.form.addControl('radiographies', this.fb.array([]));
    }

    if (!this.form.get('echographies')) {
      this.form.addControl('echographies', this.fb.array([]));
    }

    if (!this.form.get('irm')) {
      this.form.addControl('irm', this.fb.array([]));
    }

  }

  chipInputControl = new FormControl('');
  echoInputControl = new FormControl('');
  radioInputControl = new FormControl('');
  irmInputControl = new FormControl('');
  readonly separatorKeysCodes: number[] = [13, 188];

  get analysesSanguines(): FormArray {
    return this.form.get('analysesSanguines') as FormArray;
  }
  get analysesUrines(): FormArray {
    return this.form.get('analysesUrines') as FormArray;
  }
  get testsSpeciaux(): FormArray {
    return this.form.get('testsSpeciaux') as FormArray;
  }

  get radiographies(): FormArray {
    const array = this.form?.get('radiographies') as FormArray;
    return array;
  }


  get echographies(): FormArray {
   const array = this.form?.get('echographies') as FormArray;
    return array;
  }

  get irm(): FormArray {
    const array = this.form?.get('irm') as FormArray;
    return array;
  }


  addEntry(array: FormArray): void {
    array.push(this.fb.group({ nom: ['', Validators.required], valeur: ['', Validators.required] }));
  }

  addSimpleEntry(event: KeyboardEvent, inputControl: FormControl, array: FormArray): void {
  const value = inputControl.value?.trim();

  if ((event.key === 'Enter' || event.key === 'Tab') && value) {
    const exists = array.controls.some(c => c.value === value);
    if (!exists) {
      array.push(this.fb.control(value));
    }
    inputControl.reset();
    event.preventDefault();
  }
  console.log(array.controls);
}

addEntryFromClick(inputControl: FormControl, array: FormArray): void {
  const value = inputControl.value?.trim();
  if (value && array.controls.every(c => c.value !== value)) {
    array.push(this.fb.control(value));
    inputControl.reset();
  }
}


  removeEntry(array: FormArray, index: number): void {
    array.removeAt(index);
  }
}
