import { Router, Request, Response } from "express";
import { userService } from "../services/UserService";
import { postService } from "../services/PostService";

const userRouter = Router();

// *** CREATE: Add a new user ***
userRouter.post( "/", async ( req: Request, res: Response ) =>
{
    const { name, email, age } = req.body;
    try {
        const user = await userService.createUser( { name, email, age } );
        res.status( 201 ).json( user );
    } catch ( err ) {
        res.status( 500 ).json( { error: err.message } );
    }
} );

// *** READ: Get users with age > 49 ***
userRouter.get( "/old-users", async ( req: Request, res: Response ) =>
{
    try {
        // example of complex filter
        const filter = {
            age: {
                $gt: 49
            }
        };
        const users = await userService.getAllUsers( filter );
        res.json( users );
    } catch ( err ) {
        res.status( 500 ).json( { error: err.message } );
    }
} );

// *** READ: Get all users ***
userRouter.get( "/", async ( req: Request, res: Response ) =>
{
    try {
        console.log( "Query parameters received:", req.query ); // Debug log
        const users = await userService.getAllUsers( req.query );
        console.log( "Users returned to client:", users ); // Debug log
        res.json( users );
    } catch ( err ) {
        console.error( "Error in /api/v1/users:", err.message ); // Debug log
        res.status( 500 ).json( { error: err.message } );
    }
} );

// *** READ: Get a user by ID ***
userRouter.get( "/:id", async ( req: Request, res: Response ) =>
{
    const { id } = req.params;
    try {
        const user = await userService.getUserById( id );
        if ( !user ) {
            res.status( 404 ).json( { error: "User not found" } );
            return;
        }
        res.json( user );
    } catch ( err ) {
        res.status( 500 ).json( { error: err.message } );
    }
} );

// *** UPDATE: Update a user by ID ***
userRouter.put( "/:id", async ( req: Request, res: Response ) =>
{
    const { id } = req.params;
    const { name, email, age } = req.body;
    try {
        const user = await userService.updateUser( id, { name, email, age } );
        res.json( user );
    } catch ( err ) {
        res.status( 500 ).json( { error: err.message } );
    }
} );

// *** DELETE: Delete a user by ID ***
userRouter.delete( "/:id", async ( req: Request, res: Response ) =>
{
    const { id } = req.params;
    try {
        const message = await userService.deleteUser( id );
        res.json( message );
    } catch ( err ) {
        res.status( 500 ).json( { error: err.message } );
    }
} );

userRouter.get( "/:user_id/posts", async ( req: Request, res: Response ) =>
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

export default userRouter;