import { Subscription, User } from '../../data';
import { logger } from '../../config/winston';
import { CustomErrors, UserDto, UserEntity } from '../../domain';

export class AuthService {
  public async verifyUser(userDto: UserDto) {
    const existUser = await User.findOne({ uid: userDto.uid });
    if (existUser) {
      return existUser;
    }

    try {
      const user = new User(userDto);
      if (!user.subscription) {
        const subscription = await Subscription.findOne({ price: 0 });
        if (!subscription) {
          throw CustomErrors.internalError('Subscription not found');
        }
        user.subscription = subscription.id;
      }
      await user.save();

      const userEntity = UserEntity.fromObject(user);

      return userEntity;
    } catch (error) {
      logger.error(error);
      throw CustomErrors.internalError(error.message);
    }
  }
}
