import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Libro } from '../../core/models/libro';

@Component({
  selector: 'app-libro-card',
  templateUrl: './libroCard.html',
  styleUrl: './libroCard.css',
  imports: [RouterLink],
})
export class LibroCard {
  /**
   * input()
   *
   * Recibe un libro desde el componente padre.
   *
   * En este caso:
   * Catalogo → LibroCard
   */
  libro = input.required<Libro>();

  /**
   * getEstrellas()
   *
   * Convierte un número de valoración en estrellas.
   *
   * Ejemplo:
   * 4.8 → ★★★★★
   * 3.2 → ★★★☆☆
   */
  /**
   * Convierte la valoración del backend en estrellas.
   */
  getEstrellas(rating?: string | null): string {
    const numeroRating = Number(rating ?? 0);

    const estrellasLlenas = Math.round(numeroRating);
    const estrellasVacias = 5 - estrellasLlenas;

    return '★'.repeat(estrellasLlenas) + '☆'.repeat(estrellasVacias);
  }
}
