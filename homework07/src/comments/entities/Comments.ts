import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Relation, Index, JoinColumn } from "typeorm"
import { User } from "../../users/entities/User"
import { Post } from "../../posts/entities/Posts"

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column("text")
    content: string;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    author: Relation<User>;

    @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "post_id" })
    post: Relation<Post>;
}
