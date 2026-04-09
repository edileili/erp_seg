import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Password } from 'primeng/password';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user',
  imports: [CardModule, ButtonModule, DialogModule, InputGroupModule, InputGroupAddonModule, Password, DatePicker, InputNumber, HasPermissionDirective, TagModule, TableModule, MultiSelectModule, ReactiveFormsModule],
  standalone: true,
  providers: [MessageService],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  visible: boolean = false;
  public newUser: FormGroup;
  public formSubmitted = false;

  constructor() {
    this.newUser = this.fb.group({
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

  showDialog() {
    this.visible = true;
  }

  async onSubmit() {
    this.formSubmitted = true;
    this.newUser.markAllAsTouched();
    
    if (this.newUser.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Revisa los campos', life: 3000 });
      return;
    }

    const { contrasenia, concontrasenia } = this.newUser.value;
    if (contrasenia !== concontrasenia) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Las contraseñas no coinciden', life: 3000 });
      return;
    }

    try {
      const values = this.newUser.value;
      const fecha = new Date(values.fechaNacimiento);

      // Extraemos año, mes y día localmente
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      
      const fechaLimpia = `${year}-${month}-${day}`; // Resultado: "2005-07-31"

      const dataToSubmit = {
        usuario: values.usuario,
        email: values.email,
        contrasenia: values.contrasenia,
        nombre_com: values.nomCompleto,
        direccion: values.direccion,
        fecha_nacimiento: fechaLimpia, 
        telefono: values.telefono
      };

      console.log('Enviando a la API:', dataToSubmit);
      await this.authService.newUser(dataToSubmit);

      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente', life: 3000 });
      this.newUser.reset();
      this.formSubmitted = false;
      this.visible = false;
      
    } catch (error: any) {
      // Manejo del error 409 (Conflicto) que envía tu API
      const errorMsg = error.error?.message || 'Error al registrar usuario';
      this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg, life: 3000 });
    }
  }

  isInvalid(controlName: string) {
    const control = this.newUser.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  users = [
    {id: 201, nombre: 'Eden', apellido: 'Romero', permisos: 'ticket_view'},
    {id: 202, nombre: 'Admin', apellido: 'Admin', permisos: 'admin'}
  ];

  tickets = [
    { id: 101, estado: 'Pendiente', prioridad: 'Alta', fecha: new Date() },
    { id: 103, estado: 'En Progreso', prioridad: 'Media', fecha: new Date() },
  ];

listaPermisosDisponibles = [
  { label: 'Ver Grupo', value: 'group_view' },
  { label: 'Editar Grupo', value: 'group_edit' },
  { label: 'Agregar Grupo', value: 'group_add' },
  { label: 'Eliminar Grupo', value: 'group_remove' },
  { label: 'Agregar Miembro al Grupo', value: 'group_add_member' },
  { label: 'Eliminar Miembro del Grupo', value: 'group_remove_member' },
  { label: 'Gestionar Grupos', value: 'group_manage' },

  { label: 'Ver Ticket', value: 'ticket_view' },
  { label: 'Ver Todos los Tickets', value: 'tickets_view' },
  { label: 'Editar Ticket', value: 'ticket_edit' },
  { label: 'Editar Estado de Ticket', value: 'ticket_edit_state' },
  { label: 'Editar Comentario de Ticket', value: 'ticket_edit_comment' },
  { label: 'Agregar Ticket', value: 'ticket_add' },
  { label: 'Eliminar Ticket', value: 'ticket_delete' },
  { label: 'Gestionar Tickets', value: 'ticket_manage' },

  { label: 'Ver Usuario', value: 'user_view' },
  { label: 'Ver Lista de Usuarios', value: 'users_view' },
  { label: 'Editar Usuario', value: 'user_edit' },
  { label: 'Editar Perfil de Usuario', value: 'user_edit_profile' },
  { label: 'Editar Permisos de Usuario', value: 'user_edit_permissions' },
  { label: 'Agregar Usuario', value: 'user_add' },
  { label: 'Eliminar Usuario', value: 'user_remove' },
  { label: 'Gestionar Usuarios', value: 'user_manage' }
];

  permisosSeleccionados: string[] = [];
  usuarioSeleccionado: any;

  agregarPermisos() {
    if (!this.usuarioSeleccionado.permisos) {
      this.usuarioSeleccionado.permisos = [];
    }

    const nuevos = this.permisosSeleccionados.filter(p => !this.usuarioSeleccionado.permisos.includes(p));
    this.usuarioSeleccionado.permisos.push(...nuevos);

    this.permisosSeleccionados = [];
  }

  removerPermiso(permiso: string) {
    this.usuarioSeleccionado.permisos = this.usuarioSeleccionado.permisos.filter((p: string) => p !== permiso);
  }

  getSeverity(permiso: string) {
    if (permiso === 'admin') return 'danger';
    if (permiso.startsWith('ticket')) return 'info';
    if (permiso.startsWith('user')) return 'success';
    return 'secondary';
  }
  displayEditState: boolean = false;
  openEditState() {
    this.displayEditState = true;
  }
}
