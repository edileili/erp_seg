import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission, PermissionService } from './permission.service';
import usersConPermisos from './../assets/users.json';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface PermisosResponse {
  statusCode: number;
  data: {
    id: string;
    nombre: Permission;
    descripcion: string;
  }[];
}

interface LoginResponse {
  statusCode: number;
  data: [{
    accessToken: string;
    usuario: {
      id: string;
      usuario: string;
      email: string;
      nombre_com: string;
      permisos: Permission[];
    };
  }];
}
interface TokenPayload {
  id: number;
  email: string;
  nombre: string;
  permisos: Permission[];
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'erp_token';
  private readonly PERMISOS_KEY = 'erp_permisos';
  private readonly API = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private permissionService: PermissionService
  ) {
    this.restoreSession();
  }
  
  private isTokenValid(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private async restoreSession(): Promise<void> {
    if (!this.isTokenValid()) {
      this.logout();
      return;
    }

    const userId = this.getTokenPayload()?.id;
    if (!userId) return;

    try {
      const res = await firstValueFrom(
        this.http.get<PermisosResponse>(`${this.API}/admin/${userId}/permisos`)
      );

      // ✅ Extrae solo el string "nombre" de cada permiso
      const permisos: Permission[] = res.data.map(p => p.nombre);

      localStorage.setItem(this.PERMISOS_KEY, JSON.stringify(permisos));
      this.permissionService.setPermissions(permisos);
    } catch (error) {
      console.warn('No se pudieron actualizar los permisos, usando caché:', error);
      const raw = localStorage.getItem(this.PERMISOS_KEY);
      if (raw) {
        this.permissionService.setPermissions(JSON.parse(raw) as Permission[]);
      }
    }
  }

  async login(email: string, contrasenia: string): Promise<TokenPayload | null> {
    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.API}/auth/login`, { email, contrasenia })
      );

      const { accessToken, usuario } = res.data[0];

      localStorage.setItem(this.TOKEN_KEY, accessToken);
      localStorage.setItem(this.PERMISOS_KEY, JSON.stringify(usuario.permisos));
      this.permissionService.setPermissions(usuario.permisos as Permission[]);

      return this.getTokenPayload();
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }

  async register(userData: any) {
    return firstValueFrom(
      this.http.post(`${this.API}/auth/registro`, userData)
    );
  }

  getTokenPayload(): TokenPayload | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    try {
      const body = token.split('.')[1];
      const payload = JSON.parse(atob(body));

      if (payload.exp * 1000 < Date.now()) {
        this.logout();
        return null;
      }

      const permisos = this.getPermisos();
      return { ...payload, permisos };
    } catch {
      return null;
    }
  }

  getPermisos(): Permission[] {
    const raw = localStorage.getItem(this.PERMISOS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.PERMISOS_KEY);
    localStorage.removeItem('erp_permisos_grupo');
    this.permissionService.clearPermissions();
  }
}