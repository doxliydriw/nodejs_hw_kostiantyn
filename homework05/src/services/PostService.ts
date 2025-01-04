import { db } from "./DatabaseService";
import { ObjectId } from "mongodb";

export class PostService
{
    // Use the shared `db` directly
    async getAllPosts (): Promise<any[]>
    {
        try {
            return await db.collection( "posts" ).find().toArray();
        } catch ( error ) {
            console.error( "Error fetching posts:", error );
            throw new Error( "Unable to fetch posts" );
        }
    }

    async getPostsByUserId ( userId: string ): Promise<any[]>
    {
        try {
            return await db.collection( "posts" ).find( { authorId: new ObjectId( userId ) } ).toArray();
        } catch ( error ) {
            console.error( `Error fetching posts for user ${userId}:`, error );
            throw new Error( "Unable to fetch posts for the user" );
        }
    }
}

export const postService = new PostService();
