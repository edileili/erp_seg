import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CardModule, ButtonModule, ToastModule, ReactiveFormsModule, PasswordModule, DatePickerModule,
    InputGroupModule, InputNumberModule, InputTextModule, InputGroupAddonModule,
  ],
  providers: [MessageService],
  templateUrl: './register.html',
  styleUrls: ['./register.css',],
})
export class Register {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  public registroSeg: FormGroup;
  public formSubmitted = false;

  constructor() {
    this.registroSeg = this.fb.group({
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)]],
      concontrasenia: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)]],
      nomCompleto: ['', Validators.required],
      direccion: ['', Validators.required],
      fechaNacimiento: [null, [Validators.required, this.validarMayoriaEdad.bind(this)]],
      telefono: [null, [Validators.required, Validators.pattern("^[0-9]{10,}$")]]
    });
  }
  validarMayoriaEdad(control: any) {
    const fechaSeleccionada = control.value;
    if (!fechaSeleccionada) return null;

    const hoy = new Date();
    const cumpleanos = new Date(fechaSeleccionada);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const mes = hoy.getMonth() - cumpleanos.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    return edad >= 18 ? null : { menorDeEdad: true };
  }
  onSubmit() {
    this.formSubmitted = true;

    if (this.registroSeg.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Registro completado',
        life: 3000
      });
      console.log(this.registroSeg.value);
      this.registroSeg.reset();
      this.formSubmitted = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, revisa los campos',
        life: 3000
      });
    }
  }

  isInvalid(controlName: string) {
    const control = this.registroSeg.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}