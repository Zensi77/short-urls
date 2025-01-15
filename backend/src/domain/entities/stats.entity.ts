import { z } from 'zod';
import { CustomErrors } from '../errors/custom.error';
import { logger } from '../../config/winston';

export class StatEntity {
  constructor(
    private readonly id: string,
    private readonly linkId: string,
    private readonly totalClicks = 0,
    private readonly countries?: string[],
    private readonly browsers?: string[],
    private readonly devices?: string[]
  ) {}

  private static schema = z.object({
    id: z.string().min(1, 'Id is required'),
    linkId: z.string().min(1, 'LinkId is required'),
    totalClicks: z
      .number()
      .min(0, 'TotalClicks must be a positive number')
      .default(0),
    countries: z.array(z.string()).optional(),
    browsers: z.array(z.string()).optional(),
    devices: z.array(z.string()).optional(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static fromObject(obj: { [key: string]: any }): StatEntity {
    try {
      const dataValidated = this.schema.parse(obj);
      const { id, linkId, totalClicks, countries, browsers, devices } =
        dataValidated;

      return new StatEntity(
        id,
        linkId,
        totalClicks,
        countries,
        browsers,
        devices
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
