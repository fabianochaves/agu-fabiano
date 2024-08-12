// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './app/store/auth/auth.reducer';
import { AuthEffects } from './app/store/auth/auth.effects';
import { taskReducer } from './app/store/tasks/task.reducer';
import { TaskEffects } from './app/store/tasks/task.effects';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NavModule } from './app/components/nav/nav.module';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideHttpClient(),
    provideStore({ auth: authReducer, tasks: taskReducer }),
    provideEffects([AuthEffects, TaskEffects]),
    provideStoreDevtools({ maxAge: 25 }) // Remove `logOnly` and other options if you don't have `environment`
  ]
})
.catch((err) => console.error(err));
