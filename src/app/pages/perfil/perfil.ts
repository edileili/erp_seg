import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { DialogModule } from 'primeng/dialog';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputNumber } from 'primeng/inputnumber';
import { Password } from 'primeng/password';
import { DatePicker } from 'primeng/datepicker';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableModule } from "primeng/table";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [CardModule, ButtonModule, HasPermissionDirective, DialogModule, InputGroup, InputGroupAddon, InputNumber, Password, DatePicker, ReactiveFormsModule, SelectModule, TableModule, DatePipe],
  standalone: true,
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
    asDate(d: any) { return new Date(d); }

    tickets = [
    { id: 101, estado: 'Pendiente', prioridad: 'Alta', fechaCreacion: new Date('2026-03-12'), fechaLimite: new Date('2026-04-30') },
    { id: 103, estado: 'En Progreso', prioridad: 'Media', fechaCreacion: new Date('2026-03-12'), fechaLimite: new Date('2026-04-30') },
  ];

  perfilForm = new FormGroup({
    usuario: new FormControl(''),
    email: new FormControl(''),
    contrasenia: new FormControl(''),
    nomCompleto: new FormControl(''),
    direccion: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    telefono: new FormControl('')
  });

  ticketForm = new FormGroup({
    estado: new FormControl('')
  });

  estadosOptions = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En progreso', value: 'En progreso' },
    { label: 'En revisión', value: 'En revisión' },
    { label: 'Hecho', value: 'Hecho' }
  ];

  guardarTicket(){}

    visible: boolean = false;
    displayEditState: boolean = false

  showDialog() {
    this.visible = true;
  }

  editState() {
    this.displayEditState = true;
  }
}
