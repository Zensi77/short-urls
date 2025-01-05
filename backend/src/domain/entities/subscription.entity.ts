import { CustomErrors } from '../errors/custom.error';

export class SubscriptionEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly duration: number,
    public readonly customLinks: boolean,
    public readonly advancedStats: boolean
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: { [key: string]: any }): SubscriptionEntity {
    const { id, name, price, duration, customLinks, advancedStats } = obj;

    if (!id) throw CustomErrors.badRequest('Id is required');

    if (!name) throw CustomErrors.badRequest('Name is required');

    if (typeof price !== 'number')
      throw CustomErrors.badRequest('Price is required');

    if (!duration) throw CustomErrors.badRequest('Duration is required');

    return new SubscriptionEntity(
      id,
      name,
      price,
      duration,
      customLinks,
      advancedStats
    );
  }
}
