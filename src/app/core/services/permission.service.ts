import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UsersPermisos {
  id: number;
  nombre: string;
  contrasenia: string;
  permisos: Permission[];
}

export type Permission = 
  //grupos
  | 'group_view' | 'group_edit' | 'group_add' | 'group_remove' | 'group_add_member' | 'group_remove_member' | 'group_manage'
  //ticket
  | 'ticket_view' | 'ticket_edit' | 'ticket_edit_state' | 'ticket_edit_comment' | 'ticket_add' | 'ticket_delete' |  'tickets_view' | 'ticket_manage' | 'ticket_comment' | 'ticket_assign' | 'ticket_view_created' | 'ticket_view_owner'
  //user
  | 'user_view' | 'users_view' | 'user_edit' | 'user_edit_profile' | 'user_edit_permissions' | 'user_add' | 'user_remove' | 'user_manage' |  'user_desactivated' | 'user_activated';

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
