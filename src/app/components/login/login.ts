import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (users) => {
        if (users.length > 0) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Identifiants invalides';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Erreur de connexion au serveur';
      }
    });
  }
}
