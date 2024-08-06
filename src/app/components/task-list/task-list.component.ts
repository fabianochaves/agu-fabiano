import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadTasks, deleteTask } from '../../store/tasks/task.actions';
import { selectTasks, selectTasksLoading, selectTasksError } from '../../store/tasks/task.selectors';
import Swal from 'sweetalert2';
import { TaskState } from '../../store/tasks/task.reducer'; // Ajuste o caminho conforme necessário
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<any[]>; // Substitua `any` pelo tipo real das suas tarefas
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  private taskDeleted = false; // Flag para controle de exclusão

  constructor(private store: Store<TaskState>) {
    this.tasks$ = this.store.select(selectTasks);
    this.loading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);
    
  }

  ngOnInit(): void {
    this.store.dispatch(loadTasks());
  }



  openDeleteConfirmation(taskId: number) {

    this.taskDeleted = false;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTask(taskId);
      }
    });
  }

  deleteTask(taskId: number) {
    Swal.fire({
      title: 'Deleting Task...',
      text: 'Please wait while we delete your task.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); // Mostrar o ícone de carregamento
      }
    });

    // Disparar a ação NgRx para deletar a tarefa
    this.store.dispatch(deleteTask({ id: taskId }));

    // Esperar até que a exclusão da tarefa seja concluída e verificar o erro
    this.store.select(selectTasksLoading).pipe(
      switchMap(loading => {
        if (!loading) {
          return this.store.select(selectTasksError).pipe(take(1)); // Subscrição única
        }
        return [];
      })
    ).subscribe(error => {
      Swal.close(); // Fechar o modal de carregamento
      if (error) {
        Swal.fire('Error', 'Failed to delete task', 'error');
      } else {
       
        if (!this.taskDeleted) {
          this.taskDeleted = true;
    
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success').then(() => {
            this.store.dispatch(loadTasks()); // Recarregar a lista de tarefas
          });

        }
      }
    });
  }
}
