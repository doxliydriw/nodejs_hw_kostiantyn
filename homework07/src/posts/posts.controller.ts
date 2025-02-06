import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PostService } from './posts.service';
import { Post as PostEntity } from './entities/Posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor) //  Automatically formats responses
export class PostController {
  constructor(private readonly postService: PostService) {}

  //  Create a new POST
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    try {
      return await this.postService.createPost(createPostDto);
    } catch (err: unknown) {
      Logger.error(err); // Logs the full error object
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new HttpException(
        { message: 'Unable to create post', error: errorMessage },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //  Get Post by ID (Handles errors properly)
  @Get(':id')
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostEntity> {
    const post = await this.postService.getPostById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  //  Edit an existing POST (Handles not found error correctly)
  @Put(':id')
  async editPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    try {
      return await this.postService.editPost(id, updatePostDto);
    } catch (err: unknown) {
      Logger.error(err); // Logs the full error object

      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      throw new HttpException(
        { message: 'Unable to edit post', error: errorMessage },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //  Delete a POST
  @Delete(':id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    try {
      await this.postService.deletePost(id.toString()); // Convert number to string
      return { message: `Post with ID ${id} deleted successfully` };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      throw new HttpException(
        { message: 'Unable to delete post', error: errorMessage },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //  Get All Posts (Uses DTO for cleaner responses)
  @Get()
  async getAllPosts(): Promise<PostEntity[]> {
    return await this.postService.getAllPosts();
  }

  //  Get All Posts by User ID (Handles invalid IDs correctly)
  @Get('user/:userId')
  async getPostsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PostEntity[]> {
    return await this.postService.getPostsByUserId(userId.toString()); // Convert number to string
  }
}
