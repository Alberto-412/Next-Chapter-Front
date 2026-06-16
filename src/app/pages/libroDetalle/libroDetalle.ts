import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Libro } from '../../core/models/libro';
import { LibrosService } from '../../core/services/libros';

import { Resena } from '../../core/models/resena';
import { ResenasService } from '../../core/services/resenas';
import { ResenasLibro } from '../../component/resenasLibro/resenasLibro';
import { Cart as CartService } from '../../services/cart';
@Component({
  selector: 'app-libro-detalle',
  templateUrl: './libroDetalle.html',
  styleUrl: './libroDetalle.css',
  imports: [DatePipe, RouterLink, ResenasLibro],
})
export class LibroDetalle {

  private readonly cartService = inject(CartService);
  /**
   * ActivatedRoute nos permite leer datos de la URL.
   *
   * Ejemplo:
   * /libros/1
   *
   * De ahí sacamos el id del libro.
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Servicio que conecta Angular con el backend de libros.
   *
   * Lo usamos para pedir:
   * GET /api/libros/:id
   */
  private readonly librosService = inject(LibrosService);

  /**
   * Servicio que conecta Angular con el backend de reseñas.
   *
   * Lo usamos para pedir:
   * GET /api/libros/:id/resenas
   */
  private readonly resenasService = inject(ResenasService);

  /**
   * Aquí guardamos el libro recibido desde el backend.
   *
   * Empieza en null porque al cargar la página
   * todavía no hemos recibido ningún libro.
   */
  libro = signal<Libro | null>(null);

  /**
   * Aquí guardamos las reseñas del libro.
   *
   * Empieza como array vacío porque puede que:
   * - todavía no hayan llegado del backend
   * - o el libro no tenga reseñas
   */
  resenas = signal<Resena[]>([]);

  /**
   * Controla si la página está cargando.
   *
   * Mientras sea true podemos mostrar
   * un mensaje tipo "Cargando libro...".
   */
  cargando = signal(true);

  /**
   * Guarda un mensaje si algo falla.
   *
   * Por ejemplo:
   * - id no válido
   * - error al llamar al backend
   */
  error = signal('');

  /**
   * ngOnInit()
   *
   * Se ejecuta al cargar esta página.
   *
   * Aquí:
   * 1. Leemos el id de la URL.
   * 2. Validamos que sea correcto.
   * 3. Cargamos el libro.
   * 4. Cargamos sus reseñas.
   */
  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('El libro solicitado no es válido.');
      this.cargando.set(false);
      return;
    }

    await this.cargarDetalle(id)
  }
  agregarAlCarrito(libro: Libro) {
  this.cartService.agregarItem(libro);
}

  /**
   * cargarDetalle(id)
   *
   * Carga todo lo necesario para esta página:
   * - Detalle del libro.
   * - Reseñas del libro.
   *
   * Usamos Promise.all para lanzar las dos peticiones
   * a la vez y no esperar una detrás de otra.
   */
  async cargarDetalle(id: number) {
    try {
      this.cargando.set(true);
      this.error.set('');

      const [libroResponse, resenasResponse] = await Promise.all([
        this.librosService.getById(id),
        this.resenasService.getByLibroId(id),
      ]);

      this.libro.set(libroResponse.data);
      this.resenas.set(resenasResponse.data);
    } catch (error) {
      console.error(error);
      this.error.set('No se pudo cargar el detalle del libro.');
    } finally {
      this.cargando.set(false);
    }
  }
}
