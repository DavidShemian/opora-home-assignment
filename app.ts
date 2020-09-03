import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import 'reflect-metadata';
import { initLogger } from './logger';
import { config } from './src/configs/config';
import { AuthenticationController } from './src/controllers/authentication-controller';
import { DriverController } from './src/controllers/driver-controller';
import { handleError } from './src/middlewares/error-middleware';
import { DBService } from './src/services/db-service';

export class App {
    private app: Express;

    constructor() {
        this.app = express();

        this.initApp();
    }

    public listen(): void {
        const port = config.SERVER_PORT;

        this.app.listen(port, () => {
            logger.info(`App is listening on port ${port}!`);
        });
    }

    private addBodyParser(): void {
        this.app.use(bodyParser.json());
    }

    private addDDOSProtraction(): void {
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        });

        this.app.use(limiter);
    }

    private addErrorMiddleware(): void {
        this.app.use(handleError);
    }

    private addHttpLogging(): void {
        this.app.use(morgan('combined'));
    }

    private adjustSecureHeaders(): void {
        this.app.use(helmet());
    }

    private EnableCORS(): void {
        this.app.use(cors({ origin: [/localhost/i] }));
    }

    private async initApp(): Promise<void> {
        initLogger();
        await DBService.initDB();
        this.EnableCORS();
        this.addBodyParser();
        this.addDDOSProtraction();
        this.adjustSecureHeaders();
        this.addHttpLogging();
        this.initializeControllers();
        this.addErrorMiddleware();
        this.listen();
    }

    private initializeControllers(): void {
        const router = express.Router();
        const controllers = [new DriverController(router), new AuthenticationController(router)];

        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
}
