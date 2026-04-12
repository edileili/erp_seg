import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private API = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  perfil(): Observable<any> {
    return this.http.get(`${this.API}/perfil`);
  }

  actualizar(perfil: any): Observable<any> {
    return this.http.put(`${this.API}/perfil`, perfil)
  }
}
