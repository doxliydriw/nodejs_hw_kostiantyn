import { Db, ObjectId, WithId } from "mongodb";
import { db } from "./DatabaseService";

export class UserService
{
    private db: Db;

    constructor ( db: Db )
    {
        this.db = db;
    }

    // Method to get all users
    async getAllUsers ( filters: Record<string, any> = {} ): Promise<any[]>
    {
        try {
            console.log( "Filters received:", filters ); // Debug log
            const users = await this.db.collection( "users" ).find( filters ).toArray();
            console.log( "Users fetched from database:", users ); // Debug log
            return users;
        } catch ( error ) {
            console.error( "Error fetching users:", error );
            throw new Error( "Unable to fetch users" );
        }
    }

    // Method to get a user by ID
    async getUserById ( id: string )
    {
        return this.db.collection( "users" ).findOne( { _id: new ObjectId( id ) } );
    }

    // Method to create a new user
    async createUser ( data: { name: string; email: string; age: number; } )
    {
        const result = await this.db.collection( "users" ).insertOne( data );
        return { _id: result.insertedId, ...data };
    }

    // Method to update a user
    async updateUser ( id: string, data: { name?: string; email?: string; age?: number; } )
    {
        const result = await this.db.collection( "users" ).findOneAndUpdate(
            { _id: new ObjectId( id ) },
            { $set: data },
            { returnDocument: "after" }
        );
        return result?.value;
    }

    // Method to delete a user
    async deleteUser ( id: string )
    {
        const result = await this.db.collection( "users" ).deleteOne( { _id: new ObjectId( id ) } );
        return result.deletedCount > 0;
    }
}

export const userService = new UserService( db );