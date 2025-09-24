import { createD1Db } from './db';
import { createLocalDb } from './db/local';
import * as schema from './db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
    secret: process.env.AUTH_SECRET!,
    database: async (ctx: any) => {
        // Get D1 from global (in Cloudflare Workers/Next.js with D1 binding)
        const d1 = (globalThis as any).D1;
        if (d1) {
            const db = createD1Db(d1);

            return drizzleAdapter(db, {
                provider: 'sqlite',
                schema
            });
        } else {
            // Local fallback
            const localDb = await createLocalDb();

            return drizzleAdapter(localDb, {
                provider: 'sqlite',
                schema
            });
        }
    },
    multiTenant: {
        enabled: true,
        tenant: {
            table: 'tenants',
            column: 'id'
        }
    },
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            tenantId: {
                type: 'string',
                required: true
            },
            role: {
                type: 'string',
                required: true,
                defaultValue: 'user'
            }
        }
    },
    session: {
        additionalFields: {
            tenantId: {
                type: 'string'
            }
        }
    }
});
