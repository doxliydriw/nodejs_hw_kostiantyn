import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/Posts';
import { User } from '../users/entities/User';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  // Create a new POST
  async createPost(data: CreatePostDto): Promise<Post> {
    try {
      const post = this.postRepository.create(data);
      return await this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException('Unable to create post', error.message);
    }
  }

  // Get Post by ID
  async getPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: parseInt(id, 10) },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  // Edit an existing POST
  async editPost(id: string, data: UpdatePostDto): Promise<Post> {
    const post = await this.getPostById(id); // Reuse `getPostById` for consistency
    if (data.title) {
      post.title = data.title;
    }
    if (data.content) {
      post.content = data.content;
    }
    return this.postRepository.save(post);
  }

  // Delete a POST
  async deletePost(id: string): Promise<{ message: string }> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return { message: 'Post deleted successfully' };
  }

  // Get All Posts
  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['author'] });
  }

  // Get All Posts by USER's ID
  async getPostsByUserId(userId: string): Promise<Post[]> {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    return this.postRepository.find({
      where: { author: { id } },
      relations: ['author'],
    });
  }
}
