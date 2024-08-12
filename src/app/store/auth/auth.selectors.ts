// src/app/store/auth/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading // Ajuste a propriedade conforme o nome do estado de carregamento
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
