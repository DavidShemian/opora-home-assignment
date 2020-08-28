import { Exception } from "./exception";

export enum InitializationExceptionCodes {
  UNABLE_TO_INIT_DB = 5000,
  DB_NOT_INITIALIZED = 5100,
}

export class InitializationException extends Exception {
  private static CODE_PREFIX = 50000;

  constructor(
    code: InitializationExceptionCodes,
    message: string,
    params?: any
  ) {
    super(InitializationException.CODE_PREFIX, code, message, params);

    process.exit(0);
  }
}
