import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { PostService } from './posts.service';
  import { CreatePostDto } from './dto/create-post.dto';
  import { UpdatePostDto } from './dto/update-post.dto';
  
  @Controller('posts')
  export class PostController {
    constructor(private readonly postService: PostService) {}
  
    // Create a new POST
    @Post()
    async createPost(@Body() createPostDto: CreatePostDto) {
      try {
        const post = await this.postService.createPost(createPostDto);
        return post;
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Get Post by ID
    @Get(':id')
    async getPostById(@Param('id', ParseIntPipe) id: number) {
      try {
        const post = await this.postService.getPostById(id.toString());
        if (!post) {
          throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        return post;
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Edit an existing POST
    @Put(':id')
    async editPost(
      @Param('id', ParseIntPipe) id: number,
      @Body() updatePostDto: UpdatePostDto,
    ) {
      try {
        const updatedPost = await this.postService.editPost(
          id.toString(),
          updatePostDto,
        );
        return updatedPost;
      } catch (err) {
        if (err.message.includes('not found')) {
          throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Delete a POST
    @Delete(':id')
    async deletePost(@Param('id', ParseIntPipe) id: number) {
      try {
        const result = await this.postService.deletePost(id.toString());
        return { message: 'Post deleted successfully', result };
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Get All Posts
    @Get()
    async getAllPosts() {
      try {
        const posts = await this.postService.getAllPosts();
        return posts;
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Get All Posts by USER's ID
    @Get('user/:userId')
    async getPostsByUserId(@Param('userId', ParseIntPipe) userId: number) {
      try {
        const posts = await this.postService.getPostsByUserId(userId.toString());
        return posts;
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  