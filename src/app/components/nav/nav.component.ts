import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectAuthToken } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isAuthenticated$: Observable<boolean> | undefined;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.isAuthenticated$ = this.store.select(selectAuthToken).pipe(
      map((token: string | null) => !!token) // Tipar o parâmetro token
    );
  }

  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}