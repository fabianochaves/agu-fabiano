import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        const token = response.token;
        this.authService.storeToken(token);
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err);
      }
    });
  }
}
