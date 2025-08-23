import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  error: string | null = null;
  loginForm: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private auth: AuthService,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
     // Par défaut, on considère que l'utilisateur est un patient
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: res => {
          res.role = 'PATIENT';
          this.auth.saveToken(res.token, res.role);
          this.router.navigate([res.role === 'PATIENT' ? '/' : '/tournee-optimisee']);
        },
        error: (err) => {
          this.error = 'Identifiants incorrects. Veuillez réessayer.';
          console.error(err);
        }
      });
      console.log(this.loginForm.value);
    } else {
      this.error = 'Veuillez remplir correctement le formulaire.';
    }
  }
}
