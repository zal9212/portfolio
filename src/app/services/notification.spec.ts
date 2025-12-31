// import { TestBed } from '@angular/core/testing';

// import { Notification } from './notification';

// describe('Notification', () => {
//   let service: Notification;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(Notification);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });



import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notification$ = this.notificationSubject.asObservable();

  showSuccess(message: string): void {
    this.show(message, 'success');
  }

  showError(message: string): void {
    this.show(message, 'error');
  }

  showInfo(message: string): void {
    this.show(message, 'info');
  }

  showWarning(message: string): void {
    this.show(message, 'warning');
  }

  private show(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.notificationSubject.next({ message, type });
    setTimeout(() => this.notificationSubject.next(null), 4000);
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}