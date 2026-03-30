import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission, PermissionService } from './permission.service';
import usersConPermisos from './../assets/users.json';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    private permissionService: PermissionService  // ← inyecta aquí
  ) {
    // ⚠️ MUY IMPORTANTE: restaura los permisos al recargar la página
    this.restoreSession();
  }

  async login(email: string, contrasenia: string): Promise<TokenPayload | null> {
    try {
      const res = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.API}/usuarios/login`, { email, contrasenia })
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
      this.http.post(`${this.API}/usuarios/registro`, userData)
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

  private restoreSession(): void {
    const raw = localStorage.getItem(this.PERMISOS_KEY);
    if (raw && this.isAuthenticated()) {
      this.permissionService.setPermissions(JSON.parse(raw) as Permission[]);
    }
  }

  getPermisos(): Permission[] {
    const raw = localStorage.getItem(this.PERMISOS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  isAuthenticated(): boolean {
    return this.getTokenPayload() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.PERMISOS_KEY);
    this.permissionService.clearPermissions();
  }
}