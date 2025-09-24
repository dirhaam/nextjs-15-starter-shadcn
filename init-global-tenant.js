const Database = require('better-sqlite3');
const path = require('path');

// Connect to the local database
const dbPath = path.join(__dirname, 'local.db');
const db = new Database(dbPath);

// Create tables if they don't exist
console.log('Creating tables...');

db.exec(`
CREATE TABLE IF NOT EXISTS tenants (
    id text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    name text NOT NULL,
    subdomain text NOT NULL UNIQUE,
    domain text,
    description text,
    logo text,
    primary_color text,
    secondary_color text,
    font_family text,
    currency text DEFAULT 'USD',
    language text DEFAULT 'en',
    timezone text DEFAULT 'UTC',
    created_at integer NOT NULL,
    updated_at integer NOT NULL
);

CREATE TABLE IF NOT EXISTS user (
    id text PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    email text NOT NULL UNIQUE,
    password text,
    name text,
    role text NOT NULL DEFAULT 'user',
    tenant_id text NOT NULL REFERENCES tenants(id),
    is_active integer DEFAULT 1,
    created_at integer NOT NULL,
    updated_at integer NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
    id text PRIMARY KEY,
    user_id text NOT NULL REFERENCES user(id),
    token text NOT NULL UNIQUE,
    expires_at integer NOT NULL,
    ip_address text,
    user_agent text,
    created_at integer NOT NULL,
    tenant_id text
);

CREATE TABLE IF NOT EXISTS account (
    id text PRIMARY KEY,
    user_id text NOT NULL REFERENCES user(id),
    account_id text NOT NULL,
    provider_id text NOT NULL,
    access_token text,
    refresh_token text,
    access_token_expires_at integer,
    refresh_token_expires_at integer,
    scope text,
    id_token text,
    password text,
    created_at integer NOT NULL,
    updated_at integer NOT NULL
);

CREATE TABLE IF NOT EXISTS verification (
    id text PRIMARY KEY,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at integer NOT NULL,
    created_at integer NOT NULL,
    updated_at integer NOT NULL
);
`);

// Check if global tenant exists
const existingTenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get('global');

if (!existingTenant) {
    console.log('Creating global tenant...');

    const now = Date.now();

    db.prepare(
        `
        INSERT INTO tenants (id, name, subdomain, description, primary_color, secondary_color, font_family, currency, language, timezone, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
        'global',
        'Global Admin',
        'admin',
        'Global administration tenant',
        '#3b82f6',
        '#6366f1',
        'Inter',
        'USD',
        'en',
        'UTC',
        now,
        now
    );

    console.log('Global tenant created successfully');
} else {
    console.log('Global tenant already exists');
}

db.close();
