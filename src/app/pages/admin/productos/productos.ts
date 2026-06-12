import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { BusquedaService } from '../../../services/busqueda.service';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {

  private adminService = inject(AdminService);
  private busquedaService = inject(BusquedaService);

  // ============ ESTADO REACTIVO ============
  productos = signal<any[]>([]);
  modoEdicion = signal(false);
  modoCreacion = signal(false);
  mensaje = signal('');
  error = signal('');
  isLoading = signal(false);
  
  // ============ PAGINACIÓN ============
  paginaActual = signal(1);
  itemsPorPagina = 8;

  // ============ VALORES DERIVADOS ============
  editoriales = computed(() => {
    const eds = new Set<string>();
    this.productos().forEach(p => {
      if (p.editorial) eds.add(p.editorial);
    });
    return Array.from(eds)
      .map(nombre => ({ nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });
  
  categorias = computed(() => {
    const cats = new Set<string>();
    this.productos().forEach(p => {
      if (p.categorias) {
        p.categorias.split(',').forEach((c: string) => cats.add(c.trim()));
      }
    });
    return Array.from(cats)
      .map(nombre => ({ nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  // ============ PAGINACIÓN COMPUTED ============
  productosEnPagina = computed(() => {
    const productos = this.productos();
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return productos.slice(inicio, fin);
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.productos().length / this.itemsPorPagina);
  });

  // Crear array de números para la paginación
  paginasArray = computed(() => {
    return Array.from({ length: this.totalPaginas() }, (_, i) => i + 1);
  });


  // ============ FORMULARIOS REACTIVOS ============
  formularioCreacion = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    isbn: new FormControl(''),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    pre_reserva: new FormControl(0),
    imagen: new FormControl(''),
    fecha_publicacion: new FormControl(''),
    editorial: new FormControl(''),
    categorias: new FormControl('')
  });

  formularioEdicion = new FormGroup({
    id: new FormControl<number | null>(null),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    isbn: new FormControl(''),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    pre_reserva: new FormControl(0),
    imagen: new FormControl(''),
    fecha_publicacion: new FormControl(''),
    editorial: new FormControl(''),
    categorias: new FormControl('')
  });

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.isLoading.set(true);
    this.adminService.getProducts().subscribe({
      next: (data: any) => {
        this.productos.set(data);
        this.paginaActual.set(1); // Resetear a página 1 al cargar
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los productos');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  paginaAnterior() {
    if (this.paginaActual() > 1) {
      this.paginaActual.update(p => p - 1);
    }
  }

  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) {
      this.paginaActual.update(p => p + 1);
    }
  }

  mostrarFormularioCreacion() {
    this.modoCreacion.set(true);
    this.modoEdicion.set(false);
    this.formularioCreacion.reset();
    this.mensaje.set('');
    this.error.set('');
  }

  crearProducto() {
    if (this.formularioCreacion.invalid) {
      this.error.set('Por favor completa los campos obligatorios');
      return;
    }

    this.isLoading.set(true);
    this.adminService.createProduct(this.formularioCreacion.value).subscribe({
      next: () => {
        this.mensaje.set('Producto creado correctamente');
        this.modoCreacion.set(false);
        this.formularioCreacion.reset();
        this.cargarProductos();
      },
      error: (err) => {
        this.error.set('Error al crear el producto');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  editarProducto(productId: number) {
    this.isLoading.set(true);
    this.adminService.getProductById(productId).subscribe({
      next: (data: any) => {
        if (data.fecha_publicacion) {
          const fecha = new Date(data.fecha_publicacion);
          const year = fecha.getFullYear();
          const month = String(fecha.getMonth() + 1).padStart(2, '0');
          const day = String(fecha.getDate()).padStart(2, '0');
          data.fecha_publicacion = `${year}-${month}-${day}`;
        }
        this.formularioEdicion.patchValue(data);
        this.modoEdicion.set(true);
        this.modoCreacion.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el producto');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  guardarProducto() {
    if (this.formularioEdicion.invalid) {
      this.error.set('Por favor completa los campos obligatorios');
      return;
    }

    const productId = this.formularioEdicion.get('id')?.value;
    if (!productId || typeof productId !== 'number') {
      this.error.set('Error: ID del producto inválido');
      return;
    }

    this.isLoading.set(true);
    
    this.adminService.updateProduct(productId, this.formularioEdicion.value).subscribe({
      next: () => {
        this.mensaje.set('Producto actualizado correctamente');
        this.modoEdicion.set(false);
        this.formularioEdicion.reset();
        this.cargarProductos();
      },
      error: (err) => {
        this.error.set('Error al actualizar el producto');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  eliminarProducto(productId: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    this.isLoading.set(true);
    this.adminService.deleteProduct(productId).subscribe({
      next: () => {
        this.mensaje.set('Producto eliminado correctamente');
        this.cargarProductos();
      },
      error: (err) => {
        this.error.set('Error al eliminar el producto');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  cerrar() {
    this.modoEdicion.set(false);
    this.modoCreacion.set(false);
    this.formularioCreacion.reset();
    this.formularioEdicion.reset();
    this.mensaje.set('');
    this.error.set('');
  }
}