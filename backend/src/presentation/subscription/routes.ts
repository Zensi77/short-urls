import { Router } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionController } from './controller';
import { isAdmin } from '../middlewares/isAdmin';

export class SubscriptionRoutes {
  static get routes() {
    const router = Router();

    const subscriptionService = new SubscriptionService();
    const controller = new SubscriptionController(subscriptionService);

    router.get('/', controller.getPlans);
    router.get('/:id', controller.getOnePlan);
    router.put('/:id', [isAdmin], controller.modifyPlan);
    router.delete('/:id', [isAdmin], controller.deleteSubscription);

    return router;
  }
}
