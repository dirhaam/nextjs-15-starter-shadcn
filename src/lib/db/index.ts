import type { D1Database } from '@cloudflare/workers-types';

import * as schema from './schema';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';

// Edge-safe D1 DB creation (no better-sqlite3)
export function createD1Db(d1: D1Database): DrizzleD1Database<typeof schema> {
    return drizzle(d1, { schema });
}

export type D1DatabaseType = DrizzleD1Database<typeof schema>;
