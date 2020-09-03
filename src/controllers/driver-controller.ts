import { NextFunction, Request, Response, Router } from 'express';
import { DriverService } from '../services/driver-service';
import { ResponseService, SuccessCodes } from '../services/response-service';
import { ICurrentSeasonDriver } from './../models/interfaces/current-season-driver';
import { IDriverRace } from './../models/interfaces/driver-race';

export class DriverController {
    get router(): Router {
        return this._router;
    }

    private _router: Router;
    private driverService: DriverService;
    private path = '/drivers';

    constructor(router: Router) {
        this._router = router;
        this.driverService = new DriverService();
        this.initializeRoutes();
    }

    private getCurrentSessionDriversSortedByWins = async (_request: Request, response: Response, next: NextFunction) => {
        try {
            const drivers: ICurrentSeasonDriver[] = await this.driverService.getCurrentSessionDriversSortedByWins();

            return ResponseService.responseSuccess(response, SuccessCodes.OK, { drivers });
        } catch (error) {
            next(error);
        }
    };

    private getDriverRaces = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { driverId } = request.params;
            const driverRaces: IDriverRace[] = await this.driverService.getDriverRaces(+driverId);

            return ResponseService.responseSuccess(response, SuccessCodes.OK, { driverRaces });
        } catch (error) {
            next(error);
        }
    };

    private initializeRoutes(): void {
        this._router.get(`${this.path}/current-season`, this.getCurrentSessionDriversSortedByWins);
        this._router.get(`${this.path}/:driverId(\\d+)/races`, this.getDriverRaces);
    }
}
