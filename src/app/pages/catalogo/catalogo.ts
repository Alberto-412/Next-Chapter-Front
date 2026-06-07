import { Component, inject, signal } from '@angular/core';

import { LibrosService } from '../../core/services/libros';
import { Libro } from '../../core/models/libro';
import { FiltroLibros } from '../../core/models/filtro_libros';

import { FiltrosCatalogo } from '../../component/filtrosCatalogo/filtrosCatalogo';
import { LibroCard } from '../../component/libroCard/libroCard';

@Component({
  selector: 'app-catalogo',
  imports: [FiltrosCatalogo, LibroCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  /**
   * conecta Angular con el back de libros.
   */
  private readonly librosService = inject(LibrosService);

  /**
   * Aquí guardas los libros que vienen de la API.
   */
  libros = signal<Libro[]>([]);

  /**
   * Controla si estamos esperando respuesta del back.
   */
  cargando = signal(true);

  error = signal('');

  /**
   * Al entrar en la página cargamos todos los libros,
   * sin aplicar filtros.
   */
  async ngOnInit() {
    await this.cargarLibros();
  }

  /**
   * cargarLibros(filtros?)
   *
   * Llama al servicio getAll().
   *
   * Si no recibe filtros:
   * GET /api/libros
   *
   * Si recibe filtros:
   * GET /api/libros?categoria=1&precioMin=10&precioMax=30
   */
  async cargarLibros(filtros?: FiltroLibros) {
    try {
      this.cargando.set(true);
      this.error.set('');

      const response = await this.librosService.getAll(filtros);

      this.libros.set(response.data);
    } catch (error) {
      console.error(error);
      this.error.set('No se pudieron cargar los libros.');
    } finally {
      this.cargando.set(false);
    }
  }

  /**
   * aplicarFiltros()
   *
   * Este método recibe los filtros emitidos
   * desde el componente hijo FiltrosCatalogo.
   *
   * Flujo:
   * FiltrosCatalogo → filtrosChange → Catalogo → LibrosService
   */
  async aplicarFiltros(filtros: FiltroLibros) {
    await this.cargarLibros(filtros);
  }
}
