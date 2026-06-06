import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //lee el token del localStorage y lo añade automáticamente a cada petición que lo necesita, para no repetir ese código en cada llamada
  private getHeaders() {    
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // llamadas HTTP al backend. Cada método corresponde a una petición al backend para las funcionalidades de administración. Por ejemplo, getUsuariosPendientes() hace una petición GET a /admin/usuarios/pendientes para obtener la lista de usuarios que están pendientes de validación. Cada método devuelve un Observable que el componente puede suscribirse para manejar la respuesta.

  // --- USUARIOS ---
  getUsuariosPendientes() {
    return this.http.get(`${this.apiUrl}/admin/usuarios/pendientes`, { headers: this.getHeaders() });
  }

  validarUsuario(userId: number) {
    return this.http.put(`${this.apiUrl}/admin/usuarios/${userId}/validar`, {}, { headers: this.getHeaders() });
  }

  updateRol(userId: number, rol: string) {
    return this.http.put(`${this.apiUrl}/admin/usuarios/${userId}/rol`, { rol }, { headers: this.getHeaders() });
  }

  getUsuarios() {
    return this.http.get(`${this.apiUrl}/admin/usuarios`, { headers: this.getHeaders() });
  }

  getUsuarioById(userId: number) {
    return this.http.get(`${this.apiUrl}/admin/usuarios/${userId}`, { headers: this.getHeaders() });
  }

  updateUsuario(userId: number, datos: any) {
    return this.http.put(`${this.apiUrl}/admin/usuarios/${userId}`, datos, { headers: this.getHeaders() });
  }

  deleteUsuario(userId: number) {
    return this.http.delete(`${this.apiUrl}/admin/usuarios/${userId}`, { headers: this.getHeaders() });
  }

  // --- PRODUCTOS ---
  getProducts() {
    return this.http.get(`${this.apiUrl}/admin/products`, { headers: this.getHeaders() });
  }

  getProductById(productId: number) {
    return this.http.get(`${this.apiUrl}/admin/products/${productId}`, { headers: this.getHeaders() });
  }

  createProduct(datos: any) {
    return this.http.post(`${this.apiUrl}/admin/products`, datos, { headers: this.getHeaders() });
  }

  updateProduct(productId: number, datos: any) {
    return this.http.put(`${this.apiUrl}/admin/products/${productId}`, datos, { headers: this.getHeaders() });
  }

  deleteProduct(productId: number) {
    return this.http.delete(`${this.apiUrl}/admin/products/${productId}`, { headers: this.getHeaders() });
  }

  // --- PEDIDOS ---
  getOrders() {
    return this.http.get(`${this.apiUrl}/admin/orders`, { headers: this.getHeaders() });
  }

  getOrderById(orderId: number) {
    return this.http.get(`${this.apiUrl}/admin/orders/${orderId}`, { headers: this.getHeaders() });
  }

  updateOrderStatus(orderId: number, estado: string) {
    return this.http.put(`${this.apiUrl}/admin/orders/${orderId}`, { estado }, { headers: this.getHeaders() });
  }

  // --- DASHBOARD ---
  getDashboard() {
    return this.http.get(`${this.apiUrl}/admin/dashboard`, { headers: this.getHeaders() });
  }
}