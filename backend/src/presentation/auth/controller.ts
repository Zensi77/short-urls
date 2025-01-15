import { Request, Response } from 'express';
import { CustomErrors, UserDto } from '../../domain';
import { AuthService } from '../services/auth.service';

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
    const { uid, email, email_verified, firebase, sign_in_provider } = user;
    console.log(user);
    const [error, userDto] = UserDto.create({
      uid,
      email,
      emailVerified: email_verified,
      sign_in_provider: firebase.sign_in_provider,
    });
    if (error) {
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
