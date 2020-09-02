import { DriverController } from "./src/controllers/driver-controlle";
import { handleError } from "./src/middlewares/error-middleware";
import { DBService } from "./src/services/db-service";
import { config } from "./src/configs/config";
import "reflect-metadata";
import { initLogger } from "./logger";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

export class App {
  private app: Express;

  constructor() {
    this.app = express();

    this.initApp();
  }

  public listen() {
    const port = config.SERVER_PORT;

    this.app.listen(port, () => {
      logger.info(`App is listening on port ${port}!`);
    });
  }

  private addDDOSProtraction() {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    });

    this.app.use(limiter);
  }

  private addErrorMiddleware() {
    this.app.use(handleError);
  }

  private addHttpLogging() {
    this.app.use(morgan("combined"));
  }

  private adjustSecureHeaders() {
    this.app.use(helmet());
  }

  private EnableCORS() {
    this.app.use(cors({ origin: [/localhost/i] }));
  }

  private async initApp() {
    initLogger();
    await DBService.initDB();
    this.EnableCORS();
    this.addDDOSProtraction();
    this.adjustSecureHeaders();
    this.addHttpLogging();
    this.initializeControllers();
    this.addErrorMiddleware();
  }

  private initializeControllers() {
    const router = express.Router();
    const controllers = [new DriverController(router)];

    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
}
