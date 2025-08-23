import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { CourbeClinique } from '../../../interfaces/courbe.clinique';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-courbe-dialog',
  imports: [
    CommonModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    MatDialogActions
  ],
  templateUrl: './add-courbe-dialog.component.html',
  styleUrl: './add-courbe-dialog.component.css'
})
export class AddCourbeDialogComponent {
    form!: FormGroup;

    constructor(private fb: FormBuilder,
      private dialogRef: MatDialogRef<AddCourbeDialogComponent>) {
      this.form = this.fb.group({
        type: ['', Validators.required],
        mesures: this.fb.array([
          this.createMesureGroup()
        ])
      })
}
    get mesures(): FormArray {
      return this.form.get('mesures') as FormArray;
    }

    createMesureGroup(): FormGroup {
      return this.fb.group({
        date: [new Date().toISOString().split('T')[0], Validators.required],
        valeur: [null, Validators.required]
      })
    }

    addMesure() {
      this.mesures.push(this.createMesureGroup());
    }

    removeMesure(index: number) {
      this.mesures.removeAt(index);
    }

    save() {
      if (this.form.valid) {
        const courbe: CourbeClinique = this.form.value;
        this.dialogRef.close(courbe);
      }
    }

    cancel() {
      this.dialogRef.close(null);
    }
}

