import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CategoriasResponse } from '../models/categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  /**
   * HttpClient permite hacer peticiones HTTP al backend.
   */
  private readonly httpClient = inject(HttpClient);

  //// apiUrl TIWENES QUE CVAMBIAR
  private readonly baseUrl = 'http://localhost:10200/api/categorias';

  /**
   * getAll()
   *
   * Pide todas las categorías al back.
   *
   * GET /api/categorias
   */
  getAll() {
    return firstValueFrom(this.httpClient.get<CategoriasResponse>(this.baseUrl));
  }
}
