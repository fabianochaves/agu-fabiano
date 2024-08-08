import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import { login, register } from '../../store/auth/auth.actions';
import { selectAuthError, selectAuthToken, selectAuthLoading  } from '../../store/auth/auth.selectors';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { map, switchMap, take, takeWhile  } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error$: Observable<string | null>;
  showError: boolean = false;
  isLoading: boolean = false;

  constructor(private store: Store, private router: Router) {
    this.error$ = this.store.select(selectAuthError);
    this.error$.subscribe(error => {
      if (error) {
        this.showError = true;
        this.isLoading = false;
        timer(5000).subscribe(() => this.showError = false);
      }
    });
  }

  login() {
    this.isLoading = true;
    this.store.dispatch(login({ username: this.username, password: this.password }));

    this.store.select(selectAuthToken).subscribe(token => {
      if (token) {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      }
    });
  }

  openRegisterModal() {
    let registrationCompleted = false;

    Swal.fire({
      title: 'Register',
      html: `
        <input id="username_register" name="username_register" class="swal2-input" placeholder="Username" autocomplete="off">
        <input id="password_register" name="password_register" class="swal2-input" type="password" placeholder="Password" autocomplete="off">
      `,
      showCancelButton: true,
      confirmButtonText: 'Register',
      preConfirm: () => {
        const username = (document.getElementById('username_register') as HTMLInputElement).value.trim();
        const password = (document.getElementById('password_register') as HTMLInputElement).value.trim();

        if (!username || !password) {
          Swal.showValidationMessage('Both Username and Password are required');
          return false;
        }

        // Temporarily close the registration modal to show loading modal
        Swal.close();

        // Show loading modal
        Swal.fire({
          title: 'Registering...',
          text: 'Please wait while we process your registration.',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        return { username, password };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { username, password } = result.value;

        // Dispatch register action
        this.store.dispatch(register({ username, password }));

        // Observe the registration result
        this.store.select(selectAuthLoading).pipe(
          switchMap(loading => {
            if (loading) {
              return this.store.select(selectAuthError).pipe(take(1));
            }
            return [];
          })
        ).subscribe(error => {
          Swal.close();

          if (error) {
            Swal.fire('Registration Failed', error, 'error');
          } else {
            if (!registrationCompleted) {
              registrationCompleted = true;
              Swal.fire('Registration Successful', 'You can now log in.', 'success');
            }
          }
        });
      }
    });
  }
  
  
  clearError() {
    this.showError = false;
  }
}
