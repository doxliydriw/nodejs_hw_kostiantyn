import { Router, Request, Response } from "express";
import { userService } from "../services/UserService";
import { postService } from "../services/PostService";
import { body, validationResult } from "express-validator";

const userRouter = Router();

// *** CREATE: Add a new user ***
userRouter.post(
    "/",
    [
        body("name")
            .isString()
            .isLength({ min: 2, max: 30 })
            .withMessage("Name must be between 2 and 30 characters"),
        body("email").isEmail().withMessage("Email must be a valid email address"),
        body("age").isNumeric().withMessage("Age must be a number"),
    ],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { name, email, age } = req.body;
        try {
            const user = await userService.createUser({ name, email, age });
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// *** READ: Get users with age > 49 ***
userRouter.get("/old-users", async (req: Request, res: Response): Promise<void> => {
    try {
        const filter = { age: { $gt: 49 } };
        const users = await userService.getAllUsers(filter);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *** READ: Get all users ***
userRouter.get("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAllUsers(req.query);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *** READ: Get a user by ID ***
userRouter.get("/:id", async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *** UPDATE: Update a user by ID ***
userRouter.put(
    "/:id",
    [
        body("name")
            .optional()
            .isString()
            .isLength({ min: 2, max: 30 })
            .withMessage("Name must be between 2 and 30 characters"),
        body("email").optional().isEmail().withMessage("Email must be a valid email address"),
        body("age").optional().isNumeric().withMessage("Age must be a number"),
    ],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { id } = req.params;
        const { name, email, age } = req.body;

        try {
            const user = await userService.updateUser(id, { name, email, age });
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// *** DELETE: Delete a user by ID ***
userRouter.delete("/:id", async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const message = await userService.deleteUser(id);
        res.json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *** READ: Get all posts for a specific user ***
userRouter.get("/:user_id/posts", async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;
    try {
        const posts = await postService.getPostsByUserId(user_id);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default userRouter;
