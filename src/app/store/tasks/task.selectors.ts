import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.reducer';

// Seleciona o estado de tarefas
export const selectTaskState = createFeatureSelector<TaskState>('tasks'); // Corrija a chave para 'tasks'

// Seleciona todas as tarefas
export const selectTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);

// Seleciona o estado de carregamento
export const selectTasksLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.loading
);

// Seleciona o erro
export const selectTasksError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error
);
