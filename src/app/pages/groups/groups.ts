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
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';
import { PermissionService } from '../../core/services/permission.service';
import { GroupsService } from '../../core/services/groups.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CardModule, BadgeModule, OverlayBadgeModule, DialogModule, ButtonModule, InputGroupAddonModule, InputGroupModule, HasPermissionDirective, ReactiveFormsModule, FormsModule, TagModule, MessageModule, ToastModule],
  providers: [MessageService],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {
  groups: any[] = [];
  errorMessage: string = '';

  constructor(
    private groupsService: GroupsService,
    private permissionService: PermissionService,
  ){}

  private cdr = inject(ChangeDetectorRef)

  ngOnInit(): void {
    const tienePermiso = this.permissionService.hasPermission('group_manage');

    if (tienePermiso) {
      this.loadGroups();
    } else {
      this.errorMessage = 'No tienes permisos para grupos';
    }
  }

  loadGroups() {
    this.groupsService.findAll().subscribe({
      next: (res: any) => {
        this.groups = res.data;
        
        if (this.groups && this.groups.length > 0) {
          this.groups.forEach(group => {
            this.loadMembers(group);
          });
        }
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los grupos';
      }
    });
  }

  loadedMembers: { [groupId: number]: any[] } = {};
  loadingMembers: { [groupId: number]: boolean } = {};

  loadMembers(group: any) {
    if (this.loadingMembers[group.id] || this.loadedMembers[group.id]) return;

    this.loadingMembers[group.id] = true;

    this.groupsService.getMiembros(group.id).subscribe({
      next: (res: any) => {
        let rawData = Array.isArray(res) ? res : (res.data || []);
        
        const filteredMembers = rawData.filter((item: any) => item && item.id);

        this.loadedMembers = {
          ...this.loadedMembers,
          [group.id]: filteredMembers
        };

        this.loadingMembers[group.id] = false;
        
        this.cdr.markForCheck(); 
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingMembers[group.id] = false;
        this.loadedMembers[group.id] = []; 
        this.cdr.detectChanges();
      }
    });
  }

  private router = inject(Router);

  groupForm = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl('')
  });

  viewTickets(group: any) {
    this.router.navigate(['/dashboard/groups', group.id, 'tickets']);
  }

  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  public formSubmitted = false;

  displayEditDialog: boolean = false;
  displayDeleteDialog: boolean = false;
  selectedGroup: any = { name: '', members: [] };
  newUserEmail: string = '';
  visible: boolean = false;
  newMemberEmail: string = '';

  addGroup() {
    this.groupForm.reset();
    this.visible = true;
  }

  saveNewGroup() {
    if(this.groupForm.invalid) return;

    const payload = this.groupForm.value;

    this.groupsService.create(payload).subscribe({
      next: (res: any) => {
        this.visible = false;
        this.loadGroups();
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Grupo Creado!',
            detail: 'Añadiste un grupo exitosamente',
            life: 3000
          });
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear grupo',
            detail: err.error?.data?.[0]?.message || 'Error inesperado',
          });
        });
      }
    });
  }

  groupEditForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl('')
  });

  editGroup(group: any) {
    this.selectedGroup = { ...group, members: [] };
    this.groupEditForm.patchValue({
      nombre: group.nombre,
      descripcion: group.descripcion
    });
    this.displayEditDialog = true;
    this.loadMembers(group); // carga los miembros
  }

  updateGroup() {
    if (this.groupEditForm.invalid) return;

    const payload = this.groupEditForm.value;

    this.groupsService.update(this.selectedGroup.id, payload).subscribe({
      next: (res: any) => {
        this.displayEditDialog = false;
        this.loadGroups();
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Grupo Editado!',
            detail: 'Editaste el grupo exitosamente',
            life: 3000
          });
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al editar grupo',
            detail: err.error?.data?.[0]?.message || 'Error inesperado',
          });
        });
      }
    });
  }

  addUser() {
    if (!this.newUserEmail) return;

    /*const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!this.newUserEmail || !emailPattern.test(this.newUserEmail)) {
        this.messageService.add({ severity: 'warn', summary: 'Email inválido' });
        return;
    }*/
    this.groupsService.addMiembro(this.selectedGroup.id, this.newUserEmail).subscribe({
      next: (res: any) => {
        delete this.loadedMembers[this.selectedGroup.id]; 
      this.loadMembers(this.selectedGroup);
      this.newUserEmail = '';
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Miembro agregado',
            life: 3000
          });
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al agregar miembro',
            detail: err.error?.data?.[0]?.message || 'Error inesperado',
          });
        });
      }
    });
  }

  deleteGroup(group: any) {
    this.selectedGroup = group;
    this.displayDeleteDialog = true;
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