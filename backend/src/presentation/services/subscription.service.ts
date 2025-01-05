import { CustomErrors } from '../../domain/errors/custom.error';
import { Subscription } from '../../data/models/subscription.model';
import { SubscriptionDto } from '../../domain/dtos/subscription.dto';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
export class SubscriptionService {
  async getSubscriptions() {
    await this.validateSubscription();
    return Subscription.find();
  }

  async modifySubscription(id: string, subscriptionModified: SubscriptionDto) {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw CustomErrors.notFound('Subscription not found');
    }

    try {
      const { name, price, duration, customLinks, advancedStats } =
        subscriptionModified;

      if (name) {
        subscription.name = name;
      }

      if (price) {
        subscription.price = price;
      }

      if (duration && (duration === 'monthly' || duration === 'yearly')) {
        subscription.duration = duration;
      }

      if (customLinks) {
        subscription.customLinks = customLinks;
      }

      if (advancedStats) {
        subscription.advancedStats = advancedStats;
      }

      await subscription.save();

      return SubscriptionEntity.fromObject(subscription);
    } catch (error) {
      throw CustomErrors.internalError(error);
    }
  }

  async deleteSubscription(id: string) {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw CustomErrors.notFound('Subscription not found');
    }

    try {
      const deletedSubscription = await Subscription.findByIdAndDelete(id);
      return SubscriptionEntity.fromObject(deletedSubscription);
    } catch (error) {
      throw CustomErrors.internalError(error);
    }
  }

  async getSubscription(id: string) {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw CustomErrors.notFound('Subscription not found');
    }

    return SubscriptionEntity.fromObject(subscription);
  }

  async validateSubscription() {
    try {
      let subscriptions = await Subscription.find();

      if (subscriptions.length === 0) {
        const free = new Subscription({
          name: 'Free',
          price: 0,
          duration: 'monthly',
          customLinks: false,
          advancedStats: false,
        });

        const pro = new Subscription({
          name: 'Pro',
          price: 10,
          duration: 'monthly',
          customLinks: true,
          advancedStats: false,
        });

        const company = new Subscription({
          name: 'Company',
          price: 100,
          duration: 'monthly',
          customLinks: true,
          advancedStats: true,
        });
        Promise.all([free.save(), pro.save(), company.save()]); // Save all subscriptions
      }

      subscriptions = await Subscription.find();

      const subscriptionsEntities = subscriptions.map((subscription) =>
        SubscriptionEntity.fromObject(subscription)
      );

      return subscriptionsEntities;
    } catch (error) {
      CustomErrors.internalError(error.message);
    }
  }
}
