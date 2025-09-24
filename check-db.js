const Database = require('better-sqlite3');
const path = require('path');

// Connect to the local database
const dbPath = path.join(__dirname, 'local.db');
const db = new Database(dbPath);

// Check if tenants table exists and has the global tenant
console.log('Checking tenants table...');
const tenants = db.prepare('SELECT * FROM tenants').all();
console.log('Tenants:', tenants);

console.log('\nChecking users table...');
const users = db.prepare('SELECT * FROM user').all();
console.log('Users count:', users.length);

console.log('\nChecking if global tenant exists...');
const globalTenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get('global');
console.log('Global tenant:', globalTenant);

console.log('\nChecking if test user exists...');
const testUser = db.prepare('SELECT * FROM user WHERE email = ?').get('dirhamrozi@gmail.com');
console.log('Test user:', testUser);

db.close();