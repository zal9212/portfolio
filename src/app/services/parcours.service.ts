import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcours } from '../models/parcours';

@Injectable({
  providedIn: 'root',
})
export class ParcoursService {
  private apiUrl = 'http://localhost:3000/parcours';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Parcours[]> {
    return this.http.get<Parcours[]>(this.apiUrl);
  }

  getById(id: number | string): Observable<Parcours> {
    return this.http.get<Parcours>(`${this.apiUrl}/${id}`);
  }

  create(parcours: Parcours): Observable<Parcours> {
    return this.http.post<Parcours>(this.apiUrl, parcours);
  }

  update(id: number | string, parcours: Parcours): Observable<Parcours> {
    return this.http.put<Parcours>(`${this.apiUrl}/${id}`, parcours);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
