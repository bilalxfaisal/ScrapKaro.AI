import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;

export function createDrizzleDatabase(
  configService: ConfigService,
): Database {
  const pool = new Pool({
    connectionString: configService.get<string>('DATABASE_URL'),
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return drizzle(pool, { schema });
}