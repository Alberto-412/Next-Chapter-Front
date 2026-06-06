import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  private adminService = inject(AdminService);

  productos = signal<any[]>([]);
  productoSeleccionado = signal<any>(null);
  modoEdicion = signal(false);
  modoCreacion = signal(false);
  mensaje = signal('');
  error = signal('');

  nuevoProducto = signal({
    titulo: '',
    descripcion: '',
    isbn: '',
    precio: null as number | null,
    stock: 0,
    pre_reserva: 0,
    imagen: '',
    fecha_publicacion: '',
    id_editorial: null as number | null
  });

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.adminService.getProducts().subscribe({
      next: (data: any) => this.productos.set(data),
      error: () => this.error.set('Error al cargar los productos')
    });
  }

  editarProducto(productId: number) {
    this.adminService.getProductById(productId).subscribe({
      next: (data: any) => {
        this.productoSeleccionado.set({ ...data });
        this.modoEdicion.set(true);
        this.modoCreacion.set(false);
      },
      error: () => this.error.set('Error al cargar el producto')
    });
  }

  guardarProducto() {
    this.adminService.updateProduct(this.productoSeleccionado().id, this.productoSeleccionado()).subscribe({
      next: () => {
        this.mensaje.set('Producto actualizado correctamente');
        this.modoEdicion.set(false);
        this.productoSeleccionado.set(null);
        this.cargarProductos();
      },
      error: () => this.error.set('Error al actualizar el producto')
    });
  }

  mostrarFormularioCreacion() {
    this.modoCreacion.set(true);
    this.modoEdicion.set(false);
    this.productoSeleccionado.set(null);
    this.mensaje.set('');
    this.error.set('');
  }

  crearProducto() {
    this.adminService.createProduct(this.nuevoProducto()).subscribe({
      next: () => {
        this.mensaje.set('Producto creado correctamente');
        this.modoCreacion.set(false);
        this.nuevoProducto.set({
          titulo: '', descripcion: '', isbn: '', precio: null,
          stock: 0, pre_reserva: 0, imagen: '', fecha_publicacion: '', id_editorial: null
        });
        this.cargarProductos();
      },
      error: () => this.error.set('Error al crear el producto')
    });
  }

  eliminarProducto(productId: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          this.mensaje.set('Producto eliminado correctamente');
          this.productoSeleccionado.set(null);
          this.cargarProductos();
        },
        error: (err: any) => this.error.set(err.error?.message || 'Error al eliminar el producto')
      });
    }
  }

  updateNuevoProducto(field: string, value: unknown) {
    this.nuevoProducto.update(p => ({ ...p, [field]: value }));
  }

  updateProductoSeleccionado(field: string, value: unknown) {
    this.productoSeleccionado.update(p => ({ ...p, [field]: value }));
  }

  cerrar() {
    this.productoSeleccionado.set(null);
    this.modoEdicion.set(false);
    this.modoCreacion.set(false);
    this.mensaje.set('');
    this.error.set('');
  }
}