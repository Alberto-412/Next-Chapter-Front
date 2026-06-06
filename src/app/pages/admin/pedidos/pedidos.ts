import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos implements OnInit {

  pedidos: any[] = [];
  pedidoSeleccionado: any = null;
  mensaje: string = '';
  error: string = '';

  estadosValidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.adminService.getOrders().subscribe({
      next: (data: any) => {
        this.pedidos = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.error = 'Error al cargar los pedidos'
      }
    });
  }

  verPedido(orderId: number) {
    this.adminService.getOrderById(orderId).subscribe({
      next: (data: any) => {
        this.pedidoSeleccionado = data;
        this.mensaje = '';
        this.error = '';
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar el pedido'
    });
  }

  actualizarEstado(orderId: number, estado: string) {
    if (!estado) return;
    this.adminService.updateOrderStatus(orderId, estado).subscribe({
      next: () => {
        this.mensaje = 'Estado actualizado correctamente';
        this.cargarPedidos();
      },
      error: () => this.error = 'Error al actualizar el estado'
    });
  }

  cerrar() {
    this.pedidoSeleccionado = null;
    this.mensaje = '';
    this.error = '';
  }
}