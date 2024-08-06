// src/app/store/tasks/task.actions.ts
import { createAction, props } from '@ngrx/store';

// Ações para carregar tarefas
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ tasks: any[] }>());
export const loadTasksFailure = createAction('[Task] Load Tasks Failure', props<{ error: string }>());

// Ações para adicionar tarefa
export const addTask = createAction(
  '[Task] Add Task',
  props<{ title: string; description: string; userId: number }>()
);
export const addTaskSuccess = createAction('[Task] Add Task Success', props<{ task: any }>());
export const addTaskFailure = createAction('[Task] Add Task Failure', props<{ error: string }>());
