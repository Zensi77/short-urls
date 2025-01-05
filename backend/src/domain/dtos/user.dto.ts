import { RegularExp } from '../../config/validators';
import { SubscriptionEntity } from '../entities/subscription.entity';

export class UserDto {
  private constructor(
    public readonly email: string,
    public readonly role = 'user',
    public readonly uid: string,
    public readonly emailVerified: boolean,
    public readonly sign_in_provider: string,
    public readonly subscription?: SubscriptionEntity
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create(obj: { [key: string]: any }): [string?, UserDto?] {
    const {
      uid,
      email,
      email_verified,
      sign_in_provider,
      role = 'user',
      subscription,
    } = obj;

    if (!uid) {
      return ['UID is required'];
    }

    if (!email) {
      return ['Email is required'];
    }

    if (typeof email_verified !== 'boolean') {
      return ['Email verification status is required'];
    }

    if (!sign_in_provider) {
      return ['Sign in provider is required'];
    }

    if (!RegularExp.email.test(email)) {
      return ['Email is invalid'];
    }

    if (subscription && typeof subscription !== 'string') {
      return ['Subscription is invalid'];
    }

    return [
      null,
      new UserDto(
        email,
        role,
        uid,
        email_verified,
        sign_in_provider,
        subscription
      ),
    ];
  }
}
