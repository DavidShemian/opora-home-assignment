import { EntityManager } from "typeorm";
import { DBService } from "./../services/db-service";

export abstract class BaseDal {
  private _entityManager: EntityManager;

  constructor() {
    this._entityManager = DBService.getEntityManager();
  }

  get entityManager(): EntityManager {
    return this._entityManager;
  }
}
