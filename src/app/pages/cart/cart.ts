import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart as CartService } from '../../services/cart';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);

  items = signal<any[]>([]);   // los productos del carrito
  cargando = signal(true);     // para mostrar "cargando..."

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.cargando.set(true);
    this.cartService.getCarrito().subscribe({
      next: (data) => {
        this.items.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  // Total del carrito (suma de precio x cantidad de cada libro)
  total() {
    return this.items().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  cambiarCantidad(bookId: number, cantidad: number) {
    if (cantidad < 1) return;
    this.cartService.updateCantidad(bookId, cantidad).subscribe(() => this.cargarCarrito());
  }

  eliminar(bookId: number) {
    this.cartService.removeItem(bookId).subscribe(() => this.cargarCarrito());
  }

  vaciar() {
    this.cartService.vaciarCarrito().subscribe(() => this.cargarCarrito());
  }
}