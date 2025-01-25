import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Post } from "../models/Posts"

import config from "config";

export const appDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    url: config.get("database.url"),
    synchronize: true,
    logging: true,
    entities: [User, Post],
    subscribers: [],
    migrations: [],
})