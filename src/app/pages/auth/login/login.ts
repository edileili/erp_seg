import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';
import { PermissionService, Permission, UsersPermisos } from '../../../core/services/permission.service';
import { AuthService } from '../../../core/services/auth.service';
import usersConPermisos from './../../../core/assets/users.json';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private authService = inject(AuthService);

  public loginSeg: FormGroup;
  public formSubmitted = false;

  constructor(private permissionService: PermissionService) {
    this.loginSeg = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)]]
    });
  }

  async onSubmit() {
    this.formSubmitted = true;
    if (!this.loginSeg.valid) return;

    const { email, contrasenia } = this.loginSeg.value;
    const response = await this.authService.login(email, contrasenia);
    //const user = usersConPermisos.find(u => u.email === email);

    if (response) {
      this.permissionService.setPermissions(response.permisos);
      this.messageService.add({
        severity: 'success',
        summary: `¡Bienvenido a ERP!`,
        detail: 'Acceso concedido',
        life: 3000
      });

      this.loginSeg.reset();
      this.formSubmitted = false;
      setTimeout(() => this.router.navigate(['/dashboard/home']), 2000);

    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de acceso',
        detail: 'Usuario o contraseña incorrectos',
      });
    }
  }


  isInvalid(controlName: string) {
    const control = this.loginSeg.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}