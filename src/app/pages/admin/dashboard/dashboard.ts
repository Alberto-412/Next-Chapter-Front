import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private adminService = inject(AdminService);

  pedidos = signal<any[]>([]);
  usuariosPendientes = signal<any[]>([]);
  error = signal('');

  totalPedidos = computed(() => this.pedidos().length);
  totalEntregados = computed(() => this.pedidos().filter(p => p.estado === 'entregado').length);
  totalCancelados = computed(() => this.pedidos().filter(p => p.estado === 'cancelado').length);

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.adminService.getDashboard().subscribe({
      next: (data: any) => {
        this.pedidos.set(data.pedidos);
        this.usuariosPendientes.set(data.usuariosPendientes);
      },
      error: () => this.error.set('Error al cargar el dashboard')
    });
  }

  validarUsuario(userId: number) {
    this.adminService.validarUsuario(userId).subscribe({
      next: () => {
        this.usuariosPendientes.update(usuarios => usuarios.filter(u => u.id !== userId));
      },
      error: () => this.error.set('Error al validar el usuario')
    });
  }
}