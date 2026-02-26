import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, InputGroupModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.html'
})
export class Login implements OnInit {
  private messageService = inject(MessageService);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

onSubmit() {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    if (email === 'eden@gmail.com' && password === 'Contrasenia$') {
      this.messageService.add({
        severity: 'success',
        summary: '¡Éxito!',
        detail: 'Bienvenido a ERP',
        life: 3000 
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de acceso',
        detail: 'Usuario o contraseña incorrectos',
      });
    }
  }
}
}