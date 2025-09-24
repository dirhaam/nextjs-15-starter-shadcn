import * as schema from './schema';
// @ts-expect-error Dynamic import types for better-sqlite3
import BetterSqlite3 from 'better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';

export function createLocalDb(): BetterSQLite3Database<typeof schema> {
    // Create a new instance each time to avoid potential connection issues in Next.js
    const sqlite = new BetterSqlite3('./local.db');
    const db = drizzleSQLite(sqlite, { schema });

    return db;
}

export type LocalDatabaseType = BetterSQLite3Database<typeof schema>;
