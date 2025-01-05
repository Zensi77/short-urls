import { CustomErrors } from '../index';
export class LinkEntity {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public shortUrl: string,
    public readonly clicks = 0,
    public readonly user: string,
    public readonly description?: string
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromObject(obj: { [key: string]: any }): LinkEntity {
    const { id, url, shortUrl, description, clicks, user } = obj;

    if (!id) throw CustomErrors.badRequest('Id is required');

    if (!url) throw CustomErrors.badRequest('Url is required');

    if (!shortUrl) throw CustomErrors.badRequest('ShortUrl is required');

    if (!clicks) throw CustomErrors.badRequest('Clicks is required');

    if (!user) throw CustomErrors.badRequest('User is required');

    return new LinkEntity(id, url, shortUrl, description, clicks, user);
  }
}
