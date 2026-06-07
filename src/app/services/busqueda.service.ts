import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BusquedaService {
  termino = signal('');

  buscar(termino: string) {
    this.termino.set(termino.toLowerCase().trim());
  }

  limpiar() {
    this.termino.set('');
  }
}