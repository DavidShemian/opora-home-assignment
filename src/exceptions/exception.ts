export abstract class Exception extends Error {
  public code: number;
  public internalCode: number;
  public message: string;
  public params: any;

  protected constructor(
    prefix: number,
    code: number,
    message: string,
    params?: any
  ) {
    super();

    this.internalCode = code;
    this.code = prefix + code;
    this.message = message;
    this.params = params;

    logger.error(message, { prefix, code, params });
  }
}
