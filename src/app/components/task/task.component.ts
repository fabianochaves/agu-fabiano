import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { TaskState } from '../../store/tasks/task.reducer';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  tasks$: Observable<any[]>; // Substitua `any` pelo tipo real das suas tarefas
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store<TaskState>) {
    this.tasks$ = this.store.select(state => state.tasks);
    this.loading$ = this.store.select(state => state.loading);
    this.error$ = this.store.select(state => state.error);
    
  }
  
}
