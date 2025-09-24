import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tenants = sqliteTable('tenants', {
    id: text('id')
        .primaryKey()
        .default(sql`uuid()`),
    name: text('name').notNull(),
    subdomain: text('subdomain').notNull().unique(),
    domain: text('domain'),
    description: text('description'),
    logo: text('logo'),
    primaryColor: text('primary_color'),
    secondaryColor: text('secondary_color'),
    fontFamily: text('font_family'),
    currency: text('currency').default('USD'),
    language: text('language').default('en'),
    timezone: text('timezone').default('UTC'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const user = sqliteTable('user', {
    id: text('id')
        .primaryKey()
        .default(sql`uuid()`),
    email: text('email').notNull().unique(),
    password: text('password'),
    name: text('name'),
    role: text('role').notNull().default('user'), // owner, staff, finance, user
    tenantId: text('tenant_id')
        .references(() => tenants.id)
        .notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const session = sqliteTable('session', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    tenantId: text('tenant_id')
});

export const account = sqliteTable('account', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
    scope: text('scope'),
    idToken: text('id_token'),
    password: text('password'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const services = sqliteTable('services', {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
        .references(() => tenants.id)
        .notNull(),
    name: text('name').notNull(),
    description: text('description'),
    price: real('price').notNull(),
    duration: integer('duration'), // in minutes
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const bookings = sqliteTable('bookings', {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
        .references(() => tenants.id)
        .notNull(),
    userId: text('user_id').references(() => user.id),
    serviceId: text('service_id')
        .references(() => services.id)
        .notNull(),
    customerName: text('customer_name').notNull(),
    customerEmail: text('customer_email'),
    customerPhone: text('customer_phone'),
    date: integer('date', { mode: 'timestamp' }).notNull(),
    time: text('time'), // HH:MM
    duration: integer('duration'), // in minutes
    status: text('status').default('pending'), // pending, confirmed, completed, cancelled
    notes: text('notes'),
    location: text('location'), // address for home visits
    latitude: real('latitude'),
    longitude: real('longitude'),
    attachments: text('attachments'), // JSON array of file URLs
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const reviews = sqliteTable('reviews', {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
        .references(() => tenants.id)
        .notNull(),
    bookingId: text('booking_id')
        .references(() => bookings.id)
        .notNull(),
    userId: text('user_id').references(() => user.id),
    rating: integer('rating').notNull(), // 1-5
    comment: text('comment'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const notifications = sqliteTable('notifications', {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id')
        .references(() => tenants.id)
        .notNull(),
    bookingId: text('booking_id').references(() => bookings.id),
    type: text('type').notNull(), // email, sms, whatsapp
    recipient: text('recipient').notNull(),
    subject: text('subject'),
    message: text('message').notNull(),
    status: text('status').default('pending'), // pending, sent, failed
    sentAt: integer('sent_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const landingPages = sqliteTable('landing_pages', {
    id: text('id')
        .primaryKey()
        .default(sql`uuid()`),
    tenantId: text('tenant_id')
        .references(() => tenants.id)
        .notNull(),
    template: text('template').notNull(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    description: text('description'),
    images: text('images'), // JSON array
    videos: text('videos'), // JSON array
    address: text('address'),
    phone: text('phone'),
    email: text('email'),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const tenantFeatures = sqliteTable('tenant_features', {
    id: text('id')
        .primaryKey()
        .default(sql`uuid()`),
    tenantId: text('tenant_id')
        .references(() => tenants.id)
        .notNull(),
    featureName: text('feature_name').notNull(),
    isEnabled: integer('is_enabled', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const userRoles = sqliteTable('user_roles', {
    id: text('id')
        .primaryKey()
        .default(sql`uuid()`),
    userId: text('user_id')
        .references(() => user.id)
        .notNull(),
    tenantId: text('tenant_id')
        .references(() => tenants.id)
        .notNull(),
    role: text('role').notNull(),
    permissions: text('permissions'), // JSON array of strings
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});
