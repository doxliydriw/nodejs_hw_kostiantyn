import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Relation, Index, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity("post")
export class Post {
    @PrimaryGeneratedColumn("increment")
    id: number

    @Index()
    @Column("text")
    title: string

    @Column("text")
    content: string

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: "user_id" })
    author: User;
}
