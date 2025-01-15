import { inject, Injectable, signal } from '@angular/core';
import { Link } from '../interfaces/link.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from 'frontend/environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly _http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly links = signal<Link[]>([]);

  getLinksObservable() {
    const url = `${environment.apiUrl}/links`;
    // Retorna el Observable para que el Resolver se suscriba.
    return this._http.get<Link[]>(url);
  }

  getLinks() {
    const url = `${environment.apiUrl}/links`;
    this._http.get<Link[]>(url).subscribe(
      (links) => {
        this.links.set(links);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  createLink(newLink: Link) {
    const url = `${environment.apiUrl}/links`;

    this._http.post<Link>(url, newLink).subscribe(
      () => {
        this.getLinks();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteLink(id: string) {
    const url = `${environment.apiUrl}/links/${id}`;

    this._http.delete(url).subscribe(
      () => {
        this.getLinks();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async updateLink(link: Link) {
    const url = `${environment.apiUrl}/links/${link.id}`;

    this._http.put<Link>(url, link).subscribe(
      () => {
        this.getLinks();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
