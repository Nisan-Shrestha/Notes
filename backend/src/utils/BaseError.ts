export class BaseError extends Error {
  statusCode: number;
  stack?: string | undefined;
  constructor(statusCode: number, message: string, error: Error | undefined = undefined) {
    super(message);
    this.stack = error?.stack;
    this.statusCode = statusCode;
  }
}