import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './shared/components/menu-component/menu-component.component';
import { AuthService } from './auth/services/auth.service';
import { LoginMenuComponent } from './shared/components/login-menu/login-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterModule, MenuComponent, LoginMenuComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Short URLs';

  private readonly _authService = inject(AuthService);
  currentUser$;
  constructor() {
    this.currentUser$ = this._authService.currentUser$;
  }
}
