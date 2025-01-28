import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Relation, Index } from "typeorm"
import { Post } from "../../posts/entities/Posts"
import { Comment } from "../../comments/entities/Comments";


@Entity("users")
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Index()
    @Column("text")
    name: string

    @Column("text")
    email: string

    @Column("integer")
    age: number

    @OneToMany(() => Post, (post: Post) => post.author)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Relation<Comment[]>;
}