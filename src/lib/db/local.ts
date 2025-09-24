import * as schema from './schema';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';

let dbInstance: BetterSQLite3Database<typeof schema> | undefined;
let BetterSqlite3: any;

export async function createLocalDb(): Promise<BetterSQLite3Database<typeof schema>> {
    if (!BetterSqlite3) {
        // @ts-expect-error Dynamic import types for better-sqlite3
        const betterSqlite3Module = (await import('better-sqlite3')) as any;
        BetterSqlite3 = betterSqlite3Module.default;
    }

    if (!dbInstance) {
        const sqlite = new BetterSqlite3('./local.db');
        dbInstance = drizzleSQLite(sqlite, { schema });
    }

    return dbInstance!;
}

export type LocalDatabaseType = BetterSQLite3Database<typeof schema>;
