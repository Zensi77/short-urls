import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isFieldEquals, message } from '../../utils/validators';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    PasswordModule,
    FloatLabelModule,
  ],
  templateUrl: './sign-up.component.html',
  styles: `
    ::ng-deep .p-password {
      width: 100% !important;
    }

    ::ng-deep .p-password input {
      width: 100% !important;
      max-width: 100% !important;
    }
  `,
})
export default class SignUpComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  readonly registerForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [{ value: '', disabled: true }, [Validators.required]],
    },
    { validators: isFieldEquals('password', 'confirmPassword') }
  );

  error(field: string) {
    return message(field)(this.registerForm);
  }

  disableCheckPassword() {
    const valid = this.registerForm.get('password')?.valid;
    return !valid;
  }

  onSubmit() {
    if (!this.registerForm.valid) return this.registerForm.markAllAsTouched();

    const email = this.registerForm.get('email')?.value as string;
    const password = this.registerForm.get('password')?.value as string;
    this._authService.signUp({ email, password }).then(() => {
      Swal.fire({
        icon: 'success',
        title: '',
        text: `Usuario creado con éxito`,
      });
      this._router.navigate(['/dashboard']);
    });
  }
}
