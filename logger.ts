import { Logger, createLogger, format, transports } from "winston";
const { combine, timestamp, prettyPrint } = format;

const logger: Logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
    format.splat(),
    format.errors({ stack: true }),
    format.colorize({ all: true })
  ),
  transports: [new transports.Console()],
});

export const initLogger = () => {
  const tempGlobal: any = global;
  tempGlobal.logger = logger;

  logger.info("logger initialized");
};
