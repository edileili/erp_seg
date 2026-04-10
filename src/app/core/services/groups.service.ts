import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private API = 'http://localhost:3000/api/grupos';

  constructor(private http: HttpClient) {}

  findAll(): Observable<any> {
    return this.http.get(`${this.API}/`)
  }

  findById(grupoId: number): Observable<any> {
    return this.http.get(`${this.API}/${grupoId}`);
  }

  getMiembros(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/${grupoId}/miembros`);
  }

  addMiembro(grupoId:number, email: string): Observable<any> {
    return this.http.post(`${this.API}/${grupoId}/miembro`, {email});
  }

  create(grupo: any): Observable<any> {
    return this.http.post(`${this.API}/`, grupo);
  }

  update(grupoId: number, grupo: any): Observable<any> {
    return this.http.put(`${this.API}/${grupoId}`, grupo);
  }
}
