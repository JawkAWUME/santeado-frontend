import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipListbox, MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CourbeClinique } from '../../interfaces/courbe.clinique';
import { AddConsultationDialogComponent } from './add-consultation-dialog/add-consultation-dialog.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { AddCourbeDialogComponent } from './add-courbe-dialog/add-courbe-dialog.component';

@Component({
  selector: 'app-evolution-suivi',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipListbox,
    MatChipsModule,
    MatInputModule,
    NgxEchartsModule,
  ],
  templateUrl: './evolution-suivi.component.html',
  styleUrl: './evolution-suivi.component.css'
})
export class EvolutionSuiviComponent implements OnInit {
  @Input() form!: FormGroup;
  notesControl = new FormControl('');

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialisation ou chargement des données si nécessaire
    if (!this.form.get('notesEvolution')) {
      this.form.addControl('notesEvolution', this.fb.array([]));
    }
    if (!this.form.get('consultations')) {
      this.form.addControl('consultations', this.fb.array([]));
    }
    if (!this.form.get('courbes')) {
      this.form.addControl('courbes', this.fb.array([]));
    }

  }

  get notesEvolution(): FormArray {
    return this.form.get('notesEvolution') as FormArray;
  }

  get consultations(): FormArray {
    return this.form.get('consultations') as FormArray;
  }

  get courbes(): FormArray {
    return this.form.get('courbes') as FormArray;
  }

  addNote() {
    const note = this.notesControl.value?.trim();
    if (note) {
      this.notesEvolution.push(this.fb.control(note, Validators.required));
      this.notesControl.reset();
    }
  }

  removeNote(index: number): void {
    this.notesEvolution.removeAt(index);
  }

  /** 
   * Génération des données pour ngx-echarts
   */
  getChartOptions(courbe: CourbeClinique) {
  const mesures = courbe.mesures;
  console.log('Mesures pour la courbe:', courbe);
  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: courbe.mesures.map(m => m.date)
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: courbe.type,
        data: mesures.map(m => m.valeur),
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: { color: '#4F46E5' },
        itemStyle: { color: '#4F46E5' }
      }
    ]
  };
}

  openAddConsultationDialog(): void {
    const dialogRef = this.dialog.open(AddConsultationDialogComponent, {
      width: '400px',
      data: { form: this.form }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consultations.push(this.fb.group(result));
        console.log('Consultation ajoutée:', result);
      }
    });
  }

  openAddCourbeDialog(): void {
    const dialogRef = this.dialog.open(AddCourbeDialogComponent, {
      width: '400px',
      data: { form: this.form }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courbes.push(this.fb.group({
          type: result.type,
          mesures: this.fb.array(result.mesures.map((m:any) => this.fb.group({
            date: m.date,
            valeur: m.valeur
          })))
        }));
        console.log('Courbe ajoutée:', result);
        console.log('Courbe ajoutée:', this.courbes.value);
      }
    });
  }
  
  removeConsultation(index: number): void {
    this.consultations.removeAt(index);
  }
}
