import { DataSource } from 'typeorm';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        port: 5432,
        url: process.env['DATABASE_URL'],
        entities: [
          path.join(__dirname, '/../**/entities/*{.ts,.js}'), // Dynamically include entity files
        ],
        synchronize: true, // update false in production
      });

      return dataSource.initialize();
    },
  },
];