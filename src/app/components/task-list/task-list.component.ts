import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { addTask, loadTasks, deleteTask, updateTask } from '../../store/tasks/task.actions';
import { selectTasks, selectTasksLoading, selectTasksError } from '../../store/tasks/task.selectors';
import Swal from 'sweetalert2';
import { TaskState } from '../../store/tasks/task.reducer'; // Ajuste o caminho conforme necessário
import { map, switchMap, take } from 'rxjs/operators';


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

    
  openTaskModal(task?: any) {
    let taskAddedOrUpdated = false;
    const isEdit = !!task;
  
    Swal.fire({
      title: isEdit ? 'Edit Task' : 'Add Task',
      html: `
        <input id="title" class="swal2-input" placeholder="Title" value="${task?.title || ''}">
        <textarea id="description" class="swal2-textarea" placeholder="Description">${task?.description || ''}</textarea>
      `,
      showCancelButton: true,
      confirmButtonText: isEdit ? 'Update Task' : 'Add Task',
      preConfirm: () => {
        const title = (document.getElementById('title') as HTMLInputElement).value.trim();
        const description = (document.getElementById('description') as HTMLTextAreaElement).value.trim();
  
        if (!title || !description) {
          Swal.showValidationMessage('Both Title and Description are required');
          return false;
        }
  
        return { title, description };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const taskData = result.value;
        const userId = Number(localStorage.getItem('userId'));
  
        Swal.fire({
          title: isEdit ? 'Updating Task...' : 'Adding Task...',
          text: 'Please wait while we process your task.',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
  
        if (isEdit) {
          this.store.dispatch(updateTask({ id: task.id, title: taskData.title, description: taskData.description }));
        } else {
          this.store.dispatch(addTask({ title: taskData.title, description: taskData.description, userId }));
        }
  
        this.store.select(selectTasksLoading).pipe(
          switchMap(loading => {
            if (!loading) {
              return this.store.select(selectTasksError).pipe(take(1));
            }
            return [];
          })
        ).subscribe(error => {
          Swal.close();
          if (error) {
            Swal.fire('Error', `Failed to ${isEdit ? 'update' : 'add'} task`, 'error');
          } else {
            if (!taskAddedOrUpdated) {
              taskAddedOrUpdated = true;
              Swal.fire('Success', `Task ${isEdit ? 'updated' : 'added'} successfully!`, 'success').then(() => {
                this.store.dispatch(loadTasks());
              });
            }
          }
        });
      }
    });
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
