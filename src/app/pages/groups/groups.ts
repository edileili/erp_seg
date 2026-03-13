import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule, FormControl } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

@Component({
  selector: 'app-groups',
  imports: [CardModule, BadgeModule, OverlayBadgeModule, DialogModule, ButtonModule, InputGroupAddonModule, InputGroupModule, HasPermissionDirective, ReactiveFormsModule, FormsModule],
  providers: [MessageService],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {
  visible: boolean = false;
  newMemberEmail: string = '';

  groupForm = new FormGroup({
    nivel: new FormControl(''),
    autor: new FormControl(''),
    nombre: new FormControl(''),
    integrantes: new FormControl(''),
    tickets: new FormControl(''),
    descripcion: new FormControl('')
  });

  showDialog() {
    this.visible = true;
  }
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

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

displayEditDialog: boolean = false;
displayDeleteDialog: boolean = false;
selectedGroup: any = { name: '', members: [] };
newUserEmail: string = '';

editGroup(group: any) {
    this.selectedGroup = { ...group }; 
    this.displayEditDialog = true;
}

deleteGroup(group: any) {
    this.selectedGroup = group;
    this.displayDeleteDialog = true;
}

addUser() {
    if (this.newUserEmail) {
        this.selectedGroup.members.push({ email: this.newUserEmail, role: 'member' });
        this.newUserEmail = '';
    }
}

removeUser(email: string) {
    this.selectedGroup.members = this.selectedGroup.members.filter((u: any) => u.email !== email);
}

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
