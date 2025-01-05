export class SubscriptionDto {
  private constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly duration: string,
    public readonly customLinks?: boolean,
    public readonly advancedStats?: boolean
  ) {}

  public static create(obj: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }): [string?, SubscriptionDto?] {
    const { name, price, duration, customLinks, advancedStats } = obj;

    if (!name) {
      return ['Name is required'];
    }

    if (typeof price !== 'number') {
      return ['Price must be a number'];
    }

    if (price < 0) {
      return ['Price must be a positive number'];
    }

    if (!duration) {
      return ['Duration is required'];
    }

    if (!['monthly', 'yearly'].includes(duration)) {
      return ['Duration is invalid'];
    }

    if (customLinks !== undefined && typeof customLinks !== 'boolean') {
      return ['CustomLinks must be a boolean'];
    }

    if (advancedStats !== undefined && typeof advancedStats !== 'boolean') {
      return ['AdvancedStats must be a boolean'];
    }

    return [
      null,
      new SubscriptionDto(name, price, duration, customLinks, advancedStats),
    ];
  }
}
