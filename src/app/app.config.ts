import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    //Para implementar las rutas en el archivo de rutas
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: 'light'
        }
      }
    })
  ]
};
