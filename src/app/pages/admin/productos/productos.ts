import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  productos: any[] = [];
  productoSeleccionado: any = null;
  modoEdicion: boolean = false;
  modoCreacion: boolean = false;
  mensaje: string = '';
  error: string = '';

  nuevoProducto = {
    titulo: '',
    descripcion: '',
    isbn: '',
    precio: null,
    stock: 0,
    pre_reserva: 0,
    imagen: '',
    fecha_publicacion: '',
    id_editorial: null
  };

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.adminService.getProducts().subscribe({
      next: (data: any) => {
        this.productos = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.error = 'Error al cargar los productos'
      }
    });
  }

  verProducto(productId: number) {
    this.adminService.getProductById(productId).subscribe({
      next: (data: any) => {
        this.productoSeleccionado = data;
        this.modoEdicion = false;
        this.modoCreacion = false;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar el producto'
    });
  }

  editarProducto(productId: number) {
    this.adminService.getProductById(productId).subscribe({
      next: (data: any) => {
        this.productoSeleccionado = { ...data };
        this.modoEdicion = true;
        this.modoCreacion = false;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar el producto'
    });
  }

  guardarProducto() {
    this.adminService.updateProduct(this.productoSeleccionado.id, this.productoSeleccionado).subscribe({
      next: () => {
        this.mensaje = 'Producto actualizado correctamente';
        this.modoEdicion = false;
        this.productoSeleccionado = null;
        this.cargarProductos();
      },
      error: () => this.error = 'Error al actualizar el producto'
    });
  }

  mostrarFormularioCreacion() {
    this.modoCreacion = true;
    this.modoEdicion = false;
    this.productoSeleccionado = null;
    this.mensaje = '';
    this.error = '';
  }

  crearProducto() {
    this.adminService.createProduct(this.nuevoProducto).subscribe({
      next: () => {
        this.mensaje = 'Producto creado correctamente';
        this.modoCreacion = false;
        this.nuevoProducto = {
          titulo: '', descripcion: '', isbn: '', precio: null,
          stock: 0, pre_reserva: 0, imagen: '', fecha_publicacion: '', id_editorial: null
        };
        this.cargarProductos();
      },
      error: () => this.error = 'Error al crear el producto'
    });
  }

  eliminarProducto(productId: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          this.mensaje = 'Producto eliminado correctamente';
          this.productoSeleccionado = null;
          this.cargarProductos();
        },
        error: (err: any) => this.error = err.error?.message || 'Error al eliminar el producto'
      });
    }
  }

  cerrar() {
    this.productoSeleccionado = null;
    this.modoEdicion = false;
    this.modoCreacion = false;
    this.mensaje = '';
    this.error = '';
  }
}