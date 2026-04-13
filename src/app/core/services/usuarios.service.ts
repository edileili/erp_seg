import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private API = 'http://localhost:3000/api/usuarios';
  private APIADMIN = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) {}

  perfil(): Observable<any> {
    return this.http.get(`${this.API}/perfil`);
  }

  actualizar(perfil: any): Observable<any> {
    return this.http.put(`${this.API}/perfil`, perfil)
  }

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.APIADMIN}/`);
  }

  getUsuario(usuario_id: any): Observable<any> {
    return this.http.get(`${this.APIADMIN}/${usuario_id}`);
  }

  editarUsuario(usuario: any, usuario_id: any): Observable<any> {
    return this.http.put(`${this.APIADMIN}/${usuario_id}`, usuario)
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.APIADMIN}/`, usuario)
  }

  eliminar(usuario_id: any): Observable<any> {
    return this.http.delete(`${this.APIADMIN}/${usuario_id}`);
  }

  getPermisos(): Observable<any> {
    return this.http.get(`${this.APIADMIN}/permisos`);
  }

  getPermisosUsuario(usuario_id: any): Observable<any> {
    return this.http.get(`${this.APIADMIN}/${usuario_id}/permisos`)
  }

  getPermisosUsuarioEnGrupo(usuario_id: any, grupo_id: any): Observable<any> {
    return this.http.get(`${this.APIADMIN}/${usuario_id}/permisos/${grupo_id}`)
  }

  actualizarPermisos(usuario_id: any, permisos: any): Observable<any> {
    return this.http.put(`${this.APIADMIN}/${usuario_id}/permisos`, permisos);
  }

}
