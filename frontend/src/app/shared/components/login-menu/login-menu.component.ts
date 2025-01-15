import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { AuthService } from '../../../auth/services/auth.service';
import { User as FirebaseUser } from 'firebase/auth';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-menu',
  imports: [
    RouterModule,
    RouterLink,
    Menubar,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    Ripple,
    CommonModule,
  ],
  templateUrl: './login-menu.component.html',
  styles: ``,
})
export class LoginMenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  currentUser: FirebaseUser | null = this.authService.userLogged();

  ngOnInit() {
    this.authService.userProfile$.subscribe((profile) => {
      if (profile) {
        this.items = [
          {
            label: 'Home',
            icon: 'pi pi-home',
            routerLink: '/dashboard',
          },
          {
            label: 'Suscripcion',
            icon: 'pi pi-money-bill',
          },
          {
            label: 'Stats',
            icon: 'pi pi-chart-bar',
            disabled: this.authService.userPlan?.name === 'free',
            replaceUrl: true,
            routerLink: '/stats',
          },
          {
            label: 'Admin Panel',
            icon: 'pi pi-cog',
            routerLink: '/admin',
            visible: this.authService.isAdmin,
          },
        ];
      }
    });

    const darkMode = localStorage.getItem('dark-mode');
    if (darkMode) this.toogleDarkMode();
  }

  toogleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark-mode');

    if (element?.classList.contains('dark-mode')) {
      localStorage.setItem('dark-mode', 'true');
    } else {
      localStorage.removeItem('dark-mode');
    }

    document.querySelector('#darkMode')?.classList.remove('pi-moon');
    document.querySelector('#darkMode')?.classList.add('pi-sun');
  }

  isDarkMode = () =>
    document.querySelector('html')?.classList.contains('dark-mode');
  getIconMode() {
    return this.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon';
  }

  async signOut() {
    await this.authService.signOut();
    this.router.navigate(['/']);
  }
}
