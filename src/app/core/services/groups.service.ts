import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, tap } from 'rxjs';

export type PermisoGrupo = string;

export interface PermisosGrupo {
  grupo_id: number;
  permisos: PermisoGrupo[];
}
@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private API = 'http://localhost:3000/api/grupos';
  private readonly PERMISOS_GRUPO_KEY = 'erp_permisos_grupo';

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

  getMyGroups(): Observable<any> {
    return this.http.get(`${this.API}/mis-grupos`)
  }

  async cargarPermisosGrupo(grupoId: number, usuarioId: number): Promise<PermisoGrupo[]> {
    const res = await firstValueFrom(
      this.http.get<any>(`${this.API}/${grupoId}/permisos/${usuarioId}`)
    );
    const permisos: PermisoGrupo[] = res.data.map((p: any) => p.nombre);
    const payload: PermisosGrupo = { grupo_id: grupoId, permisos};
    localStorage.setItem(this.PERMISOS_GRUPO_KEY, JSON.stringify(payload));
    return permisos;
  }

  getPermisosGrupo(): PermisosGrupo | null {
    const raw = localStorage.getItem(this.PERMISOS_GRUPO_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  tienePermisoEnGrupo(nombre: PermisoGrupo, grupoId?: number): boolean {
    const payload = this.getPermisosGrupo();
    if(!payload) return false;

    if(grupoId !== undefined && payload.grupo_id !== grupoId) return false;

    return payload.permisos.includes(nombre);
  }

  limpiarPermisosGrupo(): void {
    localStorage.removeItem(this.PERMISOS_GRUPO_KEY);
  }

  getPermisosUsuarioEnGrupo(grupoId: number, usuarioId: number): Observable<any> {
    return this.http.get(`${this.API}/${grupoId}/permisos/${usuarioId}`);
  }

  actualizarPermisosUsuario(grupoId: number, usuarioId: number, permisos: number[]): Observable<any> {
    return this.http.post(`${this.API}/${grupoId}/permiso`, { usuario_id: usuarioId, permisos})
  }
}
