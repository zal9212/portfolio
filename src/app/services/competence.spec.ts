// import { TestBed } from '@angular/core/testing';

 //import { Competence } from './competence';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competence } from '../models/competence';

// describe('Competence', () => {
//   let service: Competence;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(Competence);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  private apiUrl = 'http://localhost:3000/competences';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Competence[]> {
    return this.http.get<Competence[]>(this.apiUrl);
  }

  getById(id: number): Observable<Competence> {
    return this.http.get<Competence>(`${this.apiUrl}/${id}`);
  }

  create(competence: Competence): Observable<Competence> {
    return this.http.post<Competence>(this.apiUrl, competence);
  }

  update(id: number, competence: Competence): Observable<Competence> {
    return this.http.put<Competence>(`${this.apiUrl}/${id}`, competence);
  }

  delete(id: number, competence: Competence): Observable<Competence> {    
    return this.http.delete<Competence>(`${this.apiUrl}/${id}`);
  }
}