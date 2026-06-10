import { Component, input } from '@angular/core';

import { Libro } from '../../core/models/libro';

@Component({
  selector: 'app-libro-card',
  templateUrl: './libroCard.html',
  styleUrl: './libroCard.css',
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
}
