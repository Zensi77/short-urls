export class LinkDto {
  private constructor(
    public readonly url: string,
    public readonly shortUrl: string,
    public readonly clicks = 0,
    public readonly user: string,
    public readonly description?: string
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create(obj: { [key: string]: any }): [string?, LinkDto?] {
    const { url, shortUrl, description, clicks, user } = obj;

    if (!url) {
      return ['Url is required'];
    }

    if (!shortUrl) {
      return ['ShortUrl is required'];
    }

    if (!clicks) {
      return ['Clicks is required'];
    }

    if (!user) {
      return ['User is required'];
    }

    return [null, new LinkDto(url, shortUrl, description, clicks, user)];
  }
}
