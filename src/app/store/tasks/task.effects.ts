import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskService } from '../../services/task.service';
import { loadTasks, loadTasksSuccess, loadTasksFailure } from './task.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() => this.actions$.pipe(
    ofType(loadTasks),
    mergeMap(() => this.taskService.getTasks().pipe(
      map(tasks => loadTasksSuccess({ tasks })),
      catchError(error => of(loadTasksFailure({ error: error.message })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private taskService: TaskService
  ) {}
}
