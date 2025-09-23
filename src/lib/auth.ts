import { createDb } from './db';
import * as schema from './db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
    database: (ctx: any) => {
        // Get D1 from global (in Cloudflare Workers/Next.js with D1 binding)
        const d1 = (globalThis as any).D1;
        if (!d1) throw new Error('D1 database not found');
        const db = createDb(d1);

        return drizzleAdapter(db, {
            provider: 'sqlite',
            schema
        });
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
