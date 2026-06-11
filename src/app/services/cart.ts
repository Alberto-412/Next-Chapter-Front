import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Cart {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  // Signal con el número de items del carrito (para el badge del icono)
  cartCount = signal(0);

  // GET /api/cart → ver el contenido del carrito
  getCarrito() {
    return this.http.get<any[]>(this.apiUrl);
  }

  // POST /api/cart/items → añadir un libro al carrito
  addItem(bookId: number, cantidad: number) {
    return this.http.post(`${this.apiUrl}/items`, { id_producto: bookId, cantidad });
  }

  // PUT /api/cart/items/:bookId → cambiar la cantidad de un libro
  updateCantidad(bookId: number, cantidad: number) {
    return this.http.put(`${this.apiUrl}/items/${bookId}`, { cantidad });
  }

  // DELETE /api/cart/items/:bookId → quitar un libro
  removeItem(bookId: number) {
    return this.http.delete(`${this.apiUrl}/items/${bookId}`);
  }

  // DELETE /api/cart → vaciar el carrito entero
  vaciarCarrito() {
    return this.http.delete(this.apiUrl);
  }
}