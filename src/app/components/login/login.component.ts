import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import { login } from '../../store/auth/auth.actions';
import { selectAuthError, selectAuthToken } from '../../store/auth/auth.selectors';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
        console.log("Quase rota" + token)
        this.router.navigate(['/tasks']);
      }
    });
  }

  clearError() {
    this.showError = false;
  }
}
