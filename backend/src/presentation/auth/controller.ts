import { UserDto } from '../../domain/dtos/user.dto';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CustomErrors } from '../../domain/errors/custom.error';

export class AuthController {
  constructor(private authService: AuthService) {}

  private handleError(error: any, res: Response) {
    if (error instanceof CustomErrors) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  init = (req: Request, res: Response) => {
    const user = req.body.user;
    const [error, userDto] = UserDto.create({
      uid: user.uid,
      email: user.email,
      email_verified: user.email_verified,
      sign_in_provider: user.firebase.sign_in_provider,
    });
    if (error) {
      console.error('Error creating user DTO:', error);
      this.handleError(error, res);
    }

    this.authService
      .verifyUser(userDto)
      .then((user) => {
        return res.status(200).json(user);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };
}
