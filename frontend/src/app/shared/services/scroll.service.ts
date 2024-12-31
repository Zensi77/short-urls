import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  // Subject es un tipo de Observable que permite emitir valores a otros Observables
  private scrollToSectionSubject = new Subject<string>();
  scrollToSection$ = this.scrollToSectionSubject.asObservable();
  // El método scrollToSection() emite un valor a través del Subject

  scrollToSection(sectionId: string): void {
    this.scrollToSectionSubject.next(sectionId);
  }
}
