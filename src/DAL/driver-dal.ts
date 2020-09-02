import { selectMillisecondsAsMinutesText } from "./dal-utils";
import { BaseDal } from "./base-dal";

export class DriverDal extends BaseDal {
  /**
   * Returns list of current season drivers with standings stats
   * sorted by the number of wins, from top to button
   */
  public async getCurrentSessionDriversSortedByWins() {
    return this.entityManager.query(`
            select
            driver_standings."driverId",
            driver_standings."raceId",
            driver_standings.points,
            driver_standings."position",
            CONCAT(drivers.forename, ' ', drivers.surname) as name,
            drivers.nationality
        from
            "driverStandings" driver_standings
        inner join drivers on
            drivers."driverId" = driver_standings."driverId"
        where
            "raceId" = (
            select
                max(driver_standings_inner."raceId")
            from
                "driverStandings" driver_standings_inner
            inner join races r on
            driver_standings."raceId" = r."raceId"
                and date_part('year', r.date) = date_part('year', CURRENT_DATE))
        order by driver_standings.wins desc;
        `);
  }

  /**
   * Returns list of all driver's races, with lap, pit stops and circuit infos
   * sorted by race date from most recent to last
   */
  public async getDriverRaces(driverId: number) {
    return this.entityManager.query(
      `
            select
            lap_times."raceId",
            max(lap_times.time) as "slowestLapTime",
            min(lap_times.time) as "fastestLapTime",
            ${selectMillisecondsAsMinutesText(
              "avg(lap_times.milliseconds)"
            )} as "averageLapTime",
            max(ps.stop) as "numOfPitStops",
            ${selectMillisecondsAsMinutesText(
              "min(ps.milliseconds)"
            )} as "fastestPitStop",
            ${selectMillisecondsAsMinutesText(
              "max(ps.milliseconds)"
            )} as "slowestPitStop",
            circuits."name" as "circuitName",
            results.points as "points",
            results."position" as "position"
        from
            drivers
        inner join "lapTimes" lap_times on drivers."driverId" = lap_times."driverId"
        inner join races on races."raceId" = lap_times."raceId"
        inner join circuits on circuits."circuitId" = races."circuitId"
        inner join "pitStops" ps on ps."driverId" = drivers."driverId" and ps."raceId" = races."raceId"
        inner join results on results."raceId" = races."raceId" and results."driverId" = drivers."driverId"
        where
            drivers."driverId" = $1
        group by
            lap_times."raceId", races."name", races."date", circuits.name, results.points, results.position
        order by races."date" desc;
        `,
      [driverId]
    );
  }
}
