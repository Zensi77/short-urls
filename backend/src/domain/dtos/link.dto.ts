import { logger } from '../../config/winston';
import { z } from 'zod';
import { CustomErrors } from '../errors/custom.error';

export class LinkDto {
  private constructor(
    public readonly name: string,
    public readonly originalUrl: string,
    public readonly clicks = 0,
    public readonly user: string,
    public readonly description?: string,
    public readonly shortUrl?: string
  ) {}

  private static schema = z.object({
    name: z.string().min(1, 'Name is required'),
    originalUrl: z.string().min(1, 'Url is required'),
    shortUrl: z.string().optional(),
    description: z.string().optional(),
    clicks: z.number().optional().default(0),
    user: z.string().min(1, 'User is required'),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create(obj: { [key: string]: any }): [CustomErrors?, LinkDto?] {
    console.log(obj);
    try {
      const dataValidated = this.schema.parse(obj);
      const { name, originalUrl, shortUrl, description, clicks, user } =
        dataValidated;

      return [
        null,
        new LinkDto(name, originalUrl, clicks, user, description, shortUrl),
      ];
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error(error.errors);
        return [CustomErrors.badRequest(error.errors[0].message)];
      }
      return [CustomErrors.badRequest('Las propiedades no son válidas')];
    }
  }
}
