import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map(response => AuthActions.loginSuccess({ token: response.token })),
          catchError((error) => {
            const errorMessage = error.error?.error || 'Unknown error';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
