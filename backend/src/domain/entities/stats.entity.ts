import { CustomErrors } from '../errors/custom.error';
import { LinkEntity } from './link.entity';

export class StatEntity {
  constructor(
    private readonly id: string,
    private readonly linkId: LinkEntity,
    private readonly totalClicks = 0,
    private readonly countries?: string[],
    private readonly browsers?: string[],
    private readonly devices?: string[]
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static fromObject(obj: { [key: string]: any }): StatEntity {
    const { id, linkId, totalClicks, countries, browsers, devices } = obj;

    if (!id) throw CustomErrors.badRequest('Id is required');

    if (!linkId) throw CustomErrors.badRequest('LinkId is required');

    if (!totalClicks) throw CustomErrors.badRequest('TotalClicks is required');

    return new StatEntity(
      id,
      linkId,
      totalClicks,
      countries,
      browsers,
      devices
    );
  }
}
