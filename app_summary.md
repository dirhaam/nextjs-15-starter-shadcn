# Booqing Multi Subdomain Booking Platform - Summary

<style>
  :root {
    --background: oklch(0.9911 0 0);
    --foreground: oklch(0.2101 0.0318 264.6645);
    --card: oklch(1.0000 0 0);
    --card-foreground: oklch(0.2101 0.0318 264.6645);
    --primary: oklch(0.5989 0.1867 16.6841);
    --primary-foreground: oklch(1.0000 0 0);
    --secondary: oklch(0.4295 0.0544 195.3175);
    --secondary-foreground: oklch(1.0000 0 0);
    --font-sans: 'Poppins', ui-sans-serif, sans-serif, system-ui;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    letter-spacing: 0;
  }

  h1, h2, h3 {
    color: var(--primary);
    font-weight: 800;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 0.75rem;
    border: 1px solid var(--secondary);
    color: var(--foreground);
  }

  th {
    background-color: var(--primary);
    color: var(--primary-foreground);
    font-weight: 700;
  }

  ul {
    margin-left: 1.25rem;
  }
</style>

## Overview
Booqing is a scalable multi-subdomain booking platform with a single database that logically separates tenant/subdomain data using a `tenant_id` column. The platform is deployed on Vercel, leveraging Next.js for backend API and frontend, along with Cloudflare Workers for edge computing and caching.

## Main Features

### Admin Panel (booqing.my.id)
- Role-based dashboard (Owner, Staff, Finance) to manage subdomains, tenants, and premium features.
- Tenant-specific premium feature toggles and status monitoring.
- Role and permission management per subdomain.

### Subdomain Websites (per Tenant)
- Modular landing pages supporting customizable content (photos, videos, addresses) and multiple style options.
- Flexible booking system with daily or hourly slots.
- Home visit booking with OpenStreetMap integration and automatic routing to Google/Apple Maps.
- Data isolation per tenant within a single database through `tenant_id`.
- Role-based access control.

### Additional Features
- Notifications via WhatsApp, email, SMS, with premium WhatsApp activation.
- User review and rating system.
- Booking and financial reporting with export options (XLS/PDF).
- Multi-language and multi-currency support.
- Calendar synchronization for staff and users.
- File attachments in bookings.
- Selectable landing page templates per tenant.

## Technology Stack

| Layer          | Technology / Tools                                   |
|----------------|----------------------------------------------------|
| Frontend       | Next.js (App Router), Shadcn UI, Tailwind CSS v4   |
| Backend        | Next.js API Routes, Cloudflare Workers              |
| Database       | Single Cloudflare D1 with Drizzle ORM                |
| Authentication | Better Auth (role-based multi-tenant)               |
| Storage        | Cloudflare R2                                       |
| Deployment     | Vercel (multi-subdomain), Cloudflare Workers         |
| Maps           | OpenStreetMap, Browser Geolocation APIs              |
| Other          | PDF/QR Code Generators, WhatsApp Notifications, Cache layer (Cloudflare Worker KV, Redis, or similar) |

## Multi-Tenant Database Strategy
- All tenant data resides in a single Cloudflare D1 database instance.
- Tables include a `tenant_id` column to partition and isolate data logically.
- All database queries are filtered by `tenant_id` to ensure tenant data security and separation.

## Database Access Optimization
- Cache frequently accessed data to reduce read/write load on the database:
  - Use cache layers such as Cloudflare Workers KV storage or Redis for caching read-heavy data like tenant configurations, landing page templates, and static content.
  - Implement TTL (time-to-live) for cache entries to balance freshness and performance.
  - Use cache invalidation on data updates to keep caches consistent.
- Optimize write operations by batching or queueing when appropriate to avoid bottlenecks.

## Scalability & Deployment
- Modular, extensible architecture supporting multi-tenant and multi-subdomain scenarios.
- Next.js middleware handles routing and tenant context based on the subdomain of each request.
- Role-based access control ensures secure tenant isolation.
- Smooth integration with external services for maps, payments, notifications, and document generation.
- Deployment on Vercel for front-end and backend APIs, with Cloudflare Workers handling edge logic and caching.

## Layout Revision
- The application layout structure will be revised and documented separately in `layout_structure.md`.

---

This document outlines a scalable, secure, and efficient SaaS multi-subdomain booking platform design that uses a single database with logical tenant separation and caching optimizations for high performance.
