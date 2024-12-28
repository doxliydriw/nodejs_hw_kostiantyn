import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
const { log } = logger( "app" );


const httpLogger = ( req: Request, res: Response, next: NextFunction ) =>
{
    log( `[${new Date().toISOString()}] ${req.method} ${req.url}` );
    next();
};

export default httpLogger;