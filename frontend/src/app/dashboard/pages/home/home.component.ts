import { Component, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';

import { DashboardService } from '../../services/dashboard.service';
import { Link } from '../../interfaces/link.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { ValidatorService } from '../../utils/validator.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    TableModule,
    ButtonModule,
    Dialog,
    TextareaModule,
    ReactiveFormsModule,
    MessageModule,
    ProgressSpinner,
    ToastModule,
    InputTextModule,
    ConfirmPopupModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class HomeComponent implements OnInit {
  private readonly _dashboardService = inject(DashboardService);
  private readonly _authService = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly _routes = inject(ActivatedRoute);
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);
  private readonly _validatorService = inject(ValidatorService);

  plan = this._authService.userPlan;

  readonly LinkForm = this.fb.group({
    name: ['', [Validators.required]],
    shortUrl: [
      '',
      [
        Validators.maxLength(10),
        Validators.pattern(
          /^(https?|ftp|file|mailto|data):\/\/[^\s/$.?#].[^\s]*$/i
        ),
      ],
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
    description: [''],
  });

  links = computed(() => this._dashboardService.links());
  filteredLinks: Link[] = [];
  filteredName: string[] = [];
  loading = true;

  ngOnInit(): void {
    const links = this._routes.snapshot.data['links'];
    this._dashboardService.links.set(links);
    this.loading = false;
  }

  constructor() {
    effect(() => {
      this.filteredLinks = this.links();
      this.filteredName = this.filteredLinks.map((link) => link.name);
    });
  }

  value: string | undefined;

  search(event: AutoCompleteCompleteEvent) {
    if (event.query === '') {
      this.filteredLinks = this.links();
      this.filteredName = this.filteredLinks.map((link) => link.name);
      return;
    }

    this.filteredLinks = [];
    this.filteredName = [];
    this.links().forEach((link) => {
      if (link.name.toLowerCase().includes(event.query.toLowerCase())) {
        this.filteredLinks.push(link);
        this.filteredName.push(link.name);
      }
    });
  }

  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim();

    // Si el input está vacío, se muestran todos los links
    if (value === '') {
      this.filteredLinks = this.links();
      this.filteredName = this.filteredLinks.map((link) => link.name);
    }
  }

  linkDialog = false;
  newLink() {
    if (this.limitLinks() || this.plan?.name === 'free') {
      this.LinkForm.get('shortUrl')?.disable();
      return;
    }
    this.linkDialog = !this.linkDialog;
    this.LinkForm.reset();
  }

  createLink() {
    if (this.LinkForm.invalid) {
      this.LinkForm.markAllAsTouched();
      return;
    }

    this._dashboardService.createLink({
      name: this.LinkForm.value.name,
      originalUrl: this.LinkForm.value.url,
      description: this.LinkForm.value.description,
    } as Link);

    this.linkDialog = !this.linkDialog;

    // Selecciona el contenedor donde se insertan las filas
    const tableBody = document.querySelector('p-table tbody');
    if (!tableBody) {
      return;
    }

    // Crea un observer para detectar la nueva fila
    const observer = new MutationObserver(() => {
      const links = this.links();
      const lastLinkId = links[links.length - 1]?.id;
      const newRow = document.getElementById(lastLinkId);

      if (newRow) {
        this.executeWaitTheAnimate('animate__bounceInUp', newRow, () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Link creado',
            life: 2000,
          });
        });

        // Desconecta el observer después de detectar la fila
        observer.disconnect();
      }
    });

    // Configura el observer para observar cambios en los hijos del contenedor
    observer.observe(tableBody, { childList: true });
  }

  editing = false;
  linkToEdit: Link | undefined;
  showEditDialog(link: Link) {
    this.editing = true;
    this.LinkForm.setValue({
      name: link.name,
      url: link.originalUrl,
      shortUrl: link.shortUrl ?? '',
      description: link.description || '',
    });
    this.LinkForm.get('url')?.disable();
    this.linkDialog = !this.linkDialog;
    this.linkToEdit = link;
  }

  updateLink() {
    if (this.LinkForm.invalid) {
      this.LinkForm.markAllAsTouched();
      return;
    }
    this.linkDialog = !this.linkDialog;
    this.editing = false;
    this.LinkForm.get('url')?.enable();

    this._dashboardService.updateLink({
      ...this.linkToEdit,
      name: this.LinkForm.value.name,
      description: this.LinkForm.value.description,
    } as Link);

    const tbody = document.querySelector('p-table tbody');
    if (!tbody) return;

    const observer = new MutationObserver(() => {
      const element = document.getElementById(this.linkToEdit!.id);
      if (element) {
        this.executeWaitTheAnimate('animate__flipInX', element, () => {
          this._messageService.add({
            severity: 'success',
            summary: 'Link actualizado',
            life: 2000,
          });
        });
        observer.disconnect();
      }
    });
    observer.observe(tbody, { childList: true });
  }

  deleteLink(event: Event, link: Link) {
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Estás seguro de que deseas eliminar este link?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
      },
      accept: () => {
        const element = document.getElementById(link.id);
        if (element) {
          const action = () => {
            this._dashboardService.deleteLink(link.id);
            this._messageService.add({
              severity: 'success',
              summary: 'Link eliminado',
              life: 2000,
              closable: true,
            });
          };
          this.executeWaitTheAnimate('animate__bounceOutDown', element, action);
        }
      },
    });
  }

  private limitLinks() {
    console.log(this.plan);
    if (this.plan?.name === 'free') {
      const links = this.links();
      if (links.length >= 5) {
        this._messageService.add({
          severity: 'warn',
          summary: 'Límite de links alcanzado',
          detail: 'Actualiza tu plan para agregar más links',
          life: 3000,
          closable: true,
        });
        return true;
      }
    }
    return false;
  }

  private executeWaitTheAnimate(
    animation: string,
    element: HTMLElement,
    action: () => void
  ) {
    element.classList.add('animate__animated', animation);
    element.addEventListener('animationend', () => {
      element.classList.remove('animate__animated', animation);
      action();
    });
  }
}
