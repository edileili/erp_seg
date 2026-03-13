import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";
import { ButtonModule } from 'primeng/button';
import { HasPermissionDirective } from "../../core/directives/has-permission.directive";
import { PermissionService } from '../../core/services/permission.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, Toast, ButtonModule, HasPermissionDirective],
  providers: [MessageService],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css',],
})
export class Sidebar {
  private router = inject(Router);
  private messageService = inject(MessageService);
  constructor(public permissionService: PermissionService){}

  isExpanded = true;
  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  signOut() {
    this.messageService.add({
      severity: 'success',
      summary: 'Saliendo de ERP...',
      detail: '¡Vuelve pronto!',
      life: 3000
    });
    this.permissionService.clearPermissions();
    localStorage.removeItem('erp_token');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  users() {
    this.router.navigate(['/dashboard/user']);
  }

  home() {
    this.router.navigate(['/dashboard/home']);
  }

  groups() {
    this.router.navigate(['/dashboard/groups'])
  }

  tickets() {
    this.router.navigate(['/dashboard/tickets'])
  }

  perfil() {
    this.router.navigate(['/dashboard/perfil'])
  }
}
