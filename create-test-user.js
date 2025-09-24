const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Connect to the local database
const dbPath = path.join(__dirname, 'local.db');
const db = new Database(dbPath);

console.log('Creating test user...');

const email = 'dirhamrozi@gmail.com';
const password = '12345Nabila';
const name = 'Dirham Rozi';

// Check if user already exists
const existingUser = db.prepare('SELECT * FROM user WHERE email = ?').get(email);

if (!existingUser) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const now = Date.now();

    db.prepare(
        `
        INSERT INTO user (email, password, name, role, tenant_id, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(email, hashedPassword, name, 'user', 'global', 1, now, now);

    console.log('Test user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
} else {
    console.log('Test user already exists');
}

db.close();
