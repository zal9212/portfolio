// import { CanActivateFn } from '@angular/router';

// export const adminGuard: CanActivateFn = (route, state) => {
//   return true;
// };

import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();

    // If not logged in at all, redirect to login
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // If logged in but not admin, redirect to home
    if (user.role !== 'admin') {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}