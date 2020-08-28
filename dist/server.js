"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const addDdosProtraction = (app) => {
    const limiter = express_rate_limit_1.default({
        windowMs: 15 * 60 * 1000,
        max: 100 // limit each IP to 100 requests per windowMs
    });
    app.use(limiter);
};
const adjustSecureHeaders = (app) => {
    app.use(helmet_1.default());
};
const addHttpLogging = (app) => {
    app.use(morgan_1.default('combined'));
};
const expressApp = express_1.default();
addDdosProtraction(expressApp);
adjustSecureHeaders(expressApp);
addHttpLogging(expressApp);
logger_1.initLogger();
const port = process.env.PORT || 3000;
expressApp.listen(port, () => {
    logger.info(`App is listening on port ${port}!`);
});
