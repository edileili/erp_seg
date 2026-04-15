import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropListGroup, CdkDropList, CdkDrag 
} from '@angular/cdk/drag-drop';
import { TagModule } from 'primeng/tag';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";
import { GroupsService } from '../../../core/services/groups.service';
import { ChangeDetectorRef } from '@angular/core';
import { PermissionService } from '../../../core/services/permission.service';
import { TicketsService } from '../../../core/services/tickets.service';
import { AuthService } from '../../../core/services/auth.service';
import { delay } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

export interface Grupo {
  id: number;
  nombre: string;
  descripcion: string;
  creado_fecha: string;
}

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
  creado_por_nombre: string;
  nivel_prioridad: string;
  creado_fecha: Date;
  fecha_cierre?: Date;
  historial: TicketLog[];
  comentarios: [];
}

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, RouterLink, CdkDropListGroup, CdkDropList, CdkDrag, BadgeModule, DialogModule, FormsModule, ReactiveFormsModule, TagModule, HasPermissionDirective, TabsModule, ToastModule],
  templateUrl: './group-detail.html',
  providers: [MessageService],
  styleUrl: './group-detail.css'
})
export class GroupDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  asDate(d: any) { 
    if (!d) return new Date(NaN);
    return new Date(d); }

  group: any = null;
  tickets: any[] =[];

  groups = [
    { id: 1, name: 'Equipo de Desarrollo Alfa', memberCount: 3, members: [{ email: 'admin@empresa.com', role: 'admin' }, { email: 'juan.perez@empresa.com', role: 'member' }, { email: 'ana.garcia@empresa.com', role: 'member' }], descripcion: 'Espacio de trabajo para el frontend core.' },
    { id: 2, name: 'Marketing Digital', memberCount: 5, members: [{ email: 'mkt.lead@empresa.com', role: 'admin' }, { email: 'creative@empresa.com', role: 'member' }], descripcion: 'Gestión de campañas.' },
    { id: 3, name: 'Recursos Humanos', memberCount: 2, members: [{ email: 'rrhh@empresa.com', role: 'admin' }] }
  ];

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id-group'));
    const usuario = this.authService.getTokenPayload();

    await this.groupsService.cargarPermisosGrupo(id, usuario!.id);
    setTimeout(() => {
    
      console.log("Ver:", this.verTodo());

      this.loadGroup(id);
      if(!this.verTodo()) {
        this.loadMisTickets(id);
      } else {
        this.loadAllTickets(id);
      }
      this.loadMembers(id);
    }, 0);
  }

  constructor(
    public groupsService: GroupsService,
    private cdr: ChangeDetectorRef,
    private permissionService: PermissionService,
    private ticketsService: TicketsService,
    private authService: AuthService
  ){}

  loadGroup(groupId: any) {
    this.groupsService.findById(groupId).subscribe({
      next: (res: any) => {
        this.group = res.data[0] ?? res;
      },
      error: (err) => console.error('Error al cargar grupo', err)
    });
  }

  verTodo(): boolean {
    const groupId = Number(this.route.snapshot.paramMap.get('id-group'));
    return this.groupsService.tienePermisoEnGrupo('ticket_view_all', groupId);
  }

  loadAllTickets(groupId: any) {
    this.ticketsService.getByGrupo(groupId)
      .pipe(delay(0)) 
      .subscribe({
        next: (res: any) => {
          console.log("tickets:", res.data);
          this.tickets = res.data ?? res;
          this.distribuirTickets();
        },
        error: (err) => console.error('Error al cargar tickets', err)
      });
  }

  loadMisTickets(groupId: any) {
    this.ticketsService.getMisTickets(groupId)
      .pipe(delay(0)) 
      .subscribe({
        next: (res: any) => {
          console.log("tickets:", res.data);
          this.tickets = res.data ?? res;
          this.distribuirTickets();
        },
        error: (err) => console.error('Error al cargar tickets', err)
      });
  }
  loadedMembers: { [groupId: number]: any[] } = {};

  loadMembers(groupId: any) {
    this.groupsService.getMiembros(groupId).subscribe({
      next: (res: any) => {
        this.loadedMembers[groupId] = res.data ?? res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar miembros', err)
    });
  }

  totalTickets = computed(() => 
    this.todo().length + this.inProgress().length + this.blocked().length + 
    this.done().length + this.review().length
  );

  distribuirTickets(): void {
    this.todo.set(this.tickets.filter(t => t.estado_actual === 'Pendiente'));
    this.inProgress.set(this.tickets.filter(t => t.estado_actual === 'En progreso'));
    this.review.set(this.tickets.filter(t => t.estado_actual === 'En revision'));
    this.blocked.set(this.tickets.filter(t => t.estado_actual === 'Bloqueado'));
    this.done.set(this.tickets.filter(t => t.estado_actual === 'Hecho'));
  }
  // Listas de tickets
  todo = signal<Ticket[]>([]);
  inProgress = signal<Ticket[]>([]);
  review = signal<Ticket[]>([]);
  blocked = signal<Ticket[]>([]);
  done = signal<Ticket[]>([]);

  miembros: any[] = [];

  nuevoEstado: number = 1;
  emailAsignar: string = '';
  nuevoComentario: string = '';
  historial: any[] = [];
  comentarios: any[] = [];

  puedeEditarEstado(): boolean {
    const groupId = Number(this.route.snapshot.paramMap.get('id-group'));
    return this.groupsService.tienePermisoEnGrupo('ticket_edit_state', groupId);
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    const groupId = Number(this.route.snapshot.paramMap.get('id-group'));
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 


    if(!this.puedeEditarEstado()) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Acceso denegado', 
        detail: 'No tienes permisos para cambiar el estado del ticket.' 
      });
      return;
    }
      const ticket = event.previousContainer.data[event.previousIndex];
      const nuevoEstadoId = Number(event.container.id);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      this.ticketsService.cambiarEstado(ticket.id, { 
            estado_id: nuevoEstadoId,
            grupo_id: groupId
        }).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Estado actualizado' });
          this.loadMisTickets(Number(this.route.snapshot.paramMap.get('id-group')));
          this.todo.set([...this.todo()]);
          this.inProgress.set([...this.inProgress()]);
          this.review.set([...this.review()]);
          this.blocked.set([...this.blocked()]);
          this.done.set([...this.done()]);
        },
        error: (err) => {
          this.loadMisTickets(Number(this.route.snapshot.paramMap.get('id-group')));
          this.messageService.add({ severity: 'error', summary: 'Error al mover', detail: 'No se pudo cambiar el estado' });
        }
      });
    
  }

  selectedTicket: Ticket | null = null;
  displayEditDialog = false;
  displayDeleteDialog = false;
  formTicket = new FormGroup({
    titulo:         new FormControl(''),
    descripcion:    new FormControl(''),
    estado_actual:         new FormControl('Pendiente'),
    asignado:       new FormControl('Sin asignar'),
    prioridad:      new FormControl('Media'),
    fecha_creacion: new FormControl(''),
    fecha_limite:   new FormControl(''),
    comentarios:    new FormControl(''),
  });
  viewTicket(ticket: any) {
    const id = ticket.id;
    this.ticketsService.getById(id).subscribe({
      next: (res: any) => {
        const ticket = res.data[0] ?? res;
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

    const groupId = Number(this.route.snapshot.paramMap.get('id-group'));
    this.groupsService.getMiembros(groupId).subscribe({
      next: (res: any) => {
        let rawData = Array.isArray(res) ? res : (res.data || []);
        this.miembros = rawData;
      }
    });
  }
    /** Open modal to edit (from kanban button) */
    openEditDialog(ticket: any) {
      this.viewTicket(ticket);
    }
  
    /** Open modal to create a new ticket */
    openCreateTicket() {
      this.selectedTicket = null;
      const groupId = Number(this.route.snapshot.paramMap.get('id-group'));
      this.formTicket.reset({
        estado_actual:    'Pendiente',
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
  
  isSaving = false;

  saveTicket() {
    if(this.formTicket.invalid || this.isSaving) return;

    this.isSaving = true;
    const groupId = Number(this.route.snapshot.paramMap.get('id-group'));
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
        this.loadMisTickets(groupId);
        setTimeout(() => {
          this.isSaving = false;
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
          this.isSaving = false;
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
    const groupId = Number(this.route.snapshot.paramMap.get('id-group'));
    if (!this.selectedTicket) return;
    const id = this.selectedTicket.id;
    this.ticketsService.cambiarEstado(id, { estado_id: this.nuevoEstado }).subscribe({
      next: () => {
        this.tickets = this.tickets.map(t =>
          t.id === id ? { ...t, estado_actual: this.nuevoEstado } : t
        );
        this.loadMisTickets(groupId);
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
    const groupId = Number(this.route.snapshot.paramMap.get('id-group'));
    if (!this.selectedTicket || !this.idUsuarioSeleccionado) return;

    const id = this.selectedTicket.id;

    this.ticketsService.asignar(id, { asignado_id: this.idUsuarioSeleccionado, grupo_id: groupId })
      .subscribe({
        next: () => {
          this.loadMisTickets(groupId);
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
      const groupId = Number(this.route.snapshot.paramMap.get('id-group'));
      if (!this.selectedTicket) return;
      const id = this.selectedTicket.id;
  
      this.ticketsService.remove(id).subscribe({
        next: (res: any) => {
          this.displayDeleteDialog = false;
          this.selectedTicket = null;
          this.loadMisTickets(groupId);
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
}