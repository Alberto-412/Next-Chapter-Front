import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart as CartService } from '../../services/cart';
import { Order as OrderService } from '../../services/order';
import { CheckoutSummary } from '../../components/checkout-summary/checkout-summary';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutSummary],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  items = signal<any[]>([]);
  direccion_envio = signal('');
  metodo_pago = signal('tarjeta');
  cargando = signal(false);
  error = signal('');

  ngOnInit() {
    this.cartService.getCarrito().subscribe({
      next: (data) => this.items.set(data),
      error: () => this.items.set([]),
    });
  }

  subtotal() {
    return this.items().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  finalizarPedido() {
    if (!this.direccion_envio().trim()) {
      this.error.set('Introduce una dirección de envío');
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    this.orderService.crearPedido(this.direccion_envio(), this.metodo_pago()).subscribe({
      next: (resp: any) => {
        this.cargando.set(false);
        this.router.navigate(['/orders', resp.id_pedido]);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.error || 'Error al crear el pedido');
      },
    });
  }
}