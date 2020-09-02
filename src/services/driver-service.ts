import { DriverDal } from "../DAL/driver-dal";

export class DriverService {
  private driverDal: DriverDal;

  constructor() {
    this.driverDal = new DriverDal();
  }

  public async getCurrentSessionDriversSortedByWins() {
    return this.driverDal.getCurrentSessionDriversSortedByWins();
  }

  public async getDriverRaces(driverId: number) {
    return await this.driverDal.getDriverRaces(driverId);
  }
}
