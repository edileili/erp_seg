import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing',
  imports: [CardModule, FormsModule, SelectModule, InputGroupModule, InputNumberModule, InputTextModule, ButtonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

}
