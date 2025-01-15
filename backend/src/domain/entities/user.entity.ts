import { z } from 'zod';
import { logger } from '../../config/winston';
import { CustomErrors } from '../errors/custom.error';

export class UserEntity {
  private constructor(
    public readonly id: string,
    public readonly uid: string,
    public readonly email: string,
    public readonly email_verified: boolean,
    public readonly plan: string,
    public readonly role: string,
    public readonly sign_in_provider: string,
    public readonly subscription: string
  ) {}

  private static schema = z.object({
    id: z.string().min(1, 'Id is required'),
    uid: z.string().min(1, 'UID is required'),
    email: z.string().email('Email is invalid').min(1, 'Email is required'),
    plan: z.string().min(1, 'Plan is required'),
    email_verified: z.boolean().default(false),
    role: z.enum(['user', 'admin']).default('user'),
    sign_in_provider: z.string().min(1, 'Sign in provider is required'),
    subscription: z.string().min(1, 'Subscription is required'),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: { [key: string]: any }): UserEntity {
    try {
      const dataValidated = this.schema.parse(obj);
      const {
        id,
        uid,
        email,
        plan,
        email_verified,
        role = 'user',
        sign_in_provider,
        subscription,
      } = dataValidated;

      return new UserEntity(
        id,
        uid,
        email,
        email_verified,
        plan,
        role,
        sign_in_provider,
        subscription
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error(error.errors);
        throw CustomErrors.badRequest(error.errors[0].message);
      }
      throw CustomErrors.internalError('An unknown error occurred');
    }
  }
}
