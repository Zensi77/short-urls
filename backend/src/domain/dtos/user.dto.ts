import { z } from 'zod';
import { SubscriptionEntity } from '../entities/subscription.entity';
import { logger } from '../../config/winston';

export class UserDto {
  private constructor(
    public readonly email: string,
    public readonly role = 'user',
    public readonly uid: string,
    public readonly emailVerified: boolean,
    public readonly sign_in_provider: string,
    public readonly subscription?: SubscriptionEntity
  ) {}

  private static schema = z.object({
    email: z.string().email('Email is invalid').min(1, 'Email is required'),
    role: z.enum(['user', 'admin']).default('user'),
    uid: z.string().min(1, 'UID is required'),
    emailVerified: z.boolean().default(false),
    sign_in_provider: z.string().min(1, 'Sign in provider is required'),
    subscription: SubscriptionEntity.schema.optional(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create(obj: { [key: string]: any }): [string?, UserDto?] {
    try {
      const validatedData = this.schema.parse(obj);

      const { email, role, uid, emailVerified, sign_in_provider } =
        validatedData;
      return [
        undefined,
        new UserDto(email, role, uid, emailVerified, sign_in_provider),
      ];
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error(error.errors);
        return [error.errors[0].message, undefined];
      }
      return ['An unknown error occurred', undefined];
    }
  }
}
