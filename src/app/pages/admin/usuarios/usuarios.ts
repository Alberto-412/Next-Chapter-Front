import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { BusquedaService } from '../../../services/busqueda.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  private adminService = inject(AdminService);
  private busquedaService = inject(BusquedaService);

  usuarios = signal<any[]>([]);
  usuarioSeleccionado = signal<any>(null);
  modoEdicion = signal(false);
  mensaje = signal('');
  error = signal('');

  usuariosFiltrados = computed(() => {
    const termino = this.busquedaService.termino();
    if (!termino) return this.usuarios();
    return this.usuarios().filter(u =>
      u.nombre?.toLowerCase().includes(termino) ||
      u.mail?.toLowerCase().includes(termino)
    );
  });

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.adminService.getUsuarios().subscribe({
      next: (data: any) => this.usuarios.set(data),
      error: () => this.error.set('Error al cargar los usuarios')
    });
  }

  verUsuario(userId: number) {
    this.adminService.getUsuarioById(userId).subscribe({
      next: (data: any) => {
        this.usuarioSeleccionado.set(data);
        this.modoEdicion.set(false);
      },
      error: () => this.error.set('Error al cargar el usuario')
    });
  }

  editarUsuario(userId: number) {
    this.adminService.getUsuarioById(userId).subscribe({
      next: (data: any) => {
        this.usuarioSeleccionado.set(data);
        this.modoEdicion.set(true);
      },
      error: () => this.error.set('Error al cargar el usuario')
    });
  }

  guardarUsuario() {
    this.adminService.updateUsuario(this.usuarioSeleccionado().id, this.usuarioSeleccionado()).subscribe({
      next: () => {
        this.mensaje.set('Usuario actualizado correctamente');
        this.modoEdicion.set(false);
        this.cargarUsuarios();
      },
      error: () => this.error.set('Error al actualizar el usuario')
    });
  }

  validarUsuario(userId: number) {
    this.adminService.validarUsuario(userId).subscribe({
      next: () => {
        this.mensaje.set('Usuario validado correctamente');
        this.cargarUsuarios();
      },
      error: () => this.error.set('Error al validar el usuario')
    });
  }

  cambiarRol(userId: number, rol: string) {
    this.adminService.updateRol(userId, rol).subscribe({
      next: () => {
        this.mensaje.set('Rol actualizado correctamente');
        this.cargarUsuarios();
      },
      error: () => this.error.set('Error al cambiar el rol')
    });
  }

  darDeBaja(userId: number) {
    if (confirm('¿Estás seguro de dar de baja a este usuario?')) {
      this.adminService.deleteUsuario(userId).subscribe({
        next: () => {
          this.mensaje.set('Usuario dado de baja correctamente');
          this.usuarioSeleccionado.set(null);
          this.cargarUsuarios();
        },
        error: (err: any) => this.error.set(err.error?.message || 'Error al dar de baja al usuario')
      });
    }
  }

  updateUsuarioSeleccionado(field: string, value: unknown) {
    this.usuarioSeleccionado.update(u => ({ ...u, [field]: value }));
  }

  cerrarDetalle() {
    this.usuarioSeleccionado.set(null);
    this.modoEdicion.set(false);
    this.mensaje.set('');
    this.error.set('');
  }
}