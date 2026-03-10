import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

@Component({
  selector: 'app-groups',
  imports: [CardModule, BadgeModule, OverlayBadgeModule, DialogModule, ButtonModule, InputGroupAddonModule, InputGroupModule, HasPermissionDirective],
  providers: [MessageService],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  //public registroSeg: FormGroup;
  public formSubmitted = false;

  groups = [
    {
      id: 1,
      name: 'Equipo de Desarrollo Alfa',
      memberCount: 3,
      members: [
        { email: 'admin@empresa.com', role: 'admin' },
        { email: 'juan.perez@empresa.com', role: 'member' },
        { email: 'ana.garcia@empresa.com', role: 'member' }
      ],
      description: 'Espacio de trabajo para el frontend core.'
    },
    {
      id: 2,
      name: 'Marketing Digital',
      memberCount: 5,
      members: [
        { email: 'mkt.lead@empresa.com', role: 'admin' },
        { email: 'creative@empresa.com', role: 'member' },
        { email: 'social.media@empresa.com', role: 'member' },
        { email: 'seo.specialist@empresa.com', role: 'member' },
        { email: 'copywriter@empresa.com', role: 'member' }
      ],
      description: 'Gestión de campañas y redes sociales.'
    },
    {
      id: 3,
      name: 'Recursos Humanos',
      memberCount: 2,
      members: [
        { email: 'rrhh@empresa.com', role: 'admin' },
        { email: 'talent.scout@empresa.com', role: 'member' }
      ]
    }
  ];

  // Variables de estado
displayEditDialog: boolean = false;
displayDeleteDialog: boolean = false;
selectedGroup: any = { name: '', members: [] };
newUserEmail: string = '';

// Abrir diálogo de edición
editGroup(group: any) {
    this.selectedGroup = { ...group }; // Clonamos para no editar el original antes de guardar
    this.displayEditDialog = true;
}

// Abrir diálogo de borrado
deleteGroup(group: any) {
    this.selectedGroup = group;
    this.displayDeleteDialog = true;
}

// Lógica de usuarios dentro del diálogo
addUser() {
    if (this.newUserEmail) {
        this.selectedGroup.members.push({ email: this.newUserEmail, role: 'member' });
        this.newUserEmail = ''; // Limpiar input
    }
}

removeUser(email: string) {
    this.selectedGroup.members = this.selectedGroup.members.filter((u: any) => u.email !== email);
}

// Persistencia simple
saveGroup() {
    const index = this.groups.findIndex(g => g.id === this.selectedGroup.id);
    if (index !== -1) {
        this.groups[index] = { ...this.selectedGroup, memberCount: this.selectedGroup.members.length };
    }
    this.displayEditDialog = false;
}

confirmDelete() {
    this.groups = this.groups.filter(g => g.id !== this.selectedGroup.id);
    this.displayDeleteDialog = false;
}
}

//Directives/has-permission.directive.ts
//PermissionService
//has permissions directive angular
