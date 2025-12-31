import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/users';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            const user = localStorage.getItem('currentUser');
            if (user) {
                this.currentUserSubject.next(JSON.parse(user));
            }
        }
    }

    login(username: string, password: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}?username=${username}&password=${password}`)
            .pipe(
                tap(users => {
                    if (users.length > 0) {
                        const user = users[0];
                        if (isPlatformBrowser(this.platformId)) {
                            localStorage.setItem('currentUser', JSON.stringify(user));
                        }
                        this.currentUserSubject.next(user);
                    }
                })
            );
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    isAdmin(): boolean {
        return this.currentUserSubject.value?.role === 'admin';
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }
}
