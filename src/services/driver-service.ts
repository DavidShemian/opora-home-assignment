import { DriverDal } from '../DAL/driver-dal';
import { ICurrentSeasonDriver } from '../models/interfaces/current-season-driver';
import { IDriverRace } from './../models/interfaces/driver-race';

export class DriverService {
    private driverDal: DriverDal;

    constructor() {
        this.driverDal = new DriverDal();
    }

    public async getCurrentSessionDriversSortedByWins(): Promise<ICurrentSeasonDriver[]> {
        return this.driverDal.getCurrentSessionDriversSortedByWins();
    }

    public async getDriverRaces(driverId: number): Promise<IDriverRace[]> {
        return await this.driverDal.getDriverRaces(driverId);
    }
}
