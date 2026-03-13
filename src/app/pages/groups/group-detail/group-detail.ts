import { Component, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { 
  CdkDragDrop, 
  moveItemInArray, 
  transferArrayItem, 
  CdkDropListGroup, 
  CdkDropList, 
  CdkDrag 
} from '@angular/cdk/drag-drop';
import { TagModule } from 'primeng/tag';

export interface TicketLog {
  fecha: string;
  usuario: string;
  accion: string;
  comentario?: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  estado: string;
  assignedTo: string;
  createdFrom: string;
  priority: string;
  createdAt: Date;
  deadline?: Date;
  historial: TicketLog[];
}

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, RouterLink, CdkDropListGroup, CdkDropList, CdkDrag, BadgeModule, DialogModule, FormsModule, ReactiveFormsModule, TagModule],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css'
})
export class GroupDetail implements OnInit {
  private route = inject(ActivatedRoute);
  
    asDate(d: any) { return new Date(d); }

  group: any;

  groups = [
    { id: 1, name: 'Equipo de Desarrollo Alfa', memberCount: 3, members: [{ email: 'admin@empresa.com', role: 'admin' }, { email: 'juan.perez@empresa.com', role: 'member' }, { email: 'ana.garcia@empresa.com', role: 'member' }], description: 'Espacio de trabajo para el frontend core.' },
    { id: 2, name: 'Marketing Digital', memberCount: 5, members: [{ email: 'mkt.lead@empresa.com', role: 'admin' }, { email: 'creative@empresa.com', role: 'member' }], description: 'Gestión de campañas.' },
    { id: 3, name: 'Recursos Humanos', memberCount: 2, members: [{ email: 'rrhh@empresa.com', role: 'admin' }] }
  ];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id-group'));
    this.group = this.groups.find(g => g.id === id);
    
  }

  totalTickets = computed(() => 
    this.todo.length + this.inProgress.length + this.blocked.length + this.done.length + this.review.length
  );

  // Listas de tickets
  todo: Ticket[] = [
    {
      id: 101,
      title: 'Diseñar UI',
      description: 'Crear prototipos en Figma para el módulo de reportes.',
      estado: 'Pendiente',
      assignedTo: 'Eden',
      createdFrom: 'Eden',
      priority: 'Alta',
      createdAt: new Date('2026-03-01'),
      deadline: new Date('2026-04-30'),
      historial: [
        { fecha: '01/03/2026 09:00', usuario: 'Eden', accion: 'Ticket creado', comentario: 'Se abrió el ticket' },
      ],
    },
    /*{
      id: 102,
      title: 'Configurar DB',
      description: 'Escribir el script de migración SQL para la nueva tabla de usuarios.',
      estado: 'Pendiente',
      assignedTo: 'Juan',
      createdFrom: 'Admin',
      priority: 'Media',
      createdAt: new Date('2026-03-02'),
      deadline: new Date('2026-04-30'),
      historial: [
        { fecha: '02/03/2026 10:00', usuario: 'Admin', accion: 'Asignado a Juan', comentario: 'Revisión de base de datos' },
      ],
    },*/
  ];

  inProgress: Ticket[] = [
    /*{
      id: 103,
      title: 'Añadir nuevos componentes',
      description: 'Integrar componentes Angular reutilizables en el módulo de ventas.',
      estado: 'En Progreso',
      assignedTo: 'Ana',
      createdFrom: 'Admin',
      priority: 'Baja',
      createdAt: new Date('2026-03-03'),
      deadline: new Date('2026-04-30'),
      historial: [
        { fecha: '03/03/2026 11:00', usuario: 'Ana', accion: 'Cambió estado a En Progreso', comentario: 'Iniciando desarrollo' },
      ],
    },*/
  ];

  review: Ticket[] = [
    {
      id: 104,
      title: 'Revisar UX',
      description: 'Revisar estilos, accesibilidad y consistencia visual del sistema.',
      estado: 'En Revisión',
      assignedTo: 'Eden',
      createdFrom: 'Admin',
      priority: 'Media',
      createdAt: new Date('2026-03-04'),
      deadline: new Date('2026-04-30'),
      historial: [
        { fecha: '04/03/2026 14:00', usuario: 'Karol', accion: 'Enviado a revisión', comentario: 'Pendiente de aprobación' },
      ],
    },
  ];

  done: Ticket[] = [
    /*{
      id: 105,
      title: 'Comprar computadora',
      description: 'Adquisición de equipo de desarrollo para el nuevo integrante.',
      estado: 'Hecho',
      assignedTo: 'Sergio',
      createdFrom: 'Admin',
      priority: 'Alta',
      createdAt: new Date('2026-02-20'),
      deadline: new Date('2026-04-30'),
      historial: [
        { fecha: '25/02/2026 16:00', usuario: 'Sergio', accion: 'Ticket completado', comentario: 'Equipo recibido y configurado' },
      ],
    },*/
  ];

  blocked: Ticket[] = [
    /*{
      id: 106,
      title: 'Comprar Tacos',
      description: 'Almuerzo fuera del trabajo',
      estado: 'blocked',
      assignedTo: 'Ana',
      createdFrom: 'Ana',
      priority: 'Baja',
      createdAt: new Date('2026-02-20'),
      deadline: new Date('2026-04-30'),
      historial: [
        { fecha: '25/02/2026 16:00', usuario: 'Sergio', accion: 'Ticket completado', comentario: 'Equipo recibido y configurado' },
      ],
    },*/
  ];

  drop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  selectedTicket: Ticket | null = null;
  displayEditDialog = false;
  formTicket = new FormGroup({
    titulo:         new FormControl(''),
    descripcion:    new FormControl(''),
    estado:         new FormControl('Pendiente'),
    asignado:       new FormControl('Sin asignar'),
    prioridad:      new FormControl('Media'),
    fecha_creacion: new FormControl(''),
    fecha_limite:   new FormControl(''),
    comentarios:    new FormControl(''),
  });
    viewTicket(ticket: Ticket) {
      this.selectedTicket = { ...ticket };
      this.formTicket.patchValue({
        titulo:         ticket.title,
        descripcion:    ticket.description,
        estado:         ticket.estado,
        asignado:       ticket.assignedTo,
        prioridad:      ticket.priority,
        fecha_creacion: ticket.createdAt.toISOString().split('T')[0],
        fecha_limite:   ticket.deadline ? ticket.deadline.toISOString().split('T')[0] : '',
        comentarios:    '',
      });
      this.displayEditDialog = true;
    }
    /** Open modal to edit (from kanban button) */
    openEditDialog(ticket: Ticket) {
      this.viewTicket(ticket);
    }
  
    /** Open modal to create a new ticket */
    openCreateTicket() {
      this.selectedTicket = null;
      this.formTicket.reset({
        estado:    'Pendiente',
        asignado:  'Sin asignar',
        prioridad: 'Media',
      });
      this.displayEditDialog = true;
    }
  
    closeEditDialog() {
      this.formTicket.reset();
      this.selectedTicket = null;
      this.displayEditDialog = false;
    }
  
    saveTicket() {
      const values = this.formTicket.value;
      console.log('Guardando ticket:', values);
      this.closeEditDialog();
    }
}