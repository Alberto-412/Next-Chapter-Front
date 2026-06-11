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
   * Conecta Angular con el back de libros.
   */
  private readonly librosService = inject(LibrosService);

  /**
   * Aquí guardamos los libros que se muestran en pantalla.
   *
   * Este signal cambia cuando:
   * - Cargamos libros.
   * - Aplicamos filtros.
   * - Ordenamos por precio.
   */
  libros = signal<Libro[]>([]);

  /**
   * Guardamos una copia de los libros tal y como llegan del back.
   *
   * Sirve para volver al orden inicial cuando
   * el usuario selecciona "Novedades".
   */
  librosOriginales = signal<Libro[]>([]);

  /**
   * Controla si estamos esperando respuesta del back.
   */
  cargando = signal(true);

  /**
   * Guarda un mensaje si ocurre un error al cargar libros.
   */
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

      /**
       * Guardamos los libros originales y también
       * los libros que se pintan en pantalla.
       */
      this.librosOriginales.set(response.data);
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

  /**
   * ordenarLibros()
   *
   * Ordena los libros en el front.
   *
   * No llama al back porque ahora mismo
   * el backend no tiene query param de ordenación.
   *
   * Opciones:
   * - novedades: vuelve al orden original
   * - precio-menor: menor a mayor
   * - precio-mayor: mayor a menor
   */
  ordenarLibros(event: Event) {
    const select = event.target as HTMLSelectElement;
    const valor = select.value;

    /**
     * Creamos una copia del array actual.
     *
     * No ordenamos directamente this.libros()
     * porque queremos mantener el estado controlado
     * usando signals.
     */
    const librosOrdenados = [...this.libros()];

    if (valor === 'precio-menor') {
      librosOrdenados.sort((a, b) => Number(a.precio) - Number(b.precio));
      this.libros.set(librosOrdenados);
      return;
    }

    if (valor === 'precio-mayor') {
      librosOrdenados.sort((a, b) => Number(b.precio) - Number(a.precio));
      this.libros.set(librosOrdenados);
      return;
    }

    /**
     * Si selecciona "Novedades",
     * restauramos el orden original del back.
     */
    this.libros.set(this.librosOriginales());
  }
}
