import { Exception } from './exception';

export enum InitializationExceptionCodes {
    UNABLE_TO_INIT_DB = 5000,
    DB_NOT_INITIALIZED = 5100,
    UNABLE_TO_LOAD_CONFIGURATIONS = 5200,
    MISSING_REQUIRED_CONFIGURATION = 5300,
}

export class InitializationException extends Exception {
    private static CODE_PREFIX = 50000;

    constructor(code: InitializationExceptionCodes, message: string, params?: any) {
        super(InitializationException.CODE_PREFIX, code, message, params);

        logger.info('Ending process due to initialization exception');
        process.exit(0);
    }
}
