export class StatsDto {
  private constructor(
    private readonly linkId: string,
    private readonly totalClicks = 0,
    private readonly countries: string[],
    private readonly browsers: string[],
    private readonly devices: string[]
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create(obj: { [key: string]: any }): [string?, StatsDto?] {
    const { linkId, totalClicks, countries, browsers, devices } = obj;

    if (!linkId) {
      return ['LinkId is required'];
    }

    if (totalClicks && typeof totalClicks !== 'number') {
      return ['TotalClicks must be a number'];
    }

    if (countries && !Array.isArray(countries)) {
      return ['Countries must be an array'];
    }

    if (browsers && !Array.isArray(browsers)) {
      return ['Browsers must be an array'];
    }

    if (devices && !Array.isArray(devices)) {
      return ['Devices must be an array'];
    }

    return [
      null,
      new StatsDto(linkId, totalClicks, countries, browsers, devices),
    ];
  }
}
