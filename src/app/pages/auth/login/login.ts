import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, InputGroupModule, InputGroupAddonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);

  public loginSeg: FormGroup;
  public formSubmitted = false;

  constructor() {
    this.loginSeg = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)]]
    });
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.loginSeg.valid) {
      const { email, contrasenia } = this.loginSeg.value;

      if (email === 'eden@gmail.com' && contrasenia === 'Contrasenia$') {
        this.messageService.add({
          severity: 'success',
          summary: '¡Éxito!',
          detail: 'Bienvenido a ERP',
          life: 3000
        });
        console.log(this.loginSeg.value);
        this.loginSeg.reset();
        this.formSubmitted = false;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de acceso',
          detail: 'Usuario o contraseña incorrectos',
        });
      }
    }
  }

  isInvalid(controlName: string) {
    const control = this.loginSeg.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}