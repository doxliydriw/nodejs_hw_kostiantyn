import config from "config";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import httpLogger from "./middleware/httpLogger";
import userRouter from "./routes/userRouter";
import { databaseService } from "./services/DatabaseService";
import logger from "./utils/logger";
import postRouter from "./routes/postRouter";
const { log, warn, error } = logger( "app" );

const app = express();
const PORT = config.get( "app.port" );
const HOSTNAME = config.get( "app.hostname" );

// Middleware for JSON parsing
app.use( express.json() );

// Custom Middleware
app.use( httpLogger );

app.get( "/", ( req: Request, res: Response ) =>
{
    res.send( "Hello, World!" );
} );

// Use the userRouter and set the base path to /api/v1/users
app.use( "/api/v1/users", userRouter );

// Add the post router for /api/v1/posts
app.use( "/api/v1/posts", postRouter );

// Global error handler
app.use( ( err, req: Request, res: Response, next: NextFunction ) =>
{
    error( "Error:", err.message );
    res.status( 500 ).json( { error: err.message } );
} );

// Test Database Connection and Start Server
( async () =>
{
    try {
        const isConnectionValid = await databaseService.testConnection();
        if ( !isConnectionValid ) {
            log( "Failed to connect to the database. Exiting..." );
            process.exit( 1 );
        }
        log( "Database connection successful. Starting server..." );
        app.listen( PORT, HOSTNAME, () =>
        {
            log( `Server is running on http://${HOSTNAME}:${PORT}` );
        } );
    } catch ( err ) {
        error( "Error during application startup:", err.message );
        process.exit( 1 );
    }
} )();

// Handle graceful shutdown
process.on( "SIGINT", handleShutdown );
process.on( "SIGTERM", handleShutdown );

async function handleShutdown ( signal: string ): Promise<void>
{
    log( `Received ${signal}. Closing MongoDB connection...` );
    await databaseService.disconnect();
    log( `${signal} handled. Exiting process.` );
    process.exit( 0 );
}
