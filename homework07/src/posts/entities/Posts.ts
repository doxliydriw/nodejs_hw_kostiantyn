import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
  Index,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/User';
import { Comment } from '../../comments/entities/Comments';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column('text')
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Relation<Comment[]>;
}
