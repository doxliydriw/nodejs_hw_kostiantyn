import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { Post } from '../posts/entities/Posts';
import { UserService } from './users.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, Post])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}