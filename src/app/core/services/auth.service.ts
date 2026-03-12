import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission } from './permission.service';
import usersConPermisos from './../assets/users.json';

interface UserPermisos {
  id: number;
  email: string;
  nombre: string;
  contrasenia: string;
  permisos: Permission[];
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

  constructor(private http: HttpClient) {}

  async login(email: string, contrasenia: string): Promise<TokenPayload | null> {
    const users = usersConPermisos as UserPermisos[];
    const user = users.find(u => u.email === email && u.contrasenia === contrasenia);

    if (!user) return null;

    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      permisos: user.permisos,
      exp: Date.now() + 1000 * 60 * 60
    };

    const token = this.generateMockToken(payload);
    localStorage.setItem(this.TOKEN_KEY, token);
    return payload;
  }

  private generateMockToken(payload: TokenPayload): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body   = btoa(JSON.stringify(payload));
    const signature = btoa('mock-signature');
    return `${header}.${body}.${signature}`;
  }

  getTokenPayload(): TokenPayload | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    try {
      const body = token.split('.')[1];
      const payload: TokenPayload = JSON.parse(atob(body));

      if (payload.exp < Date.now()) {
        this.logout();
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getTokenPayload() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}