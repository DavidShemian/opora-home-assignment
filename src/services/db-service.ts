import path = require('path');
import { ConnectionOptions, createConnection, EntityManager } from 'typeorm';
import { config } from '../configs/config';
import { InitializationException, InitializationExceptionCodes } from './../exceptions/initialization-exception';

/**
 * A singleton class that initiate the db connection
 */
export class DBService {
    private static entityManager: EntityManager;
    private connectionString: string;
    private useSSL: boolean;

    private constructor() {
        const dbConnectionString = config.DB_CONNECTION_STRING;
        const useSSL = config.DB_USE_SSL;

        if (!dbConnectionString || !useSSL) {
            throw new InitializationException(InitializationExceptionCodes.UNABLE_TO_INIT_DB, 'db initializations required params are missing', {
                dbConnectionString,
                useSSL,
            });
        }

        this.connectionString = dbConnectionString;
        this.useSSL = useSSL === 'true';
    }

    public static getEntityManager(): EntityManager {
        if (!DBService.entityManager) {
            throw new InitializationException(InitializationExceptionCodes.DB_NOT_INITIALIZED, 'DB is not initialized!');
        }

        return DBService.entityManager;
    }

    public static async initDB(): Promise<void> {
        try {
            const dbService = new DBService();
            DBService.entityManager = await dbService.connect();
        } catch (error) {
            throw new InitializationException(InitializationExceptionCodes.UNABLE_TO_INIT_DB, 'Unable to initialize DB!', error);
        }
    }

    private async connect(): Promise<EntityManager> {
        const connectionOptions: ConnectionOptions = {
            type: 'postgres',
            url: this.connectionString,
            ssl: this.useSSL,
            synchronize: true,
            logging: true,
            entities: [path.resolve('dist', 'src/models/db-models/**/*.js')],
        };

        const connection = await createConnection(connectionOptions);

        return new EntityManager(connection);
    }
}
