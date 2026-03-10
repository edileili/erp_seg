import { Component, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { 
  CdkDragDrop, 
  moveItemInArray, 
  transferArrayItem, 
  CdkDropListGroup, 
  CdkDropList, 
  CdkDrag 
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule, RouterLink, CdkDropListGroup, CdkDropList, CdkDrag, BadgeModule],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css'
})
export class GroupDetail implements OnInit {
  private route = inject(ActivatedRoute);
  
  group: any;

  // Datos (Idealmente esto vendría de un Service compartido)
  groups = [
    { id: 1, name: 'Equipo de Desarrollo Alfa', memberCount: 3, members: [{ email: 'admin@empresa.com', role: 'admin' }, { email: 'juan.perez@empresa.com', role: 'member' }, { email: 'ana.garcia@empresa.com', role: 'member' }], description: 'Espacio de trabajo para el frontend core.' },
    { id: 2, name: 'Marketing Digital', memberCount: 5, members: [{ email: 'mkt.lead@empresa.com', role: 'admin' }, { email: 'creative@empresa.com', role: 'member' }], description: 'Gestión de campañas.' },
    { id: 3, name: 'Recursos Humanos', memberCount: 2, members: [{ email: 'rrhh@empresa.com', role: 'admin' }] }
  ];

  ngOnInit() {
    // Obtenemos el ID de la URL
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

  openCreateTicket() {
    console.log("Abriendo diálogo para crear ticket...");
  }
}