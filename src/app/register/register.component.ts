import { Component, OnInit } from '@angular/core';
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
export class RegisterComponent implements OnInit {
  registerForm;
  error: string | null = null;

  // 🔹 Liste des spécialités dispo (fixtures)
  specialites: string[] = [
    "Généraliste", "Pédiatre", "Cardiologue", "Gynécologue", "Dentiste",
    "Dermatologue", "Ophtalmologue", "Orthopédiste", "ORL", "Neurologue"
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      adresse: [''],
      telephone: [''],
      role: ['PATIENT', Validators.required],

      // Patient
      matricule: [''],
      lieuNaissance: [''],
      dateNaissance: [''],
      situationFamiliale: [''],
      latitude: [''],
      longitude: [''],

      // Pro
      specialite: [''],  
      description: [''],
      tarif: ['']
    });
  }

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  // 🔹 Récupération en temps réel de la position GPS
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.registerForm.patchValue({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          console.log("📍 Position détectée :", position.coords);
        },
        error => {
          console.error("⚠️ Erreur géolocalisation :", error);
        }
      );
    } else {
      console.error("❌ La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const role: 'PATIENT' | 'PRO_SANTE' = 
        formValue.role === 'PRO_SANTE' ? 'PRO_SANTE' : 'PATIENT';

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
        tarif: formValue.tarif ? Number(formValue.tarif) : 0,
        latitude: formValue.latitude !== '' && formValue.latitude != null ? Number(formValue.latitude) : undefined,
        longitude: formValue.longitude !== '' && formValue.longitude != null ? Number(formValue.longitude) : undefined
      };

      this.auth.register(registerRequest).subscribe({
        next: res => {
          this.auth.saveToken(res.token, res.user.role, false);
          this.auth.saveUser(res.user);
          this.router.navigate(['/login']);
        },
        error: () => {
          this.error = "Erreur lors de l'inscription. Veuillez réessayer.";
        }
      });
    }
  }
}
