import { Router, Request, Response } from "express";
import { postService } from "../services/PostService";

const postRouter = Router();

// Get all posts
postRouter.get( "/", async ( req: Request, res: Response ) =>
{
    try {
        const posts = await postService.getAllPosts();
        res.json( posts );
    } catch ( err ) {
        console.error( "Error in /api/v1/posts:", err.message );
        res.status( 500 ).json( { error: err.message } );
    }
} );

// Get all posts for a specific user
postRouter.get( "/user/:user_id", async ( req: Request, res: Response ) =>
{
    const { user_id } = req.params;
    try {
        const posts = await postService.getPostsByUserId( user_id );
        res.json( posts );
    } catch ( err ) {
        console.error( `Error in /api/v1/users/${user_id}/posts:`, err.message );
        res.status( 500 ).json( { error: err.message } );
    }
} );

export default postRouter;
