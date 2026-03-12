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
  priority: string;
  createdAt: Date;
  deadline?: Date;
  historial: TicketLog[];
}

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, RouterLink, CdkDropListGroup, CdkDropList, CdkDrag, BadgeModule, DialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css'
})
export class GroupDetail implements OnInit {
  private route = inject(ActivatedRoute);
  
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
    this.todo.length + this.inProgress.length + this.blocked.length + this.done.length
  );

  // Listas de tickets
  todo = ['Diseñar UI', 'Configurar Base de Datos'];
  inProgress = ['Desarrollar API Login'];
  blocked = ['Error en servidor de despliegue'];
  review = ['Pruebas unitarias de Auth'];
  done = ['Setup inicial del proyecto'];

  drop(event: CdkDragDrop<string[]>) {
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