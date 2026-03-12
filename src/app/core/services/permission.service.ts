import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UsersPermisos {
  id: number;
  nombre: string;
  contrasenia: string;
  permisos: Permission[];
}

export type Permission = 
  'admin'
  | 'group_view' | 'group_edit' | 'group_add' | 'group_delete' //grupos
  | 'ticket_view' | 'ticket_edit' | 'ticket_add' | 'ticket_delete' | 'ticket_edit_state' //ticket
  | 'user_view' | 'users_view' | 'user_edit' | 'user_add' | 'user_delete'; //user

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  
  private permissions$ = new BehaviorSubject<Permission[]>([]);

  setPermissions(permissions: Permission[]): void {
    this.permissions$.next(permissions);
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions$.value.includes(permission);
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(p => this.permissions$.value.includes(p));
  }

  hastAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(p => this.permissions$.value.includes(p));
  }

  clearPermissions(): void {
    this.permissions$.next([]);
  }
}
