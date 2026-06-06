import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // --- AUTH ---
  register(datos: unknown) {
    return this.http.post(`${this.apiUrl}/auth/register`, datos);
  }

  login(datos: unknown) {
    return this.http.post(`${this.apiUrl}/auth/login`, datos);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers: this.getHeaders() });
  }

  // --- PERFIL ---
  getPerfil() {
    return this.http.get(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  updatePerfil(datos: unknown) {
    return this.http.put(`${this.apiUrl}/profile`, datos, { headers: this.getHeaders() });
  }

  updatePassword(datos: { contrasenaActual: string; contrasenaNueva: string }) {
    const body = {
      contraseñaActual: datos.contrasenaActual,
      contraseñaNueva: datos.contrasenaNueva
    };
    return this.http.put(`${this.apiUrl}/profile/password`, body, { headers: this.getHeaders() });
  }

  deletePerfil() {
    return this.http.delete(`${this.apiUrl}/profile`, { headers: this.getHeaders() });
  }

  // --- WISHLIST ---
  getWishlist() {
    return this.http.get(`${this.apiUrl}/wishlist`, { headers: this.getHeaders() });
  }

  addToWishlist(bookId: number) {
    return this.http.post(`${this.apiUrl}/wishlist/${bookId}`, {}, { headers: this.getHeaders() });
  }

  removeFromWishlist(bookId: number) {
    return this.http.delete(`${this.apiUrl}/wishlist/${bookId}`, { headers: this.getHeaders() });
  }

  // --- REVIEWS ---
  getReviews() {
    return this.http.get(`${this.apiUrl}/reviews`, { headers: this.getHeaders() });
  }

  addReview(datos: unknown) {
    return this.http.post(`${this.apiUrl}/reviews`, datos, { headers: this.getHeaders() });
  }

  updateReview(reviewId: number, datos: unknown) {
    return this.http.put(`${this.apiUrl}/reviews/${reviewId}`, datos, { headers: this.getHeaders() });
  }

  deleteReview(reviewId: number) {
    return this.http.delete(`${this.apiUrl}/reviews/${reviewId}`, { headers: this.getHeaders() });
  }
}