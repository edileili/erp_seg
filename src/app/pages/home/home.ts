import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CardModule, ButtonModule, BadgeModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  groups = [
    {
      id: 1,
      name: 'Equipo de Desarrollo Alfa',
      memberCount: 3,
      members: [
        { email: 'admin@empresa.com', role: 'admin' },
        { email: 'juan.perez@empresa.com', role: 'member' },
        { email: 'ana.garcia@empresa.com', role: 'member' }
      ],
      description: 'Espacio de trabajo para el frontend core.'
    },
    {
      id: 2,
      name: 'Marketing Digital',
      memberCount: 5,
      members: [
        { email: 'mkt.lead@empresa.com', role: 'admin' },
        { email: 'creative@empresa.com', role: 'member' },
        { email: 'social.media@empresa.com', role: 'member' },
        { email: 'seo.specialist@empresa.com', role: 'member' },
        { email: 'copywriter@empresa.com', role: 'member' }
      ],
      description: 'Gestión de campañas y redes sociales.'
    },
    {
      id: 3,
      name: 'Recursos Humanos',
      memberCount: 2,
      members: [
        { email: 'rrhh@empresa.com', role: 'admin' },
        { email: 'talent.scout@empresa.com', role: 'member' }
      ]
    }
  ];
}
