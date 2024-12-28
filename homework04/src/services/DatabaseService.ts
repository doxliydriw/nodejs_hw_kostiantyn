import { MongoClient, Db } from "mongodb";
import config from "config";
import getLogger from "../utils/logger";
const logger = getLogger( "db" );

export class DatabaseService
{
    private uri: string;
    private dbName: string;
    private client: MongoClient;

    constructor ( uri: string, dbName: string )
    {
        this.uri = uri;
        this.dbName = dbName;
        this.client = new MongoClient( this.uri );
    }

    async connect (): Promise<Db>
    {
        try {
            await this.client.connect();
            logger.log( "Connected to MongoDB" );
            return this.client.db( this.dbName );
        } catch ( error ) {
            logger.error( "Failed to connect to MongoDB", error );
            throw error;
        }
    }

    async disconnect (): Promise<void>
    {
        try {
            await this.client.close();
            logger.log( "Disconnected from MongoDB" );
        } catch ( error ) {
            logger.error( "Failed to disconnect from MongoDB", error );
        }
    }

    async testConnection (): Promise<boolean>
    {
        try {
            await this.client.connect();
            logger.log( "Successfully connected to MongoDB" );
            await this.client.db( this.dbName ).command( { ping: 1 } ); // Ping the database
            logger.log( "Ping to MongoDB succeeded" );
            return true;
        } catch ( error ) {
            logger.error( "MongoDB connection failed", error );
            return false;
        }
    }
}
const databaseUrl = config.get( "database.url" );
console.log( databaseUrl );

export const databaseService = new DatabaseService( databaseUrl, "myDatabase" );
export const db = await databaseService.connect();