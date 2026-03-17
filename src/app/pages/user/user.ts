import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Password } from 'primeng/password';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-user',
  imports: [CardModule, ButtonModule, DialogModule, InputGroupModule, InputGroupAddonModule, Password, DatePicker, InputNumber, HasPermissionDirective, TagModule, TableModule, MultiSelectModule],
  standalone: true,
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  users = [
    {id: 201, nombre: 'Eden', apellido: 'Romero', permisos: 'ticket_view'},
    {id: 202, nombre: 'Admin', apellido: 'Admin', permisos: 'admin'}
  ];

  tickets = [
    { id: 101, estado: 'Pendiente', prioridad: 'Alta', fecha: new Date() },
    { id: 103, estado: 'En Progreso', prioridad: 'Media', fecha: new Date() },
  ];

  listaPermisosDisponibles = [
    { label: 'Admin', value: 'admin' }, { label: 'Ver Grupo', value: 'group_view' }, { label: 'Editar Grupo', value: 'group_edit' }, { label: 'Agregar Grupo', value: 'group_add' }, { label: 'Borrar Grupo', value: 'group_delete' },
    { label: 'Ver Ticket', value: 'ticket_view' }, { label: 'Editar Ticket', value: 'ticket_edit' }, { label: 'Agregar Ticket', value: 'ticket_add' }, { label: 'Borrar Ticket', value: 'ticket_delete' }, { label: 'Editar Estado Ticket', value: 'ticket_edit_state' },
    { label: 'Ver Usuario', value: 'user_view' }, { label: 'Ver Usuarios', value: 'users_view' }, { label: 'Editar Usuario', value: 'user_edit' }, { label: 'Agregar Usuario', value: 'user_add' }, { label: 'Borrar Usuario', value: 'user_delete' }
  ];

  permisosSeleccionados: string[] = [];
  usuarioSeleccionado: any;

  agregarPermisos() {
    if (!this.usuarioSeleccionado.permisos) {
      this.usuarioSeleccionado.permisos = [];
    }

    const nuevos = this.permisosSeleccionados.filter(p => !this.usuarioSeleccionado.permisos.includes(p));
    this.usuarioSeleccionado.permisos.push(...nuevos);

    this.permisosSeleccionados = [];
  }

  removerPermiso(permiso: string) {
    this.usuarioSeleccionado.permisos = this.usuarioSeleccionado.permisos.filter((p: string) => p !== permiso);
  }

  getSeverity(permiso: string) {
    if (permiso === 'admin') return 'danger';
    if (permiso.startsWith('ticket')) return 'info';
    if (permiso.startsWith('user')) return 'success';
    return 'secondary';
  }
  displayEditState: boolean = false;
  openEditState() {
    this.displayEditState = true;
  }
}
