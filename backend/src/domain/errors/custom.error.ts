export class CustomErrors extends Error {
  constructor(readonly statusCode: number, readonly message: string) {
    super(message);
  }
  static badRequest(message: string) {
    return new CustomErrors(400, message);
  }
  static unauthorized(message: string) {
    return new CustomErrors(401, message);
  }
  static forbidden(message: string) {
    return new CustomErrors(403, message);
  }
  static notFound(message: string) {
    return new CustomErrors(404, message);
  }
  static internalError(message: string) {
    return new CustomErrors(500, message);
  }
}
