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
  Logger,
} from '@nestjs/common';
import { UserService } from './users.service';
import { PostService } from '../posts/posts.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name); // ✅ Logger instance

  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  // *** CREATE: Add a new user ***
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (err: unknown) {
      this.logger.error('Error creating user', err); // ✅ Log error
      throw new HttpException(
        err instanceof Error ? err.message : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // *** READ: Get users with age > 49 ***
  @Get('old-users')
  async getOldUsers() {
    try {
      const filter = { age: { $gt: 49 } };
      return await this.userService.getAllUsers(filter);
    } catch (err: unknown) {
      this.logger.error('Error fetching old users', err);
      throw new HttpException(
        err instanceof Error ? err.message : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // *** READ: Get all users ***
  @Get()
  async getAllUsers(@Query() query: Record<string, any>) {
    try {
      return await this.userService.getAllUsers(query);
    } catch (err: unknown) {
      this.logger.error('Error fetching all users', err);
      throw new HttpException(
        err instanceof Error ? err.message : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
    } catch (err: unknown) {
      this.logger.error(`Error fetching user with ID ${id}`, err);
      throw new HttpException(
        err instanceof Error ? err.message : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // *** UPDATE: Update a user by ID ***
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.updateUser(id, updateUserDto);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (err: unknown) {
      this.logger.error(`Error updating user with ID ${id}`, err);
      throw new HttpException(
        err instanceof Error ? err.message : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // *** DELETE: Delete a user by ID ***
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.userService.deleteUser(id);
    } catch (err: unknown) {
      this.logger.error(`Error deleting user with ID ${id}`, err);
      throw new HttpException(
        err instanceof Error ? err.message : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // *** READ: Get all posts for a specific user ***
  @Get(':user_id/posts')
  async getPostsByUserId(@Param('user_id') userId: string) {
    try {
      return await this.postService.getPostsByUserId(userId);
    } catch (err: unknown) {
      this.logger.error(`Error fetching posts for user ID ${userId}`, err);
      throw new HttpException(
        err instanceof Error ? err.message : 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
