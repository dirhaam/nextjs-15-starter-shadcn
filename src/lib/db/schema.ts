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

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
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
    userId: text('user_id').references(() => users.id),
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
    userId: text('user_id').references(() => users.id),
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
    id: text('id').primaryKey(),
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
