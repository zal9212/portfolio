// import { TestBed } from '@angular/core/testing';

// import { Projet } from './projet';

// describe('Projet', () => {
//   let service: Projet;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(Projet);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet } from '../models/projet';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private apiUrl = 'http://localhost:3000/projets';

  constructor(private http: HttpClient) { }

  getAll(): Observable {
    return this.http.get(this.apiUrl);
  }

  getById(id: number): Observable {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(projet: Projet): Observable {
    return this.http.post(this.apiUrl, projet);
  }

  update(id: number, projet: Projet): Observable {
    return this.http.put(`${this.apiUrl}/${id}`, projet);
  }

  delete(id: number): Observable {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}