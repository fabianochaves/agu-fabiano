import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { selectAuthToken } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Store as NgRxStore } from '@ngrx/store';
import { addTask, loadTasks } from '../../store/tasks/task.actions';
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

  openAddTaskModal() {
    
    let taskAdded = false;
    Swal.fire({
      title: 'Add Task',
      html: `
        <input id="title" class="swal2-input" placeholder="Title">
        <textarea id="description" class="swal2-textarea" placeholder="Description"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Add Task',
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
  
        // Mostrar modal de carregamento
        Swal.fire({
          title: 'Adding Task...',
          text: 'Please wait while we add your task.',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading(); // Mostrar o ícone de carregamento
          }
        });
  
        // Disparar a ação NgRx para adicionar a tarefa
        this.ngRxStore.dispatch(addTask({ title: taskData.title, description: taskData.description, userId }));
  
        // Esperar até que a adição da tarefa seja concluída e verificar o erro
        this.ngRxStore.select(selectTasksLoading).pipe(
          switchMap(loading => {
            if (!loading) {
              return this.ngRxStore.select(selectTasksError).pipe(take(1)); // Subscrição única
            }
            return [];
          })
        ).subscribe(error => {
          Swal.close(); // Fechar o modal de carregamento
          if (error) {
            Swal.fire('Error', 'Failed to add task', 'error');
          } else {

            if (!taskAdded) {
              taskAdded = true;
              Swal.fire('Success', 'Task added successfully!', 'success').then(() => {
                this.ngRxStore.dispatch(loadTasks());
              });
            }
            
          }
        });
      }
    });
  }
  
  
  
  logout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
