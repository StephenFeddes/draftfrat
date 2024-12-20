import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { createClient } from "redis";

export const databaseConnectionPool = new Pool({
    connectionString: process.env.POSTGRES_DATABASE_URL,
});
export const db = drizzle({ client: databaseConnectionPool });

export const redisClient = createClient({ url: process.env.REDIS_URL });
