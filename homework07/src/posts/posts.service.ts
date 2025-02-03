import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new POST
  async createPost(data: CreatePostDto): Promise<Post> {
    try {
      const user = await this.userRepository.findOneBy({ id: data.author });
      if (!user) {
        throw new BadRequestException('Author not found');
      }
      const post = this.postRepository.create({ ...data, author: user });
      return await this.postRepository.save(post);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Unable to create post: ${error.message}`,
        );
      }
      throw new BadRequestException('Unable to create post');
    }
  }

  // Get Post by ID
  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  // Edit an existing POST
  async editPost(id: number, data: UpdatePostDto): Promise<Post> {
    const post = await this.getPostById(id);
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
