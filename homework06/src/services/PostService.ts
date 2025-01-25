import { Repository } from "typeorm";
import { appDataSource } from "./appDataSource";
import { User } from "../models/User";
import { Post } from "../models/Posts";

export class PostService
{
    private repository: Repository<Post>;

    constructor(){
        this.repository = appDataSource.getRepository(Post);
    }
    // Create a new POST
    async createPost(data: { title: string; content: string; author: User }) {
        const post = new Post();
        post.title = data.title;
        post.content = data.content;
        post.author = data.author;
        return this.repository.save(post);
      }
    // Get Post by ID
    async getPostById(id: string) {
        return this.repository.findOneBy({ id: parseInt(id) });
    }
    // Edit an existing post
    async editPost(id: string, data: { title?: string; content?: string }) {
        const post = await this.repository.findOneBy({ id: parseInt(id) });
        if (!post) {
            throw new Error(`Post with id ${id} not found!`);
        }
        if (data.title) {
            post.title = data.title;
        }
        if (data.content) {
            post.content = data.content;
        }
        return this.repository.save(post);
    }
    // Delete a post
    async deletePost(postId: string){
        return this.repository.delete(postId);
    }
    // Get All Posts
    async getAllPosts(filters: Record<string, any> = {}) {
        return this.repository.find(filters);
      }
    // Get All Posts by USER's ID 
    async getPostsByUserId(userId: string): Promise<Post[]> {
        const id = parseInt(userId, 10);
        if (isNaN(id)) {
            throw new Error("Invalid user ID format");
        }

        return this.repository.find({
            where: { author: { id } },
            relations: ["author"],
        });
    }
}

export const postService = new PostService();
