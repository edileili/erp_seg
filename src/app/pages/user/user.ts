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

  tickets = [
    { id: 101, estado: 'Abierto', prioridad: 'Alta', fecha: new Date() },
    { id: 103, estado: 'En Progreso', prioridad: 'Media', fecha: new Date() },
  ];

  // En tu .ts
listaPermisosDisponibles = [
    'admin', 'group_view', 'group_edit', 'group_add', 'group_delete',
    'ticket_view', 'ticket_edit', 'ticket_add', 'ticket_delete', 'ticket_edit_state',
    'user_view', 'users_view', 'user_edit', 'user_add', 'user_delete'
];

permisosSeleccionados: string[] = [];
usuarioSeleccionado: any; // El usuario que estás editando

agregarPermisos() {
    if (!this.usuarioSeleccionado.permisos) {
        this.usuarioSeleccionado.permisos = [];
    }
    
    // Evitar duplicados
    const nuevos = this.permisosSeleccionados.filter(p => !this.usuarioSeleccionado.permisos.includes(p));
    this.usuarioSeleccionado.permisos.push(...nuevos);
    
    this.permisosSeleccionados = []; // Limpiar selección
}

removerPermiso(permiso: string) {
    this.usuarioSeleccionado.permisos = this.usuarioSeleccionado.permisos.filter((p: string) => p !== permiso);
}

// Opcional: Colores por categoría
getSeverity(permiso: string) {
    if (permiso === 'admin') return 'danger';
    if (permiso.startsWith('ticket')) return 'info';
    if (permiso.startsWith('user')) return 'success';
    return 'secondary';
}
}
