import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { selectAuthToken } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';
import { Router } from '@angular/router';
import { Store as NgRxStore } from '@ngrx/store';
import { selectTasksLoading, selectTasksError } from '../../store/tasks/task.selectors';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isAuthenticated$: Observable<boolean> | undefined;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store,
    private router: Router,
    private ngRxStore: NgRxStore
  ) {
    this.loading$ = this.ngRxStore.select(selectTasksLoading);
    this.error$ = this.ngRxStore.select(selectTasksError);
  }

  ngOnInit() {
    this.isAuthenticated$ = this.store.select(selectAuthToken).pipe(
      map((token: string | null) => !!token)
    );
  }

  
  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
