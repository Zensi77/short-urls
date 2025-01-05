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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: { [key: string]: any }): UserEntity {
    const {
      id,
      uid,
      email,
      email_verified,
      role = 'user',
      sign_in_provider,
      subscription,
    } = obj;

    if (!id) throw CustomErrors.badRequest('Id is required');

    if (!uid) throw CustomErrors.badRequest('uid is required');

    if (!email) throw CustomErrors.badRequest('Email is required');

    if (typeof email_verified !== 'boolean')
      throw CustomErrors.badRequest('Email verification status is required');

    if (!sign_in_provider)
      throw CustomErrors.badRequest('Sign in provider is required');

    if (!role) throw CustomErrors.badRequest('Role is required');

    if (!['user', 'admin'].includes(role))
      throw CustomErrors.badRequest('Role is invalid');

    if (!subscription || typeof subscription !== 'string') {
      throw CustomErrors.badRequest('Subscription is invalid');
    }

    return new UserEntity(
      id,
      uid,
      email,
      email_verified,
      subscription,
      role,
      sign_in_provider,
      subscription
    );
  }
}
