import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'frontend/environments/environment';
import { catchError, debounceTime, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ValidatorService {
  private _http = inject(HttpClient);

  validateUrlPersonality(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const url = `${environment.apiUrl}/links/validate`;
      return this._http.post<boolean>(url, { url: control.value }).pipe(
        debounceTime(300), // Espera 300ms antes de enviar la solicitud.
        map((res) => (res ? { urlInvalid: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
