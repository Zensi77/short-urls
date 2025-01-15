import { z } from 'zod';
import { CustomErrors } from '../';
import { logger } from '../../config/winston';

export class SubscriptionEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly duration: string,
    public readonly customLinks: boolean,
    public readonly advancedStats: boolean
  ) {}

  public static schema = z.object({
    id: z.string().min(1, 'Id is required'),
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0, 'Price is required'),
    duration: z.enum(['monthly', 'yearly']),
    customLinks: z.boolean().optional().default(false),
    advancedStats: z.boolean().optional().default(false),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: { [key: string]: any }): SubscriptionEntity {
    try {
      const validatedData = this.schema.parse(obj);
      const { id, name, price, duration, customLinks, advancedStats } =
        validatedData;
      return new SubscriptionEntity(
        id,
        name,
        price,
        duration,
        customLinks,
        advancedStats
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error(error.errors);
        throw CustomErrors.badRequest(error.errors[0].message);
      }
      throw CustomErrors.badRequest('An unknown error occurred');
    }
  }
}
