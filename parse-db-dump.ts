/**
 * This script takes the https://ergast.com/mrd/db/ PostgreSQL compatible MySQL database dump
 * and modified it to work with Postgres.
 * In order to use the script,
 * all required environment variables must be defined (as explained in readme.md)
 * and the dump, named 'f1db_postgres.sql', must be in the root folder of the project
 * Farther more, this script also adds the missing avatar column using Wikipedia API In order to retrieve the driver image
 */

// tslint:disable: no-var-requires
import axios from 'axios';
import { initLogger } from './logger';
import { config } from './src/configs/config';
import { DBService } from './src/services/db-service';

const fs = require('fs');
const get = require('lodash.get');

initLogger();
logger.info('STARTING TO MODIFY MYSQL DUMP');

config.DB_SHOULD_LOG = 'false';
logger.info('PREVENTED DB FOR LOGGING');

fs.readFile('./f1db_postgres.sql', 'utf8', async (err: Error, content: string) => {
    if (err) {
        logger.error('Unable to read f1db_postgres.sql, must be located in the root of the project');
        throw err;
    }

    logger.info('SUCCESSFULLY READ DUMP FILE');

    await DBService.initDB();
    logger.info('SUCCESSFULLY INITIATE DB');

    content = content.replace(/LOCK TABLES .* WRITE;/g, '');
    logger.info('Removed Lock tables');

    content = content.replace(/UNLOCK TABLES;/g, '');
    logger.info('Removed Unlock tables');

    content = content.replace(/int\(\d+\)/g, 'int');
    logger.info('Changed from int(decimal) to int');

    content = content.replace(/UNIQUE KEY .* \(/g, 'UNIQUE (');
    logger.info('Changed from UNIQUE KEY "columnName" ("columnName") to UNIQUE ("columnName")');

    content = content.replace(/\\'/g, "''");
    logger.info('Changed from escaping single quote with forward slash the double single quote');

    content = content.replace(/,(\r\n|\r|\n)\s+KEY .* \(".*"\)/g, '');
    logger.info('Remove KEY "columnName" ("columnName")');

    content = content.replace(/date NOT NULL DEFAULT '0000-00-00'/g, 'date DEFAULT NULL');
    logger.info('Changed default date from 0000-00-00 to null');

    content = content.concat('\n CREATE INDEX lap_times_race_id_index ON "lapTimes" ("raceId");');
    content = content.concat('\n CREATE INDEX pit_stops_race_id_index ON "pitStops" ("raceId");');
    logger.info('Inserted indexes what removed with the KEY statement');

    content = content.concat('\n ALTER TABLE "drivers" ADD COLUMN avatar text default null;');
    logger.info('Adds missing avatar column to drivers');

    try {
        logger.info(`STARTING TO RUN DUMP ON POSTGRES DB`);

        await DBService.getEntityManager().query(content.toString());

        logger.info('FINISHED LOADING DATA TO POSTGRES DB');

        await addAvatarToDrivers();

        logger.info(`FINISH BUILDING DB`);

        process.exit(0);
    } catch (error) {
        logger.error('UNABLE TO LOAD DATA TO DB');
        throw error;
    }
});

/**
 * Uses Wikipedia Query API - https://www.mediawiki.org/wiki/API:Tutorial
 * In order to retrieve the main image from each driver Wikipedia page
 * If no such image exist, then avatar remains empty
 */
const addAvatarToDrivers = async () => {
    logger.info('STARTING TO INSERT DRIVERS AVATARS');

    const getWikipediaApiQuery = (title: string) =>
        `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${title}&redirects=1`;

    const driversWikipediaPages = await DBService.getEntityManager().query('SELECT "driverId", url from drivers');

    await Promise.all(
        driversWikipediaPages.map(async ({ driverId, url }: { driverId: number; url: string }) => {
            const wikiTitle = url.replace('http://en.wikipedia.org/wiki/', ''); // Retrieves title from Wikipedia url
            const result = await axios.get(getWikipediaApiQuery(wikiTitle));

            /**
             * Drills down in return value in order to get the image
             */
            const pages = get(result, 'data.query.pages');
            if (pages) {
                const pagesValue = Object.values(pages)[0];
                const avatar = get(pagesValue, 'original.source');
                if (avatar) {
                    // Inserts the image url to the avatar column of drivers
                    await DBService.getEntityManager().query('UPDATE "drivers" set avatar = $1 where "driverId" = $2::int', [avatar, driverId]);
                }
            }
        })
    );

    logger.info('DRIVERS AVATARS SUCCESSFULLY INSERTED');
};
