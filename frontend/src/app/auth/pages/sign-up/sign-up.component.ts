import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isFieldEquals, message } from '../../utils/validators';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

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
    console.log('Form submitted');
  }
}
