import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

@Component({
  selector: 'app-tickets',
  imports: [CardModule, BadgeModule, OverlayBadgeModule, DialogModule, ButtonModule, InputGroupAddonModule, InputGroupModule, HasPermissionDirective],
  providers: [MessageService],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css',
})
export class Tickets {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  //public registroSeg: FormGroup;
  public formSubmitted = false;
}
