import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Link } from '../interfaces/link.interface';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

import { ValidatorService } from '../utils/validator.service';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-link-form',
  templateUrl: 'link-form.component.html',
  imports: [
    CommonModule,
    InputTextModule,
    MessageModule,
    ButtonModule,
    TextareaModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class NameComponent implements OnChanges {
  private fb = inject(NonNullableFormBuilder);
  private _validatorService = inject(ValidatorService);
  private _authService = inject(AuthService);

  plan = this._authService.userPlan;

  @Input() linkData: Link | null = null;
  @Input() event: 'edit' | 'create' | null = null;
  @Output() saved = new EventEmitter<any>();

  readonly linkForm = this.fb.group({
    name: ['', [Validators.required]],
    shortUrl: [
      '',
      [Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0-9]{1,10}$/i)],
      this._validatorService.validateUrlPersonality(),
    ],
    url: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(https?|ftp|file|mailto|data):\/\/[^\s/$.?#].[^\s]*$/i
        ),
      ],
    ],
    description: ['', [Validators.maxLength(60)]],
  });

  onSaved() {
    if (this.linkForm.invalid) {
      this.linkForm.markAllAsTouched();
      return;
    }
    this.saved.emit(this.linkForm.value);
    this.linkForm.reset();
    this.event = null;
  }

  onCancel() {
    this.event = null;
    this.linkForm.reset();
  }

  ngOnChanges() {
    if (this.linkData) {
      this.linkForm.patchValue(this.linkData);
    } else {
      this.linkForm.reset();
    }
  }
}
