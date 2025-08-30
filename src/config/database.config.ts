import { DataSource, DataSourceOptions } from "typeorm";

export const getDatabaseConfig = (): DataSourceOptions => {
  const baseConfig = {
    synchronize: false,
    migrations: ['migrations/*.js']
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        ...baseConfig,
        type: 'better-sqlite3',
        database: 'db.sqlite',
        entities: ['**/*.entity.js']
      };

    case 'test':
      return {
        ...baseConfig,
        type: 'better-sqlite3',
        database: 'test.sqlite',
        entities: ['**/*.entity.ts'],
        migrationsRun: true
      };

    case 'production':
      return {
        ...baseConfig,
        type: 'postgres',
        url: process.env.DATABASE_URL,
        migrationsRun: true,
        entities: ['**/*.entity.js'],
        ssl: {
          rejectUnauthorized: false
        }
      }
      break

    default:
      throw new Error('environment undefined');
  }
};

export const AppDataSource = new DataSource(getDatabaseConfig());