import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CardModule, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
