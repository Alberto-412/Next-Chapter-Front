import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { BusquedaService } from '../../../services/busqueda.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private adminService = inject(AdminService);
  protected busquedaService = inject(BusquedaService);

  pedidos = signal<any[]>([]);
  usuariosPendientes = signal<any[]>([]);
  stats = signal<any>(null);
  error = signal('');
  pedidoSeleccionado = signal<any>(null);

  paginaActual = signal(1);
  porPagina = 4;

  pedidosFiltrados = computed(() => {
    const termino = this.busquedaService.termino();
    if (!termino) return this.pedidos();

    const esNumero = !isNaN(Number(termino)) && termino !== '';

    if (esNumero) {
      return this.pedidos().filter(p => p.id === Number(termino));
    }

    return this.pedidos().filter(p =>
      p.cliente?.toLowerCase().includes(termino) ||
      p.mail?.toLowerCase().includes(termino)
    );
  });

  usuariosPendientesFiltrados = computed(() => {
    const termino = this.busquedaService.termino();
    if (!termino) return this.usuariosPendientes();
    return this.usuariosPendientes().filter(u =>
      u.nombre?.toLowerCase().includes(termino) ||
      u.mail?.toLowerCase().includes(termino)
    );
  });

  pedidosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return this.pedidosFiltrados().slice(inicio, inicio + this.porPagina);
  });

  totalPaginas = computed(() => Math.ceil(this.pedidosFiltrados().length / this.porPagina));

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.adminService.getDashboard().subscribe({
      next: (data: any) => {
        this.pedidos.set(data.pedidos);
        this.usuariosPendientes.set(data.usuariosPendientes);
        this.stats.set(data.stats);
      },
      error: () => this.error.set('Error al cargar el dashboard')
    });
  }

  validarUsuario(userId: number) {
    this.adminService.validarUsuario(userId).subscribe({
      next: () => {
        this.usuariosPendientes.update(u => u.filter(u => u.id !== userId));
      },
      error: () => this.error.set('Error al validar el usuario')
    });
  }

  verPedido(pedido: any) {
    this.pedidoSeleccionado.set(pedido);
  }

  cerrarDetalle() {
    this.pedidoSeleccionado.set(null);
  }

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }
}