import { Component, inject } from '@angular/core';
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
import { UsuariosService } from '../../core/services/usuarios.service';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-perfil',
  imports: [CardModule, ButtonModule, HasPermissionDirective, DialogModule, InputGroup, InputGroupAddon, InputNumber, Password, DatePicker, ReactiveFormsModule, SelectModule, TableModule, DatePipe, ToastModule],
  standalone: true,
  providers: [MessageService],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  asDate(d: any) { return new Date(d); }
  private messageService = inject(MessageService);

  perfilForm = new FormGroup({
    usuario: new FormControl(''),
    email: new FormControl(''),
    contrasenia: new FormControl(''),
    nomCompleto: new FormControl(''),
    direccion: new FormControl(''),
    fechaNacimiento: new FormControl<any>(null),
    telefono: new FormControl('')
  });

  constructor(
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadPerfil();
  }

  loadPerfil() {
    this.usuariosService.perfil().subscribe({
      next: (res: any) => {
        const userData = res.data ? res.data[0] : res;
        this.user = userData;

        console.log('Datos recibidos de la API:', userData);

        this.perfilForm.patchValue({
          usuario: userData.usuario,
          email: userData.email,
          direccion: userData.direccion,
          telefono: userData.telefono,
          
          nomCompleto: userData.nombre_com, 
          fechaNacimiento: userData.fecha_nacimiento ? new Date(userData.fecha_nacimiento) : null 
        });

        console.log('Valor del form después del patch:', this.perfilForm.value);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar perfil', err),
    });
  }

  user: any = {};

  visible: boolean = false;
  displayEditState: boolean = false

  showDialog() {
    this.visible = true;
  }

  savePerfil() {
    if (this.perfilForm.invalid) return;

    const formValues = this.perfilForm.value;

    const payload = {
      usuario: formValues.usuario,
      email: formValues.email,
      nombre_com: formValues.nomCompleto,      // Mapeo inverso
      direccion: formValues.direccion,
      telefono: formValues.telefono,
      fecha_nacimiento: formValues.fechaNacimiento instanceof Date 
          ? formValues.fechaNacimiento.toISOString() 
          : formValues.fechaNacimiento
    };

    if (formValues.contrasenia && formValues.contrasenia.trim() !== '') {
      (payload as any).contrasenia = formValues.contrasenia;
    }
    console.log('Enviando payload al servidor:', payload);

    this.usuariosService.actualizar(payload).subscribe({
      next: (res: any) => {
        this.visible = false;
        console.log('Respuesta del servidor:', res);
        this.loadPerfil();
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Datos actualizados!',
            detail: 'Cambiaste tus datos exitosamente',
            life: 3000
          });
        });
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

}
