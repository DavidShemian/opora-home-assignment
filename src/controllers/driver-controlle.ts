import { DriverService } from "./../services/driver-service";
import { Router, Response, Request, NextFunction } from "express";

export class DriverController {
  get router(): Router {
    return this._router;
  }

  private _router: Router;
  private driverService: DriverService;
  private path = "/drivers";

  constructor(router: Router) {
    this._router = router;
    this.driverService = new DriverService();
    this.initializeRoutes();
  }

  private getCurrentSessionDriversSortedByWins = async (
    _request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const drivers = await this.driverService.getCurrentSessionDriversSortedByWins();
      response.status(200).json(drivers);
    } catch (e) {
      next(e);
    }
  };

  private getDriverRaces = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { driverId } = request.params;

      const drivers = await this.driverService.getDriverRaces(+driverId);

      response.status(200).json(drivers);
    } catch (e) {
      next(e);
    }
  };

  private initializeRoutes() {
    this._router.get(
      `${this.path}/current-season`,
      this.getCurrentSessionDriversSortedByWins
    );
    this._router.get(`${this.path}/:driverId(\\d+)/races`, this.getDriverRaces);
  }
}
