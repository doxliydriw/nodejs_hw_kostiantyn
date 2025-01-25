import "reflect-metadata";
import getLogger from "../utils/logger";
import { appDataSource } from "./appDataSource";
import { DataSource } from "typeorm"

const logger = getLogger("db");

export class DatabaseService {

  async connect(): Promise<DataSource> {
    try {
      await appDataSource.initialize();
      logger.log("Connected to PostgreSQL");
      return appDataSource;
    } catch (error) {
      logger.error("Failed to connect to PostgreSQL", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await appDataSource.destroy();
      logger.log("Disconnected from PostgreSQL");
    } catch (error) {
      logger.error("Failed to disconnect from PostgreSQL", error);
    }
  }
}
export const databaseService = new DatabaseService();
const db = await databaseService.connect();