import { Router, Request, Response } from "express";
import { postService } from "../services/PostService";
import { body, validationResult } from "express-validator";

const postRouter = Router();

// Create POST
postRouter.post(
    "/",
    [
        body("title")
            .isString()
            .isLength({ min: 2, max: 100 })
            .withMessage("Title must be between 2 and 100 characters"),
        body("content")
            .isString()
            .isLength({ min: 10 })
            .withMessage("Content must be at least 10 characters"),
        body("author")
            .isString()
            .notEmpty()
            .withMessage("Author ID is obligatory"),
    ],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { title, content, author } = req.body;

        try {
            const post = await postService.createPost({ title, content, author });
            res.status(201).json(post);
        } catch (err) {
            console.error("Error creating post:", err.message);
            res.status(500).json({ error: "Unable to create post" });
        }
    }
);

// Edit POST
postRouter.put(
    "/:post_id",
    [
        body("title")
            .optional()
            .isString()
            .isLength({ min: 2, max: 100 })
            .withMessage("Title must be between 2 and 100 characters"),
        body("content")
            .optional()
            .isString()
            .isLength({ min: 10 })
            .withMessage("Content must be at least 10 characters"),
    ],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { post_id } = req.params;
        const { title, content } = req.body;

        try {
            const post = await postService.editPost(post_id, { title, content });
            console.log("we found this: ", post);

            if (!post) {
                res.status(404).json({ error: "Post not found" });
                return;
            }

            res.status(200).json(post);
        } catch (err: any) {
            console.error(`Error updating post with ID ${post_id}:`, err.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);
// Delete POST
postRouter.delete( "/:post_id", async ( req: Request, res: Response ) =>
{
    const { post_id } = req.params;
    try {
        const message = await postService.deletePost( post_id );
        res.json( message );
    } catch ( err ) {
        res.status( 500 ).json( { error: err.message } );
    }
} );
// Get Post by ID
postRouter.get( "/:post_id", async ( req: Request, res: Response ) =>
    {
        const { post_id } = req.params;
        try {
            const post = await postService.getPostById( post_id );
            res.json( post );
        } catch ( err ) {
            console.error( `Error in /api/v1/posts/${post_id}`, err.message );
            res.status( 500 ).json( { error: err.message } );
        }
    } );
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
        console.error( `Error in /api/v1/posts/user/${user_id}:`, err.message );
        res.status( 500 ).json( { error: err.message } );
    }
} );
export default postRouter;
