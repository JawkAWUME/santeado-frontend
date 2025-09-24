import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RegisterRequest } from '../interfaces/register.request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      // Champs communs
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      adresse: [''],
      telephone: [''],
      role: ['PATIENT', Validators.required],

      // Champs spécifiques Patient
      matricule: [''],
      lieuNaissance: [''],
      dateNaissance: [''],
      situationFamiliale: [''],
      latitude: [''],
      longitude: [''],

      // Champs spécifiques Pro
      specialite: [''],
      description: [''],
      tarif: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      // Harmonisation du rôle
      const role: 'PATIENT' | 'PRO_SANTE' = 
        formValue.role === 'PRO_SANTE' ? 'PRO_SANTE' : 'PATIENT';

      // Formatage de la date (yyyy-MM-dd)
      const dateNaissance = formValue.dateNaissance
        ? new Date(formValue.dateNaissance).toISOString().split('T')[0]
        : undefined;

      const registerRequest: RegisterRequest = {
        ...formValue,
        nom: formValue.nom ?? '',
        prenom: formValue.prenom ?? '',
        sexe: formValue.sexe ?? '',
        email: formValue.email ?? '',
        motDePasse: formValue.motDePasse ?? '',
        role,
        dateNaissance: dateNaissance ?? '',
        adresse: formValue.adresse ?? '',
        telephone: formValue.telephone ?? '',
        lieuNaissance: formValue.lieuNaissance ?? '',
        situationFamiliale: formValue.situationFamiliale ?? '',
        specialite: formValue.specialite ?? '',
        description: formValue.description ?? '',
        tarif: formValue.tarif ? Number(formValue.tarif) : 0
      };

      console.log('Register Request:', registerRequest);

      this.auth.register(registerRequest).subscribe({
        next: res => {
          console.log('Registration successful', res);
          // 🚫 pas de hasLoggedInOnce ici
          this.auth.saveToken(res.token, res.user.role, false);
          this.auth.saveUser(res.user);
          this.router.navigate(['/login']); // on force le passage par login
        },
        error: (err) => {
          this.error = 'Erreur lors de l\'inscription. Veuillez réessayer.';
          console.error(err);
        }
      });
    }
  }
}
