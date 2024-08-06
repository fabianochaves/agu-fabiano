import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskService } from '../../services/task.service';
import { loadTasks, loadTasksSuccess, loadTasksFailure, addTask, addTaskSuccess, addTaskFailure } from './task.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TaskEffects {

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      mergeMap(() =>
        this.taskService.getTasks().pipe(
          map(tasks => loadTasksSuccess({ tasks })),
          catchError(error => of(loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTask),
      switchMap(action =>
        this.taskService.addTask({
          title: action.title,
          description: action.description,
          user_id: action.userId
        }).pipe(
          map(task => addTaskSuccess({ task })),
          catchError(error => of(addTaskFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private taskService: TaskService
  ) {}
}
