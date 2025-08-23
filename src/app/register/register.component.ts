import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerForm;
    error : string | null = null;

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
      this.registerForm = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        motDePasse: ['', [Validators.required, Validators.minLength(6)]],
        role: ['PATIENT'],
        terms: [false, Validators.requiredTrue]
      });
    }

    onSubmit() {
       if (this.registerForm.valid) {
        this.auth.register({ 
          email: this.registerForm.value.email!, 
          motDePasse: this.registerForm.value.motDePasse!, 
          role: (this.registerForm.value.role ?? "PATIENT") as 'PATIENT' | 'PROFESSIONNEL_SANTE', 
        }).subscribe({
          next: res => {
            this.auth.saveToken(res.token, res.role);
            this.router.navigate([res.role === 'PATIENT' ? '/' : 'tournee-optimisee']);
          },
          error: (err) => {
            this.error = 'Erreur lors de l\'inscription. Veuillez réessayer.';
            console.error(err);
          }
        });
        
       }
    }

}
