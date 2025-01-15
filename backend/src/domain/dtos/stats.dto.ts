import { logger } from '../../config/winston';
import { z } from 'zod';

export class StatsDto {
  private constructor(
    private readonly linkId: string,
    private readonly totalClicks: number,
    private readonly countries: string[],
    private readonly browsers: string[],
    private readonly devices: string[]
  ) {}

  private static schema = z.object({
    linkId: z.string().min(1, 'LinkId is required'),
    totalClicks: z
      .number()
      .min(0, 'TotalClicks must be a positive number')
      .default(0),
    countries: z.array(z.string()).optional(),
    browsers: z.array(z.string()).optional(),
    devices: z.array(z.string()).optional(),
  });

  public static create(obj: { [key: string]: any }): [string?, StatsDto?] {
    try {
      // Validar los datos usando Zod
      const validatedData = this.schema.parse(obj);
      const {
        linkId,
        totalClicks,
        countries = [],
        browsers = [],
        devices = [],
      } = validatedData;
      return [
        null,
        new StatsDto(linkId, totalClicks, countries, browsers, devices),
      ];
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error(error.errors);
        return [error.errors[0].message];
      }
      return ['An unknown error occurred'];
    }
  }
}
