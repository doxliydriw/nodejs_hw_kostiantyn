import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/User';
import { Post } from '../posts/entities/Posts';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  // Method to get all users
  async getAllUsers(filters: Record<string, any> = {}): Promise<User[]> {
    return this.userRepository.find(filters);
  }

  // Method to get all users with Posts
  async getUsersWithPosts(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
    });
  }

  // Method to get a user by ID
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: parseInt(id) });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // Method to get a user by email
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // Method to create a new user
  async createUser(data: { name: string; email: string; age: number }): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  // Method to update a user
  async updateUser(id: string, data: { name?: string; email?: string; age?: number }): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: parseInt(id) });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  // Method to delete a user
  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
