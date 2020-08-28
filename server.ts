import { initLogger } from "./logger";
import express, { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

const addDdosProtraction = (app: Express) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });

  app.use(limiter);
};

const adjustSecureHeaders = (app: Express) => {
  app.use(helmet());
};

const addHttpLogging = (app: Express) => {
  app.use(morgan("combined"));
};

const expressApp: Express = express();

addDdosProtraction(expressApp);
adjustSecureHeaders(expressApp);
addHttpLogging(expressApp);
initLogger();

const port = process.env.PORT || 3000;

expressApp.listen(port, () => {
  logger.info(`App is listening on port ${port}!`);
});
