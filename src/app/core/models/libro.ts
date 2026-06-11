export interface Libro {
  id: number;
  titulo: string;
  descripcion: string;
  isbn: string;
  precio: string;
  stock: number;
  pre_reserva: number;
  imagen: string;
  fecha_publicacion: string;

  editorial: string;

  id_editorial?: number;

  categorias?: string | null;
  autores?: string | null;

  rating?: string | null;
  total_resenas?: number;
}

/**
 * Respuesta del back al pedir libros.
 *
 * Nuestro endpoint GET /api/libros devuelve:
 * {
 *   mensaje: "Libros encontrados",
 *   data: [...]
 * }
 */
export interface LibrosResponse {
  mensaje: string;
  data: Libro[];
}

/**
 * Respuesta del endpoint:
 *
 * GET /api/libros/:id
 */
export interface LibroResponse {
  mensaje: string;
  data: Libro;
}
