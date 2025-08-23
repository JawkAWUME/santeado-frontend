import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-infos-urgence',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './infos.urgence.component.html',
  styleUrl: './infos.urgence.component.css'
})
export class InfosUrgenceComponent {
    @Input() form!: FormGroup; // Le FormGroup parent
  @Input() countryCallingCodes: { name: string; code: string }[] = [];

   constructor(private fb: FormBuilder) {}
}
