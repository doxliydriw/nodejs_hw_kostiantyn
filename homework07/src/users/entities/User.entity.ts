import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Post } from '../../posts/entities/Posts.entity';
import { Comment } from '../../comments/entities/Comments.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @Column('integer')
  age: number;

  @Column('text')
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
