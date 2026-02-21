import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
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
