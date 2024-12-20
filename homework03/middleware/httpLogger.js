import Logger from '../utils/logger.js';

const logger = new Logger('app');

const httpLogger = (req, res, next) =>
{
    const timestamp = new Date().toISOString();
    logger.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
}

export default httpLogger;