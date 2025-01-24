import { db } from "./DatabaseService";
import { ObjectId } from "mongodb";

export class PostService
{
    // Create a new POST
    async createPost(data: { title: string; content: string; author: string }): Promise<any> {
        try {
            const result = await db.collection("posts").insertOne({
                title: data.title,
                content: data.content,
                author: new ObjectId(data.author),
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return {
                id: result.insertedId.toString(),
                title: data.title,
                content: data.content,
                author: data.author,
            };
        } catch (error) {
            console.error("Error creating post:", error);
            throw new Error("Unable to create post");
        }
    }
    // Edit an existing post
    async editPost(postId: string, data: { title?: string; content?: string }): Promise<any> {
        try {
            const updateData: Record<string, any> = { updatedAt: new Date() };
            if (data.title) updateData.title = data.title;
            if (data.content) updateData.content = data.content;
            console.log('we want to update this: ', updateData, `with ${postId}`);
            
            const result = await db.collection("posts").findOneAndUpdate(
                { _id: new ObjectId(postId) },
                { $set: updateData },
                { returnDocument: "after" }
            );
            console.log('db result is: ', result);
            
            if (!result) {
                throw new Error(`Post with ID ${postId} not found`);
            }
            console.log(result);
            return result;
        } catch (error) {
            console.error(`Error editing post with ID ${postId}:`, error);
            throw new Error("Unable to edit the post");
        }
    }

    // Delete a post
    async deletePost(postId: string): Promise<boolean> {
        try {
            const result = await db.collection("posts").deleteOne({ _id: new ObjectId(postId) });
            if (result.deletedCount === 0) {
                throw new Error(`Post with ID ${postId} not found`);
            }
            return true;
        } catch (error) {
            console.error(`Error deleting post with ID ${postId}:`, error);
            throw new Error("Unable to delete the post");
        }
    }
    // Get All Posts
    async getAllPosts (): Promise<any[]>
    {
        try {
            return await db.collection( "posts" ).find().toArray();
        } catch ( error ) {
            console.error( "Error fetching posts:", error );
            throw new Error( "Unable to fetch posts" );
        }
    }
    // Get All Posts by USER's ID 
    async getPostsByUserId ( userId: string ): Promise<any[]>
    {
        try {
            // Validate userId
            if (!ObjectId.isValid(userId)) {
                throw new Error("Invalid userId format");
            }
    
            // Query the database
            const query = { author: new ObjectId(userId) };
            return await db.collection("posts").find(query).toArray();
        } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error);
            throw new Error("Unable to fetch posts for the user");
        }
    }
    // Get Post by ID
    async getPostById(postId: string): Promise<any> {
        try {
            const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
            if (!post) {
                throw new Error(`Post with ID ${postId} not found`);
            }
            return post;
        } catch (error) {
            console.error(`Error fetching post with ID ${postId}:`, error);
            throw new Error("Unable to fetch the post");
        }
    } 
}

export const postService = new PostService();
