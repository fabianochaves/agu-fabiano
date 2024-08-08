import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { login, loginSuccess, loginFailure, register, registerSuccess, registerFailure } from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    mergeMap(action => this.authService.login(action.username, action.password).pipe(
      map(response => loginSuccess({ token: response.token })),
      catchError(error => {
        const errorMessage = error.error?.error || 'An unknown error occurred';
        return of(loginFailure({ error: errorMessage }));
      })
    ))
  ));

  loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(loginSuccess),
    tap(action => {
      localStorage.setItem('token', action.token);
      this.router.navigate(['/tasks']);
    })
  ), { dispatch: false });

  loginFailure$ = createEffect(() => this.actions$.pipe(
    ofType(loginFailure),
    tap(action => {
      Swal.fire({
        title: 'Login Failed',
        text: action.error || 'An error occurred',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    })
  ), { dispatch: false });

  register$ = createEffect(() => this.actions$.pipe(
    ofType(register),
    mergeMap(action => this.authService.register(action.username, action.password).pipe(
      map(() => registerSuccess()),
      catchError(error => of(registerFailure({ error: error.error?.error || 'An unknown error occurred' })))
    ))
  ));

  registerSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(registerSuccess),
    tap(() => {
      Swal.fire({
        title: 'Registration Successful',
        text: 'You can now log in with your credentials.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    })
  ), { dispatch: false });

  registerFailure$ = createEffect(() => this.actions$.pipe(
    ofType(registerFailure),
    tap(action => {
      Swal.fire({
        title: 'Registration Failed',
        text: action.error || 'An error occurred',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    })
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
