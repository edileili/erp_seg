import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { RouterLink } from '@angular/router';
import { HasPermissionDirective } from "../../core/directives/has-permission.directive";
import { PermissionService } from '../../core/services/permission.service';
import { GroupsService } from '../../core/services/groups.service';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';

export interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  creado_fecha: string;
  total_miembros: number;
}

@Component({
  selector: 'app-home',
  imports: [CardModule, ButtonModule, BadgeModule, RouterLink, HasPermissionDirective, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    public permissionService: PermissionService,
    private groupsService: GroupsService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit() {
    this.loadMyGroups();
  }

  loadMyGroups() {
    this.groupsService.getMyGroups().subscribe({
      next: (res: any) => {
        this.groups = res.data ?? res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar grupo', err),
    });
  }

  asDate(d: any) { return new Date(d); }

  groups: any[] = [];
  groups1 = [
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
}
