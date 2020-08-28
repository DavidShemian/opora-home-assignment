import {
  InitializationException,
  InitializationExceptionCodes,
} from "./../exceptions/initialization-exception";
import path = require("path");
import { config } from "../configs/config";
import { ConnectionOptions, createConnection, EntityManager } from "typeorm";

export class DBService {
  private static entityManager: EntityManager | undefined;
  private connectionString: string | undefined;
  private useSSL: boolean | undefined;

  private constructor() {
    this.connectionString = config.DB_CONNECTION_STRING;
    this.useSSL = config.DB_USE_SSL;
  }

  public static async getEntityManager(): Promise<EntityManager> {
    if (!DBService.entityManager) {
      throw new InitializationException(
        InitializationExceptionCodes.DB_NOT_INITIALIZED,
        "DB is not initialized!"
      );
    }

    return DBService.entityManager;
  }

  public static async initDB() {
    try {
      const dbService = new DBService();
      DBService.entityManager = await dbService.connect();
    } catch (e) {
      throw new InitializationException(
        InitializationExceptionCodes.UNABLE_TO_INIT_DB,
        "Unable to initialize DB!",
        e
      );
    }
  }

  private async connect(): Promise<EntityManager> {
    const connectionOptions: ConnectionOptions = {
      type: "postgres",
      url: this.connectionString,
      ssl: this.useSSL,
      synchronize: true,
      logging: true,
      entities: [path.resolve("dist", "app/models/**/*.js")],
    };

    const connection = await createConnection(connectionOptions);

    return new EntityManager(connection);
  }
}
