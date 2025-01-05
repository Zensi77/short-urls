import { User } from '../../data/models/user.model';
import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const autoriazation = req.headers.authorization;
  if (!autoriazation) {
    return res.status(401).send('Unauthorized');
  }

  const token = autoriazation.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    await User.findOne({ uid: decodedToken.uid }, (err, user) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.body.user = decodedToken;
      next();
    });
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}
