import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { UserService } from './users.service';
  import { PostService } from '../posts/posts.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  
  @Controller('users')
  export class UserController {
    constructor(
      private readonly userService: UserService,
      private readonly postService: PostService,
    ) {}
  
    // *** CREATE: Add a new user ***
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
      try {
        return await this.userService.createUser(createUserDto);
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // *** READ: Get users with age > 49 ***
    @Get('old-users')
    async getOldUsers() {
      try {
        const filter = { age: { $gt: 49 } };
        return await this.userService.getAllUsers(filter);
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // *** READ: Get all users ***
    @Get()
    async getAllUsers(@Query() query: Record<string, any>) {
      try {
        return await this.userService.getAllUsers(query);
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // *** READ: Get a user by ID ***
    @Get(':id')
    async getUserById(@Param('id') id: string) {
      try {
        const user = await this.userService.getUserById(id);
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // *** UPDATE: Update a user by ID ***
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      try {
        const user = await this.userService.updateUser(id, updateUserDto);
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // *** DELETE: Delete a user by ID ***
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
      try {
        return await this.userService.deleteUser(id);
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // *** READ: Get all posts for a specific user ***
    @Get(':user_id/posts')
    async getPostsByUserId(@Param('user_id') userId: string) {
      try {
        return await this.postService.getPostsByUserId(userId);
      } catch (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  