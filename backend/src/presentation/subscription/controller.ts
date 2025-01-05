import { SubscriptionService } from '../services/subscription.service';
import { Request, Response } from 'express';
import { SubscriptionDto } from '../../domain/dtos/subscription.dto';
import { CustomErrors } from '../../domain/errors/custom.error';

export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  private handleError(error: any, res: Response) {
    if (error instanceof CustomErrors) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  getPlans = (req: Request, res: Response) => {
    this.subscriptionService
      .getSubscriptions()
      .then((plans) => {
        return res.status(200).json(plans);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  getOnePlan = (req: Request, res: Response) => {
    const { id } = req.params;

    this.subscriptionService
      .getSubscription(id)
      .then((plan) => {
        return res.status(200).json(plan);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  modifyPlan = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, subscriptionDto] = SubscriptionDto.create(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    this.subscriptionService
      .modifySubscription(id, subscriptionDto)
      .then((plan) => {
        return res.status(200).json(plan);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };

  deleteSubscription = (req: Request, res: Response) => {
    const { id } = req.params;
    this.subscriptionService
      .deleteSubscription(id)
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };
}
