import { z } from 'zod';
import { CustomErrors } from '../index';
import { logger } from '../../config/winston';
import { mongo } from 'mongoose';
export class LinkEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly originalUrl: string,
    public shortUrl: string,
    public readonly clicks = 0,
    public readonly user: mongo.ObjectId,
    public readonly description?: string
  ) {}

  private static schema = z.object({
    id: z.string().min(1, 'Id is required'),
    name: z.string().min(1, 'Name is required'),
    originalUrl: z.string().min(1, 'Url is required'),
    shortUrl: z.string().min(1, 'ShortUrl is required'),
    clicks: z.number().min(0, 'Clicks must be a non-negative number'),
    user: z.union([
      z.string().regex(/^[0-9a-fA-F]{24}$/),
      z.instanceof(mongo.ObjectId),
    ]),
    description: z.string().optional(),
  });

  static fromObject(obj: { [key: string]: any }): LinkEntity {
    try {
      // Validar los datos usando Zod
      const validatedData = this.schema.parse(obj);
      const { id, name, originalUrl, shortUrl, clicks, user, description } =
        validatedData;
      return new LinkEntity(
        id,
        name,
        originalUrl,
        shortUrl,
        clicks,
        new mongo.ObjectId(user),
        description
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error(error.errors);
        throw CustomErrors.badRequest(error.errors[0].message);
      }
      throw CustomErrors.badRequest('An unknown error occurred');
    }
  }
}
