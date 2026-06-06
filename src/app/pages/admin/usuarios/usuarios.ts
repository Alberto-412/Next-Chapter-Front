import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  usuarios: any[] = [];
  usuarioSeleccionado: any = null;
  modoEdicion: boolean = false;
  mensaje: string = '';
  error: string = '';

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.adminService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.error = 'Error al cargar los usuarios'
      }
    });
  }

  verUsuario(userId: number) {
    this.adminService.getUsuarioById(userId).subscribe({
      next: (data: any) => {
        this.usuarioSeleccionado = data;
        this.modoEdicion = false;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar el usuario'
    });
  }

  editarUsuario(userId: number) {
    this.adminService.getUsuarioById(userId).subscribe({
      next: (data: any) => {
        this.usuarioSeleccionado = data;
        this.modoEdicion = true;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar el usuario'
    });
  }

  guardarUsuario() {
    this.adminService.updateUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe({
      next: () => {
        this.mensaje = 'Usuario actualizado correctamente';
        this.modoEdicion = false;
        this.cargarUsuarios();
      },
      error: () => this.error = 'Error al actualizar el usuario'
    });
  }

  validarUsuario(userId: number) {
    this.adminService.validarUsuario(userId).subscribe({
      next: () => {
        this.mensaje = 'Usuario validado correctamente';
        this.cargarUsuarios();
      },
      error: () => this.error = 'Error al validar el usuario'
    });
  }

  cambiarRol(userId: number, rol: string) {
    this.adminService.updateRol(userId, rol).subscribe({
      next: () => {
        this.mensaje = 'Rol actualizado correctamente';
        this.cargarUsuarios();
      },
      error: () => this.error = 'Error al cambiar el rol'
    });
  }

  darDeBaja(userId: number) {
    if (confirm('¿Estás seguro de dar de baja a este usuario?')) {
      this.adminService.deleteUsuario(userId).subscribe({
        next: () => {
          this.mensaje = 'Usuario dado de baja correctamente';
          this.usuarioSeleccionado = null;
          this.cargarUsuarios();
        },
        error: (err: any) => this.error = err.error?.message || 'Error al dar de baja al usuario'
      });
    }
  }

  cerrarDetalle() {
    this.usuarioSeleccionado = null;
    this.modoEdicion = false;
    this.mensaje = '';
    this.error = '';
  }
}