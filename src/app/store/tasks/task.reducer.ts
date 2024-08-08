import { createReducer, on, Action } from '@ngrx/store';
import { loadTasks, loadTasksSuccess, loadTasksFailure, addTask, addTaskSuccess, addTaskFailure, deleteTask, deleteTaskSuccess, deleteTaskFailure, updateTask, updateTaskSuccess, updateTaskFailure } from './task.actions';

export interface TaskState {
  tasks: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null
};

const _taskReducer = createReducer(
  initialState,
  on(loadTasks, (state) => ({ ...state, loading: true, error: null })),
  on(loadTasksSuccess, (state, { tasks }) => ({ ...state, loading: false, tasks })),
  on(loadTasksFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Handling addTask actions
  on(addTask, (state) => ({ ...state, loading: true, error: null })),
  on(addTaskSuccess, (state, { task }) => ({ 
    ...state, 
    loading: false, 
    tasks: [...state.tasks, task] // Adiciona a nova tarefa à lista de tarefas
  })),
  on(addTaskFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(deleteTask, state => ({
    ...state,
    loading: true
  })),
  on(deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== id),
    loading: false,
    error: null
  })),
  on(deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),
  on(updateTask, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => (t.id === task.id ? task : t)),
    loading: false,
  })),
  on(updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export function taskReducer(state: TaskState | undefined, action: Action) {
  return _taskReducer(state, action);
}
