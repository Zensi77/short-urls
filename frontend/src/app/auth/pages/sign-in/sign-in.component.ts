import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GoogleButtonComponent } from '../../ui/google-button/google-button.component';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { message } from '../../utils/validators';
import { CommonModule } from '@angular/common';

interface User {
  email: string;
  password: string;
}

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GoogleButtonComponent,
    RouterLink,
  ],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export default class SignInComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  error(field: string) {
    return message(field)(this.loginForm);
  }

  async submitWithGoogle() {
    await this._authService.submitWithGoogle();
    this._router.navigateByUrl('/dashboard');
  }

  async submit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    try {
      this._authService.signIn({ email, password } as User);
      this._router.navigateByUrl('/dashboard');
    } catch (error) {
      console.error(error);
    }
  }
}
