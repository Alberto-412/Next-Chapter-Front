import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { BusquedaService } from '../../../services/busqueda.service';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, DatePipe],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos implements OnInit {

  private adminService = inject(AdminService);
  private busquedaService = inject(BusquedaService);

  pedidos = signal<any[]>([]);
  pedidoSeleccionado = signal<any>(null);
  estadoFiltro = signal('');
  mensaje = signal('');
  error = signal('');

  estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

  pedidosFiltrados = computed(() => {
    const estado = this.estadoFiltro();
    const termino = this.busquedaService.termino();

    let resultado = this.pedidos();

    if (estado) {
      resultado = resultado.filter(p => p.estado === estado);
    }

    if (termino) {
      const esNumero = !isNaN(Number(termino));
      if (esNumero) {
        resultado = resultado.filter(p => String(p.id).includes(termino));
      } else {
        resultado = resultado.filter(p =>
          p.cliente?.toLowerCase().includes(termino) ||
          p.mail?.toLowerCase().includes(termino)
        );
      }
    }

    return resultado;
  });

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.adminService.getOrders().subscribe({
      next: (data: any) => this.pedidos.set(data),
      error: () => this.error.set('Error al cargar los pedidos')
    });
  }

  filtrarEstado(estado: string) {
    this.estadoFiltro.set(estado);
  }

  verPedido(orderId: number) {
    this.adminService.getOrderById(orderId).subscribe({
      next: (data: any) => {
        this.pedidoSeleccionado.set(data);
        this.mensaje.set('');
        this.error.set('');
      },
      error: () => this.error.set('Error al cargar el pedido')
    });
  }

  actualizarEstado(orderId: number, estado: string) {
    if (!estado) return;
    this.adminService.updateOrderStatus(orderId, estado).subscribe({
      next: () => {
        this.mensaje.set('Estado actualizado correctamente');
        this.cargarPedidos();
      },
      error: () => this.error.set('Error al actualizar el estado')
    });
  }

  cerrar() {
    this.pedidoSeleccionado.set(null);
    this.mensaje.set('');
    this.error.set('');
  }
}