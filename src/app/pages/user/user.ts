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
import { UsuariosService } from '../../core/services/usuarios.service';
import { ChangeDetectorRef } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { forkJoin } from 'rxjs';

interface PermisoOpcion {
    id: number,
    label: string;
    value: string;
    description: string;
}

@Component({
  selector: 'app-user',
  imports: [CardModule, ButtonModule, DialogModule, InputGroupModule, InputGroupAddonModule, Password, DatePicker, InputNumber, HasPermissionDirective, TagModule, TableModule, MultiSelectModule, ReactiveFormsModule, ToastModule, FieldsetModule],
  standalone: true,
  providers: [MessageService],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  visibleCreate: boolean = false;
  visibleEdit: boolean = false;
  newUser: FormGroup;
  public formSubmitted = false;
  public editUserForm: FormGroup;
  displayDeleteDialog = false;

  constructor( 
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {
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
    
    this.editUserForm = this.fb.group({
      id: Number,
      usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nomCompleto: ['', Validators.required],
      direccion: ['', Validators.required],
      contrasenia: '',
      fechaNacimiento: [null, [Validators.required, this.validarMayoriaEdad.bind(this)]],
      telefono: Number(['', Validators.required]),
      permisosSeleccionados: [[]]
    });
  }

  users: any[] = [];
  user: any = {};

  ngOnInit() {
    this.loadUsers();
    this.cargarPermisosGenerales();
  }

  loadUsers() {
    this.usuariosService.getUsuarios().subscribe({
      next: (res: any) => {
        this.users = res.data ?? res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar usuarios', err)
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

  createUser() {
    this.visibleCreate = true;
  }

  editUser(usuario: any) {
    this.visibleEdit = true;
    this.usuarioSeleccionado = usuario;
    this.usuariosService.getUsuario(usuario.id).subscribe({
      next: (res: any) => {
        const user = res.data[0] ?? res;
        this.editUserForm.patchValue({
          id: user.id,
          usuario: user.usuario,
          email: user.email,
          nomCompleto: user.nombre_com,
          direccion: user.direccion,
          fechaNacimiento: new Date(user.fecha_nacimiento),
          telefono: user.telefono
        });
        
        this.usuariosService.getPermisosUsuario(usuario.id).subscribe({
          next: (res) => {
            const permisosReales = res.data.filter((item: any) => item.nombre);
            this.usuarioSeleccionado.permisos = permisosReales;
            this.cdr.detectChanges();
          }
        });
        
      },
      error: (err) => console.error('Error al cargar usuario', err)
    });
  }

  onUpdate() {
    if (this.editUserForm.valid) {
      const datosActualizados = this.editUserForm.value;
      const usuarioId = datosActualizados.id;

      const actualizar: any = {
        usuario: datosActualizados.usuario,
        email: datosActualizados.email,
        nombre_com: datosActualizados.nomCompleto, 
        direccion: datosActualizados.direccion,
        telefono: Number(datosActualizados.telefono),
      };
      
      if(!datosActualizados.contrasenia || datosActualizados.contrasenia.trim() === '') {
        delete actualizar.contrasenia;
      }

      if(datosActualizados.fechaNacimiento) {
        actualizar.fechaNacimiento = actualizar.fechaNacimiento instanceof Date 
          ? actualizar.fechaNacimiento.toISOString() 
          : actualizar.fechaNacimiento;
      }

      const listaPermisoPrueba = this.usuarioSeleccionado.permisos.map((p: any) => p.id || p.permiso_id);
      const listaPermisos = this.usuarioSeleccionado.permisos.map((p: any) => {
        const coincidencia = this.listaPermisosDisponibles.find(opcion => 
          opcion.value === p.nombre || opcion.label === p.nombre
        );

        return coincidencia ? coincidencia.id : p.id; 
      }).filter((id: any) => id !== undefined && id !== null);

      delete datosActualizados.permisosSeleccionados;

      forkJoin({
        perfil: this.usuariosService.editarUsuario(actualizar, usuarioId),
        permisos: this.usuariosService.actualizarPermisos(usuarioId, { permisos: listaPermisos })
      }).subscribe({
        next: (res) => {
          this.visibleEdit = false;
          this.loadUsers();
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Éxito', 
            detail: 'Perfil y permisos actualizados correctamente', 
            life: 3000 
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error en la actualización combinada:', err);
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudieron guardar todos los cambios', 
            life: 3000 
          });
        }
      });
    }
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

      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      
      const fechaLimpia = `${year}-${month}-${day}`;

      const dataToSubmit = {
        usuario: values.usuario,
        email: values.email,
        contrasenia: values.contrasenia,
        nombre_com: values.nomCompleto,
        direccion: values.direccion,
        fecha_nacimiento: fechaLimpia, 
        telefono: values.telefono
      };

      this.usuariosService.crearUsuario(dataToSubmit).subscribe({
        next: (res: any) => {
          this.newUser.reset();
          this.formSubmitted = false;
          this.visibleCreate = false;
          this.loadUsers();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente', life: 3000 });
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar usuarios', err)
      });

    } catch (error: any) {
      const errorMsg = error.error?.message || 'Error al registrar usuario';
      this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg, life: 3000 });
    }
  }

  isInvalid(controlName: string) {
    const control = this.newUser.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  listaPermisosDisponibles: PermisoOpcion[] = [];
  permisosSeleccionados: string[] = [];
  usuarioSeleccionado: any;
  usuarioNombre: any;

  cargarPermisosGenerales(){
    this.usuariosService.getPermisosUsuarios().subscribe({
      next: (res: any) => {
        this.listaPermisosDisponibles = res.data.map((p: any) => ({
          id: p.id,
          label: p.descripcion,
          value: p.nombre,
          description: p.descripcion
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando catálogo de permisos', err)
    });
  };

  agregarPermisos() {
    const seleccionadosEnForm = this.editUserForm.get('permisosSeleccionados')?.value || [];

    if (seleccionadosEnForm.length > 0) {
      const nuevos = this.listaPermisosDisponibles
        .filter(p => seleccionadosEnForm.includes(p.value))
        .map(p => ({
          id: p.id,
          nombre: p.value,
          descripcion: p.description
        }));

      const actuales = this.usuarioSeleccionado.permisos || [];
      const filtrados = nuevos.filter(n => !actuales.some((a: { nombre: string; }) => a.nombre === n.nombre));

      this.usuarioSeleccionado.permisos = [...actuales, ...filtrados];

      this.editUserForm.get('permisosSeleccionados')?.setValue([]);
      this.cdr.detectChanges();
    }
  }

  removerPermiso(permiso: any) {
    this.usuarioSeleccionado.permisos = this.usuarioSeleccionado.permisos.filter(
        (p: any) => p.nombre !== permiso.nombre
    );
  }
  
  getSeverity(permiso: string) {
    if (permiso.startsWith('group')) return 'warn';
    if (permiso.startsWith('ticket')) return 'info';
    if (permiso.startsWith('user')) return 'success';
    return 'secondary';
  }

  openDeleteDialog(usuario: any) {
      this.usuarioSeleccionado = usuario.id;
      this.usuarioNombre = usuario.nombre_com;
      this.displayDeleteDialog = true;
    }

  confirmDelete() {
    const id = this.usuarioSeleccionado;

    this.usuariosService.eliminar(id).subscribe({
      next: (res: any) => {
        this.displayDeleteDialog = false;
        this.usuarioSeleccionado = null;
        this.loadUsers();
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario Desactivado',
            detail: 'Desactivaste al usuario exitosamente',
            life: 3000
          });
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al bloquear',
            detail: err.error?.data?.[0]?.message || 'Error inesperado',
          });
        });
      }
    });
  }
}
