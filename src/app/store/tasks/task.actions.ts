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

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: number }>()
);

export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ id: number }>()
);

export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: any }>()
);

export const updateTask = createAction('[Task] Update Task', props<{ id: number, title: string, description: string }>());
export const updateTaskSuccess = createAction('[Task] Update Task Success', props<{ task: any }>());
export const updateTaskFailure = createAction('[Task] Update Task Failure', props<{ error: string }>());
