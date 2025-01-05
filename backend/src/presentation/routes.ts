import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { SubscriptionRoutes } from './subscription/routes';
import { LinkRoutes } from './link/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/v1/auth', AuthRoutes.routes);
    router.use('/api/v1/subscription', SubscriptionRoutes.routes);
    router.use('/api/v1/links', LinkRoutes.routes);

    return router;
  }
}
