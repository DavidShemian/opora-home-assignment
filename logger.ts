import winston, { Logger } from "winston";

const logger: Logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

export const initLogger = () => {
  const tempGlobal: any = global;
  tempGlobal.logger = logger;
};
