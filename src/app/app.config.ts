import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    /**
     * Esto activa HttpClient en toda la aplicación.
     * Sin esto, los servicios no podrán hacer peticiones HTTP.
     */
    provideHttpClient(),
  ],
};
