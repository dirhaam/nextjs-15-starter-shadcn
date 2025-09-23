import type { D1Database } from '@cloudflare/workers-types';

import * as schema from './schema';
import { drizzle } from 'drizzle-orm/d1';

export function createDb(d1: D1Database) {
    return drizzle(d1, { schema });
}

export type Database = ReturnType<typeof createDb>;
