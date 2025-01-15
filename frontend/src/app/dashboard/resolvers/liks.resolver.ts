import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Link } from '../interfaces/link.interface';
import { DashboardService } from '../services/dashboard.service';

@Injectable({ providedIn: 'root' })
export class LinkResolver implements Resolve<Link[]> {
  private readonly _dashboardService = inject(DashboardService);

  resolve(): Observable<Link[]> {
    return this._dashboardService.getLinksObservable();
  }
}
