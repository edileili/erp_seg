import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-groups',
  imports: [CardModule, BadgeModule, OverlayBadgeModule, DialogModule, ButtonModule, InputGroupAddonModule, InputGroupModule],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {
  visible: boolean = false;

    showDialog() {
        this.visible = true;
    }
}
