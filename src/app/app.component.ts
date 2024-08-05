import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavModule } from './components/nav/nav.module'; // Importa o módulo de navegação

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
