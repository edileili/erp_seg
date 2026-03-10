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
//import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { TagModule } from 'primeng/tag';

export interface TicketLog {
  fecha: string;
  usuario: string;
  accion: string;
  comentario?: string;
}

interface Ticket {
  id: number;
  title: string;
  assignedTo: string;
  priority: 'Alta' | 'Media' | 'Baja';
  createdAt: Date;
  deadline?: Date;
  description: string;
  historial: TicketLog[];
}

@Component({
  selector: 'app-tickets',
  imports: [CardModule, BadgeModule, OverlayBadgeModule, DialogModule, ButtonModule, InputGroupAddonModule, InputGroupModule, HasPermissionDirective, FormsModule, ReactiveFormsModule, DragDropModule, TagModule],
  standalone: true,
  providers: [MessageService],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  displayDeleteDialog = false;

  formTicket = new FormGroup({
    titulo: new FormControl(''),
    descripcion: new FormControl(''),
    estado: new FormControl(''),
    asignado: new FormControl(''),
    prioridad: new FormControl(''),
    fecha_creacion: new FormControl(''),
    fecha_limite: new FormControl(''),
    comentarios: new FormControl(''),
    historial: new FormControl('')
  });

  displayEditDialog = false;
  selectedTicket: Ticket | null = null;
  visible: boolean = false;

  // Ejemplo de datos con objetos
  todo: Ticket[] = [
    { id: 101, title: 'Diseñar UI', assignedTo: 'Eden', priority: 'Alta', createdAt: new Date(), description: 'Crear prototipos en Figma', historial: [{ 
            fecha: '10/03/2026 10:00', 
            usuario: 'Admin', 
            accion: 'Cambió estado de Pendiente a En Progreso',
            comentario: 'Iniciando revisión de logs'
        }]},
    { id: 102, title: 'Configurar DB', assignedTo: 'Juan', priority: 'Media', createdAt: new Date(), description: 'Script de migración SQL', historial: [
      { 
            fecha: '10/03/2026 10:00', 
            usuario: 'Admin', 
            accion: 'Cambió estado de Pendiente a En Progreso',
            comentario: 'Iniciando revisión de logs'
        }
    ] }
  ];
  inProgress: Ticket[] = [
    { id: 103, title: 'Añadir nuevos componentes', assignedTo: 'Ana', priority: 'Baja', createdAt: new Date(), description: 'Componentes de Angular', historial: [
      { 
            fecha: '10/03/2026 10:00', 
            usuario: 'Admin', 
            accion: 'Cambió estado de Pendiente a En Progreso',
            comentario: 'Iniciando revisión de logs'
        }
    ] }
  ];
  review: Ticket[] = [
    { id: 104, title: 'Revisar UX', assignedTo: 'Karol', priority: 'Media', createdAt: new Date(), description: 'Revisar estilos y diseños', historial: [
      { 
            fecha: '10/03/2026 10:00', 
            usuario: 'Admin', 
            accion: 'Cambió estado de Pendiente a En Progreso',
            comentario: 'Iniciando revisión de logs'
        }
    ]}
  ];
  done: Ticket[] = [
    { id: 101, title: 'Comprar computadora', assignedTo: 'Sergio', priority: 'Alta', createdAt: new Date(), description: 'Una nueva computadora', historial: [
      { 
            fecha: '10/03/2026 10:00', 
            usuario: 'Admin', 
            accion: 'Cambió estado de Pendiente a En Progreso',
            comentario: 'Iniciando revisión de logs'
        }
    ] }
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
    // Aquí podrías disparar un Service para actualizar el estado en la DB
  }

  viewTicket(ticket: Ticket) {
    this.selectedTicket = { ...ticket };
    this.displayEditDialog = true;
  }

  getPrioritySeverity(priority: string) {
    switch (priority) {
      case 'Alta': return 'danger';
      case 'Media': return 'warning';
      case 'Baja': return 'info';
      default: return 'secondary';
    }
  }
openEditDialog(ticket: Ticket) {
    this.selectedTicket = { ...ticket };
    
    // Mapeo manual porque tu Form usa nombres en español y tu Interface en inglés
    this.formTicket.patchValue({
      titulo: ticket.title,
      descripcion: ticket.description,
      asignado: ticket.assignedTo,
      prioridad: ticket.priority,
      fecha_creacion: ticket.createdAt.toLocaleDateString(),
      // añade los demás campos según necesites
    });
    
    this.displayEditDialog = true;
  }

  // 2. Abrir eliminación
  openDeleteDialog(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.displayDeleteDialog = true;
  }

  // 3. Confirmar eliminación real en las listas Kanban
  confirmDelete() {
    if (this.selectedTicket) {
      const id = this.selectedTicket.id;
      
      // Función auxiliar para remover de cualquier lista
      const removerDeLista = (lista: Ticket[]) => lista.filter(t => t.id !== id);

      this.todo = removerDeLista(this.todo);
      this.inProgress = removerDeLista(this.inProgress);
      this.review = removerDeLista(this.review);
      this.done = removerDeLista(this.done);

      this.displayDeleteDialog = false;
      this.selectedTicket = null;
      
      this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Ticket borrado correctamente' });
    }
  }

  saveTicket() {
    console.log("Salvado ticket");
  }
  showDialog() {
    this.visible = true;
  }
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  //public registroSeg: FormGroup;
  public formSubmitted = false;

  filtroTexto: string = '';
  filtroEstado: string = '';
  filtroPrioridad: string = '';
  tickets = [
    { id: 101, estado: 'Abierto', asignado: 'Eden', prioridad: 'Alta', fecha: new Date() },
    { id: 102, estado: 'En Progreso', asignado: 'Ana', prioridad: 'Media', fecha: new Date() },
    { id: 103, estado: 'Abierto', asignado: 'Sin asignar', prioridad: 'Baja', fecha: new Date() },
    { id: 104, estado: 'En Progreso', asignado: 'Sin asignar', prioridad: 'Media', fecha: new Date() },
  ];


  limpiarFiltros() {
    this.filtroTexto = '';
    this.filtroEstado = '';
    this.filtroPrioridad = '';
  }

  openCreateTicket() {
    this.displayEditDialog = true;
  }
usuarioLogueado: string = 'Eden'; 
  filtroRapido: string = ''; // 'mis-tickets' | 'sin-asignar' | 'alta-prioridad' | ''

  // Actualizamos la función de filtrado
  ticketsFiltrados() {
    return this.tickets.filter(ticket => {
      // 1. Filtro de Texto (ID o Asignado)
      const matchTexto = ticket.id.toString().includes(this.filtroTexto.toLowerCase()) || 
                         ticket.asignado.toLowerCase().includes(this.filtroTexto.toLowerCase());

      // 2. Filtros de Selectores
      const matchEstado = this.filtroEstado ? ticket.estado === this.filtroEstado : true;
      const matchPrioridad = this.filtroPrioridad ? ticket.prioridad === this.filtroPrioridad : true;

      // 3. Lógica de Filtros Rápidos (Botones)
      let matchRapido = true;
      if (this.filtroRapido === 'mis-tickets') {
        matchRapido = ticket.asignado === this.usuarioLogueado;
      } else if (this.filtroRapido === 'sin-asignar') {
        matchRapido = ticket.asignado === 'Sin asignar' || !ticket.asignado;
      } else if (this.filtroRapido === 'alta-prioridad') {
        matchRapido = ticket.prioridad === 'Alta';
      }

      return matchTexto && matchEstado && matchPrioridad && matchRapido;
    });
  }

  aplicarFiltroRapido(tipo: string) {
    // Si ya está seleccionado, lo quitamos. Si no, lo ponemos.
    this.filtroRapido = this.filtroRapido === tipo ? '' : tipo;

    // Sincronización visual: Si marcas "Alta prioridad", actualizamos el select de prioridad
    if (this.filtroRapido === 'alta-prioridad') {
      this.filtroPrioridad = 'Alta';
    } else if (tipo === 'alta-prioridad' && this.filtroRapido === '') {
      // Si desmarcaste el botón de alta prioridad, limpiamos el select también
      this.filtroPrioridad = '';
    }
  }

  // Sustituye tu limpiarFiltros por esta
  limpiarTodosLosFiltros() {
    this.filtroTexto = '';
    this.filtroEstado = '';
    this.filtroPrioridad = '';
    this.filtroRapido = '';
  }
}
