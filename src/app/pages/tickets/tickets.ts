import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { GroupsService } from '../../core/services/groups.service';
import { TicketsService } from '../../core/services/tickets.service';
import { ChangeDetectorRef } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';

export interface TicketLog {
  fecha: string;
  usuario: string;
  accion: string;
  comentario?: string;
}

export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado_actual: string;
  asignado_a_nombre: string;
  creador_nombre: string;
  nivel_prioridad: string;
  creado_fecha: Date;
  fecha_cierre?: Date;
  historial: TicketLog[];
  comentarios: [];
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CardModule, BadgeModule, OverlayBadgeModule, DialogModule, ButtonModule,
    InputGroupAddonModule, InputGroupModule, HasPermissionDirective, FormsModule,
    ReactiveFormsModule, DragDropModule, TagModule, TableModule, DatePipe,
    CommonModule, RouterLink, ToastModule, TabsModule
  ],
  providers: [MessageService],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets implements OnInit {
  displayEditDialog = false;
  displayDeleteDialog = false;
  selectedTicket: Ticket | null = null;
  //private route = inject(ActivatedRoute);

  asDate(d: any) { return new Date(d); }

  group: any = {};
  tickets: any[] = [];
  miembros: any[] = [];

  nuevoEstado: number = 1;
  emailAsignar: string = '';
  nuevoComentario: string = '';
  historial: any[] = [];
  comentarios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupsService: GroupsService,
    private ticketsService: TicketsService,
    private cdr: ChangeDetectorRef
  ){}

  groups = [
    { id: 1, name: 'Equipo de Desarrollo Alfa', memberCount: 3, members: [{ email: 'admin@empresa.com', role: 'admin' }, { email: 'juan.perez@empresa.com', role: 'member' }, { email: 'ana.garcia@empresa.com', role: 'member' }], descripcion: 'Espacio de trabajo para el frontend core.' },
    { id: 2, name: 'Marketing Digital', memberCount: 5, members: [{ email: 'mkt.lead@empresa.com', role: 'admin' }, { email: 'creative@empresa.com', role: 'member' }], descripcion: 'Gestión de campañas.' },
    { id: 3, name: 'Recursos Humanos', memberCount: 2, members: [{ email: 'rrhh@empresa.com', role: 'admin' }] }
  ];

  ngOnInit() {
    const groupId = Number(this.route.snapshot.paramMap.get('idGroup'));
    this.loadGroup(groupId);
    this.loadTickets(groupId);
  }

  loadGroup(groupId: any){
    this.groupsService.findById(groupId).subscribe({
      next: (res: any) => {
        console.log('Respuesta raw grupo:', res);
        this.group = res.data[0] ?? res;
        console.log('Nombre:', this.group.nombre);
        console.log('Email:', this.group.email_creador);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar grupo', err),
      //console.log(data)
    });
  }

  loadTickets(groupId: any) {
    this.ticketsService.getEvery(groupId, true).subscribe({
      next: (res: any) => {
        console.log('Respuesta raw tickets:', res);
        this.tickets = res.data ?? res;
        this.distribuirTickets();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar tickets', err)
    });
  }

  formTicket = new FormGroup({
    titulo:         new FormControl(''),
    descripcion:    new FormControl(''),
    estado_actual:         new FormControl('Pendiente'),
    prioridad:      new FormControl('Media'),
    fecha_limite:   new FormControl(''),
  });

  todo: any[] = [];

  inProgress: any[] = [];

  review: any[] = [];

  blocked: any[] = [];

  done: any[] = [];

  distribuirTickets(): void {
    this.todo = this.tickets.filter(t => t.estado_actual === 'Pendiente');
    this.inProgress = this.tickets.filter(t => t.estado_actual === 'En progreso');
    this.review = this.tickets.filter(t => t.estado_actual === 'En revision');
    this.blocked = this.tickets.filter(t => t.estado_actual === 'Bloqueado');
    this.done = this.tickets.filter(t => t.estado_actual === 'Hecho');
  }

  usuarioLogueado = 'Eden';
  filtroTexto    = '';
  filtroEstado   = '';
  filtroPrioridad = '';
  filtroRapido   = '';

  drop(event: CdkDragDrop<Ticket[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        const ticket = event.previousContainer.data[event.previousIndex];
        const nuevoEstadoId = Number(event.container.id);
  
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
  
        this.ticketsService.cambiarEstado(ticket.id, { estado_id: nuevoEstadoId }).subscribe({
          next: () => {
            // Opcional: Mostrar mensaje de éxito
            this.messageService.add({ severity: 'success', summary: 'Estado actualizado' });
            this.loadTickets(Number(this.route.snapshot.paramMap.get('id-group')));
            this.distribuirTickets();
          },
          error: (err) => {
            // Si falla, regresamos el ticket a su lugar original o recargamos
            this.loadTickets(Number(this.route.snapshot.paramMap.get('id-group')));
            this.messageService.add({ severity: 'error', summary: 'Error al mover', detail: 'No se pudo cambiar el estado' });
          }
        });
      }
    }

  viewTicket(ticket: any) {
    const id = ticket.id;
    this.ticketsService.getById(id).subscribe({
      next: (res: any) => {
        const ticket = res.data[0] ?? res;
        console.log('ticket: ', ticket);
        this.selectedTicket = ticket;
        this.historial = ticket.historial || [];
        this.comentarios = ticket.comentarios || [];

        const estadoMap: any = { 'Pendiente': 1, 'En Progreso': 2, 'En Revisión': 3, 'Hecho': 4 };
        const prioridadMap: any = { 'Alta': 1, 'Media': 2, 'Baja': 3, 'Opcional': 4 };

        this.formTicket.patchValue({
          titulo:         ticket.titulo,
          descripcion:    ticket.descripcion || '',
          estado_actual:  estadoMap[ticket.estado_actual] || 0,
          prioridad:      prioridadMap[ticket.nivel_prioridad] || 0,
          fecha_limite:   ticket.fecha_cierre ? new Date(ticket.fecha_cierre).toISOString().split('T')[0] : '',
        });
        this.nuevoEstado = estadoMap[ticket.estado_actual] || 1;
        this.emailAsignar = ticket.asignado_email ?? '';
        this.displayEditDialog = true;
      },
      error: (err) => console.error('Error al cargar grupo', err)
    });

    const groupId = Number(this.route.snapshot.paramMap.get('idGroup'));
    this.groupsService.getMiembros(groupId).subscribe({
      next: (res: any) => {
        let rawData = Array.isArray(res) ? res : (res.data || []);
        this.miembros = rawData;
      }
    });
  }

  openEditDialog(ticket: any) {
    this.viewTicket(ticket);
  }

  openCreateTicket() {
    this.selectedTicket = null;
    this.formTicket.reset({
      estado_actual:    'Pendiente',
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
    const groupId = Number(this.route.snapshot.paramMap.get('idGroup'));
    if(this.formTicket.invalid) return;
    const payload = {
      ...this.formTicket.value,
      grupo_id: groupId,
      estado_id: Number(this.formTicket.value.estado_actual),
      prioridad_id: Number(this.formTicket.value.prioridad),
      fecha_cierre: this.formTicket.value.fecha_limite,
    };

    const request$ = this.selectedTicket?.id
    ? this.ticketsService.update(this.selectedTicket.id, payload)
    : this.ticketsService.create(payload);

    request$.subscribe({
      next: (res: any) => {
        this.closeEditDialog();
        this.loadTickets(groupId);
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: this.selectedTicket?.id ? 'Ticket Actualizado!' : 'Ticket Creado!',
            detail: this.selectedTicket?.id ? 'Cambios guardados exitosamente' : 'Añadiste un ticket exitosamente',
            life: 3000
          });
        });
      }, 
      error: (err) => {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.data?.[0]?.message || 'Error inesperado',
          });
        });
      }
    })
  }

  guardarEstado(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('idGroup'));
    if (!this.selectedTicket) return;
    const id = this.selectedTicket.id;
    this.ticketsService.cambiarEstado(id, { estado_id: this.nuevoEstado }).subscribe({
      next: () => {
        this.tickets = this.tickets.map(t =>
          t.id === id ? { ...t, estado_actual: this.nuevoEstado } : t
        );
        this.loadTickets(groupId);
        this.displayEditDialog = false;
        this.cdr.detectChanges();
        this.messageService.add({ severity: 'success', summary: 'Estado actualizado', life: 2000 });
      },
      error: (err) => {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.data?.[0]?.message || 'Error inesperado',
          });
        });
      }
    });
  }

  idUsuarioSeleccionado: number = 0;
  guardarAsignacion(): void {
    const groupId = Number(this.route.snapshot.paramMap.get('idGroup'));
    console.log("ID a enviar:", this.idUsuarioSeleccionado);
    if (!this.selectedTicket || !this.idUsuarioSeleccionado) return;

    const id = this.selectedTicket.id;
    this.ticketsService.asignar(id, { asignado_id: this.idUsuarioSeleccionado })
      .subscribe({
        next: () => {
          this.loadTickets(groupId);
          this.displayEditDialog = false;
          this.cdr.detectChanges();
          this.messageService.add({ severity: 'success', summary: 'Ticket asignado', life: 2000 });
        },
        error: (err) => {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.data?.[0]?.message || 'Error inesperado',
          });
        });
      }
      });
  }

  guardarComentario(): void {
    if (!this.selectedTicket) return;
    const id = this.selectedTicket.id;
    if (!this.nuevoComentario.trim()) return;
    this.ticketsService.agregarComentario(id, { comentario: this.nuevoComentario })
      .subscribe({
        next: () => {
          this.nuevoComentario = '';
          this.messageService.add({ severity: 'success', summary: 'Comentario agregado', life: 2000 });
        },
        error: (err) => {
          setTimeout(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.data?.[0]?.message || 'Error inesperado',
            });
          });
        }
      });
  }

  openDeleteDialog(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.displayDeleteDialog = true;
  }

  confirmDelete() {
    const groupId = Number(this.route.snapshot.paramMap.get('idGroup'));
    if (!this.selectedTicket) return;
    const id = this.selectedTicket.id;

    this.ticketsService.remove(id).subscribe({
      next: (res: any) => {
        this.displayDeleteDialog = false;
        this.selectedTicket = null;
        this.loadTickets(groupId);
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Ticket Bloqueado',
            detail: 'Bloqueaste el ticket exitosamente',
            life: 3000
          });
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al bloquear',
            detail: err.error?.data?.[0]?.message || 'Error inesperado',
          });
        });
      }
    });
  }

  ticketsFiltrados() {
    if (!Array.isArray(this.tickets)) return [];
    return this.tickets.filter(ticket => {
      const matchTexto = ticket.id.toString().includes(this.filtroTexto.toLowerCase()) ||
        ticket.asignado_a_nombre.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const matchEstado    = this.filtroEstado    ? ticket.estado_actual    === this.filtroEstado    : true;
      const matchPrioridad = this.filtroPrioridad ? ticket.nivel_prioridad === this.filtroPrioridad : true;

      let matchRapido = true;
      if      (this.filtroRapido === 'mis-tickets')    matchRapido = ticket.asignado_a_nombre === this.usuarioLogueado;
      else if (this.filtroRapido === 'sin-asignar')    matchRapido = ticket.asignado_a_nombre === 'Sin asignar' || !ticket.asignado_a_nombre;
      else if (this.filtroRapido === 'alta-prioridad') matchRapido = ticket.nivel_prioridad === 'Alta';

      return matchTexto && matchEstado && matchPrioridad && matchRapido;
    });
  }

  aplicarFiltroRapido(tipo: string) {
    this.filtroRapido = this.filtroRapido === tipo ? '' : tipo;
    
    if (this.filtroRapido === 'alta-prioridad') this.filtroPrioridad = 'Alta';
    else if (tipo === 'alta-prioridad' && !this.filtroRapido) this.filtroPrioridad = '';

    this.cargarTickets();
  }

  limpiarTodosLosFiltros() {
    this.filtroTexto = '';
    this.filtroEstado = '';
    this.filtroPrioridad = '';
    this.filtroRapido = '';
    this.cargarTickets(); // Recargar la lista completa
  }

  cargarTickets() {
    const groupId = Number(this.route.snapshot.paramMap.get('idGroup'));

    if (!this.filtroRapido) {
      this.ticketsService.getAll().subscribe(res => this.tickets = res.data);
      return;
    }

    switch (this.filtroRapido) {
      case 'alta-prioridad':
        this.ticketsService.getAltaPrioridad(groupId).subscribe(res => this.tickets = res.data);
        break;
      case 'sin-asignar':
        this.ticketsService.getSinAsignar(groupId).subscribe(res => this.tickets = res.data);
        break;
      case 'creados':
        this.ticketsService.getCreados(groupId).subscribe(res => this.tickets = res.data);
        break;
    }
  }

  private messageService = inject(MessageService);
}