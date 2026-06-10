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
  categorias: string | null;
  autores: string | null;
}

/**
 * Respuesta del backend al pedir libros.
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
