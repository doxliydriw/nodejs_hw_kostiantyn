import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Relation, Index } from "typeorm"
import { Post } from "../models/Posts"


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
}