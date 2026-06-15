import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes,

      /**
       * scrollPositionRestoration Esto hace que al cambiar de página Angular suba automáticamente al inicio.
       * anchorScrolling Esto hace que haga scroll hasta novedades
       */
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      }),
    ),

    /**
     * Esto activa HttpClient en toda la aplicación.
     */
    provideHttpClient(),
  ],
};
