import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient( uri );

( async () =>
{
    try {
        await client.connect();
        console.log( "Connected to MongoDB" );
        const db = client.db( "myDatabase" ); // Replace with your database name
        const users = await db.collection( "users" ).find().toArray();
        console.log( "Users:", users ); // Logs all documents in the 'users' collection
    } catch ( error ) {
        console.error( "Error:", error );
    } finally {
        await client.close();
    }
} )();
