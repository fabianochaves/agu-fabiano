// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routes'; // Certifique-se de que você tenha este arquivo com as rotas

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Adicione outros providers necessários aqui
  ]
};
