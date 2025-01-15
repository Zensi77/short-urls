import { z } from 'zod';
import { logger } from '../../config/winston';

export class SubscriptionDto {
  private constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly duration: string,
    public readonly customLinks?: boolean,
    public readonly advancedStats?: boolean
  ) {}

  private static schema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z
      .number()
      .min(0, 'Price is required')
      .positive('Price must be a positive number'),
    duration: z.enum(['monthly', 'yearly']),
    customLinks: z.boolean().optional().default(false),
    advancedStats: z.boolean().optional().default(false),
  });

  public static create(obj: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }): [string?, SubscriptionDto?] {
    try {
      const validatedData = this.schema.parse(obj);
      const { name, price, duration, customLinks, advancedStats } =
        validatedData;
      return [
        null,
        new SubscriptionDto(name, price, duration, customLinks, advancedStats),
      ];
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error(error.errors);
        return [error.errors[0].message];
      }
      return ['An unknown error occurred'];
    }
  }
}
