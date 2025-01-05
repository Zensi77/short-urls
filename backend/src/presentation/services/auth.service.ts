import { CustomErrors } from '../../domain/errors/custom.error';
import { User } from '../../data/models/user.model';
import { UserDto } from '../../domain/dtos/user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { Subscription } from '../../data/models/subscription.model';

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
        user.subscription = subscription._id;
      }
      await user.save();

      const userEntity = UserEntity.fromObject(user);

      return userEntity;
    } catch (error) {
      console.error('Error creating user:', error);
      throw CustomErrors.internalError(error.message);
    }
  }
}
