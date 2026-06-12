import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart as CartService } from '../../services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private cartService = inject(CartService);

  items = signal<any[]>([]);      // productos del carrito (para el cajón)
  drawerAbierto = signal(false);  // controla si el cajón está abierto

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.cartService.getCarrito().subscribe({
      next: (data) => this.items.set(data),
      error: () => this.items.set([]),
    });
  }

  // Número total de productos (para el badge)
  cartCount() {
    return this.items().reduce((acc, item) => acc + item.cantidad, 0);
  }

  // Total en € (para mostrar en el cajón)
  total() {
    return this.items().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  toggleDrawer() {
    this.drawerAbierto.set(!this.drawerAbierto());
    if (this.drawerAbierto()) this.cargarCarrito(); // refresca al abrir
  }

  cerrarDrawer() {
    this.drawerAbierto.set(false);
  }

  eliminar(bookId: number) {
    this.cartService.removeItem(bookId).subscribe(() => this.cargarCarrito());
  }
}
