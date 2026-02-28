import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-groups',
  imports: [CardModule, BadgeModule, OverlayBadgeModule],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {

}
