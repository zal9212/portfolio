import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competence } from '../models/competence';

@Injectable({
  providedIn: 'root',
})
export class CompetenceService {
  private apiUrl = 'http://localhost:3000/competences';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Competence[]> {
    return this.http.get<Competence[]>(this.apiUrl);
  }

  getById(id: number | string): Observable<Competence> {
    return this.http.get<Competence>(`${this.apiUrl}/${id}`);
  }

  create(competence: Competence): Observable<Competence> {
    return this.http.post<Competence>(this.apiUrl, competence);
  }

  update(id: number | string, competence: Competence): Observable<Competence> {
    return this.http.put<Competence>(`${this.apiUrl}/${id}`, competence);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
