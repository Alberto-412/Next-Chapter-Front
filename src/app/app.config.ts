// ============================================================
// QUÉ HACE: Configura los proveedores globales de la aplicación.
//           Es el punto de arranque donde Angular registra
//           los servicios esenciales que necesita toda la app.
// ============================================================

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [

    // Captura errores globales del navegador y los muestra en consola.
    provideBrowserGlobalErrorListeners(),

    // Registra el sistema de rutas con la configuración de app.routes.ts.
    // Sin esto, Angular no sabría qué componente mostrar en cada URL.
    provideRouter(routes),

    // Activa HttpClient en toda la aplicación.
    // Sin esto, los servicios no pueden hacer peticiones HTTP.
    // Todos los inject(HttpClient) del proyecto dependen de esta línea.
    provideHttpClient(),
  ],
};