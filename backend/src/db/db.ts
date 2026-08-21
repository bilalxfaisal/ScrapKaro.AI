import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;

export function createDrizzleDatabase(configService: ConfigService): Database {
  const pool = new Pool({
    connectionString: configService.get<string>('DATABASE_URL'),
    ssl: {
      rejectUnauthorized: false,
    },
  });
  console.log(
    'DB URL:',
    process.env.DATABASE_URL?.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@'),
  );
  return drizzle(pool, { schema });
}
