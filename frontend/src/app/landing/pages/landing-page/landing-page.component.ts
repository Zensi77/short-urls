import { Component, inject, OnInit } from '@angular/core';
import { ScrollService } from '../../../shared/services/scroll.service';
import { RouterLink } from '@angular/router';
import { PricesComponent } from '../../components/prices.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styles: `
    html {
      scroll-behavior: smooth;
    }
`,
  imports: [RouterLink, PricesComponent],
})
export class LandingPageComponent implements OnInit {
  private _scrollService = inject(ScrollService);
  ngOnInit(): void {
    // El componente se suscribe al Observable scrollToSection$ del servicio ScrollService
    this._scrollService.scrollToSection$.subscribe((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
