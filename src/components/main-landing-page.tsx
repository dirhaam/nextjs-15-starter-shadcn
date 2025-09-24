'use client';

import { useState } from 'react';

import TenantRegistrationForm from '@/components/tenant-registration-form';

export default function MainLandingPage() {
    const [showRegistration, setShowRegistration] = useState(false);

    return (
        <div className='bg-background min-h-screen'>
            {/* Navigation */}
            <nav className='bg-card/80 sticky top-0 z-50 border-b backdrop-blur-sm'>
                <div className='container mx-auto px-4'>
                    <div className='flex h-16 items-center justify-between'>
                        <div className='text-primary text-2xl font-bold'>Booqing</div>
                        <div className='hidden space-x-8 md:flex'>
                            <a href='#features' className='text-foreground hover:text-primary transition-colors'>
                                Features
                            </a>
                            <a href='#pricing' className='text-foreground hover:text-primary transition-colors'>
                                Pricing
                            </a>
                            <a href='#demo' className='text-foreground hover:text-primary transition-colors'>
                                Demo
                            </a>
                            <a href='#testimonials' className='text-foreground hover:text-primary transition-colors'>
                                Success Stories
                            </a>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <a href='/login' className='text-foreground hover:text-primary transition-colors'>
                                Admin Login
                            </a>
                            <button
                                onClick={() => setShowRegistration(true)}
                                className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 font-semibold transition-colors'>
                                Start Free Trial
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {showRegistration ? (
                <div className='py-16'>
                    <div className='container mx-auto px-4'>
                        <TenantRegistrationForm onClose={() => setShowRegistration(false)} />
                    </div>
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <section className='from-primary/10 to-secondary/10 bg-gradient-to-br py-20'>
                        <div className='container mx-auto px-4 text-center'>
                            <div className='mb-6'>
                                <span className='bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-semibold'>
                                    🚀 Launch Your Booking Business Today
                                </span>
                            </div>
                            <h1 className='text-primary mb-6 text-5xl font-bold md:text-7xl'>
                                Build Your Own
                                <br />
                                <span className='text-secondary'>Booking Platform</span>
                            </h1>
                            <p className='text-muted-foreground mx-auto mb-8 max-w-3xl text-xl md:text-2xl'>
                                Create a professional booking website for your service business in minutes. Get your own
                                branded subdomain, accept online appointments, and grow your customer base.
                            </p>
                            <div className='mb-8 flex flex-col justify-center gap-4 sm:flex-row'>
                                <button
                                    onClick={() => setShowRegistration(true)}
                                    className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition-colors'>
                                    Create My Booking Site
                                </button>
                                <a
                                    href='#demo'
                                    className='border-primary text-primary hover:bg-primary/10 rounded-lg border px-8 py-4 text-lg font-semibold transition-colors'>
                                    View Live Demo
                                </a>
                            </div>
                            <div className='text-muted-foreground flex flex-col items-center justify-center gap-4 text-sm sm:flex-row'>
                                <span className='flex items-center'>✓ Free 30-day trial</span>
                                <span className='flex items-center'>✓ No credit card required</span>
                                <span className='flex items-center'>✓ Setup in 5 minutes</span>
                            </div>
                        </div>
                    </section>

                    {/* Platform Benefits */}
                    <section className='py-20'>
                        <div className='container mx-auto px-4'>
                            <div className='mb-16 text-center'>
                                <h2 className='mb-4 text-4xl font-bold'>Why Choose Booqing Platform?</h2>
                                <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
                                    Everything you need to run a successful service booking business
                                </p>
                            </div>

                            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                                <div className='text-center'>
                                    <div className='bg-primary/10 text-primary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl'>
                                        🌐
                                    </div>
                                    <h3 className='mb-4 text-2xl font-semibold'>Your Own Website</h3>
                                    <p className='text-muted-foreground text-lg'>
                                        Get a professional website at <strong>yourname.booqing.my.id</strong> with
                                        custom branding, colors, and content.
                                    </p>
                                </div>

                                <div className='text-center'>
                                    <div className='bg-primary/10 text-primary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl'>
                                        📱
                                    </div>
                                    <h3 className='mb-4 text-2xl font-semibold'>Mobile-First Design</h3>
                                    <p className='text-muted-foreground text-lg'>
                                        Beautiful, responsive design that works perfectly on all devices. Your customers
                                        can book from anywhere.
                                    </p>
                                </div>

                                <div className='text-center'>
                                    <div className='bg-primary/10 text-primary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl'>
                                        ⚡
                                    </div>
                                    <h3 className='mb-4 text-2xl font-semibold'>Lightning Fast</h3>
                                    <p className='text-muted-foreground text-lg'>
                                        Built on modern technology stack for blazing fast performance and excellent SEO
                                        rankings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Complete Feature Set */}
                    <section id='features' className='bg-muted/50 py-20'>
                        <div className='container mx-auto px-4'>
                            <div className='mb-16 text-center'>
                                <h2 className='mb-4 text-4xl font-bold'>Complete Booking Solution</h2>
                                <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
                                    Every feature you need to manage appointments and grow your business
                                </p>
                            </div>

                            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='text-primary mb-4 text-2xl'>📅</div>
                                    <h3 className='mb-2 text-xl font-semibold'>Smart Scheduling</h3>
                                    <p className='text-muted-foreground'>
                                        Flexible booking system with daily/hourly slots, calendar sync, buffer times,
                                        and availability management.
                                    </p>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='text-primary mb-4 text-2xl'>🏠</div>
                                    <h3 className='mb-2 text-xl font-semibold'>Home Visit Services</h3>
                                    <p className='text-muted-foreground'>
                                        Built-in support for home visits with integrated maps, GPS routing, and location
                                        management.
                                    </p>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='text-primary mb-4 text-2xl'>💬</div>
                                    <h3 className='mb-2 text-xl font-semibold'>Multi-Channel Notifications</h3>
                                    <p className='text-muted-foreground'>
                                        Automatic WhatsApp, email, and SMS notifications for bookings, reminders, and
                                        confirmations.
                                    </p>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='text-primary mb-4 text-2xl'>👥</div>
                                    <h3 className='mb-2 text-xl font-semibold'>Customer Management</h3>
                                    <p className='text-muted-foreground'>
                                        Complete CRM with customer profiles, booking history, preferences, and review
                                        system.
                                    </p>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='text-primary mb-4 text-2xl'>📊</div>
                                    <h3 className='mb-2 text-xl font-semibold'>Business Analytics</h3>
                                    <p className='text-muted-foreground'>
                                        Detailed reports on bookings, revenue, customer trends with export to Excel/PDF.
                                    </p>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='text-primary mb-4 text-2xl'>💳</div>
                                    <h3 className='mb-2 text-xl font-semibold'>Payment Integration</h3>
                                    <p className='text-muted-foreground'>
                                        Accept online payments, deposits, and manage pricing with multi-currency
                                        support.
                                    </p>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='text-primary mb-4 text-2xl'>⭐</div>
                                    <h3 className='mb-2 text-xl font-semibold'>Review System</h3>
                                    <p className='text-muted-foreground'>
                                        Build trust with customer reviews and ratings displayed on your booking page.
                                    </p>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='text-primary mb-4 text-2xl'>🔐</div>
                                    <h3 className='mb-2 text-xl font-semibold'>Staff Management</h3>
                                    <p className='text-muted-foreground'>
                                        Role-based access for staff members with individual calendars and permissions.
                                    </p>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='text-primary mb-4 text-2xl'>🌍</div>
                                    <h3 className='mb-2 text-xl font-semibold'>Multi-Language</h3>
                                    <p className='text-muted-foreground'>
                                        Support for multiple languages and currencies to serve international customers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section id='pricing' className='py-20'>
                        <div className='container mx-auto px-4'>
                            <div className='mb-16 text-center'>
                                <h2 className='mb-4 text-4xl font-bold'>Simple, Transparent Pricing</h2>
                                <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
                                    Start free, upgrade when you grow. No hidden fees, cancel anytime.
                                </p>
                            </div>

                            <div className='mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3'>
                                {/* Starter Plan */}
                                <div className='bg-card rounded-lg border p-8 text-center'>
                                    <h3 className='mb-2 text-2xl font-bold'>Starter</h3>
                                    <div className='text-primary mb-4 text-4xl font-bold'>Free</div>
                                    <p className='text-muted-foreground mb-6'>Perfect for getting started</p>
                                    <ul className='mb-8 space-y-3 text-left'>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>Up to 50 bookings/month</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>Custom subdomain</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>Email notifications</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>Basic customer management</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>Mobile responsive</span>
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => setShowRegistration(true)}
                                        className='border-primary text-primary hover:bg-primary/10 w-full rounded-lg border px-6 py-3 font-semibold transition-colors'>
                                        Start Free Trial
                                    </button>
                                </div>

                                {/* Professional Plan */}
                                <div className='bg-primary text-primary-foreground border-primary relative rounded-lg border-2 p-8 text-center'>
                                    <div className='bg-secondary absolute -top-4 left-1/2 -translate-x-1/2 transform rounded-full px-4 py-1 text-sm font-semibold text-white'>
                                        Most Popular
                                    </div>
                                    <h3 className='mb-2 text-2xl font-bold'>Professional</h3>
                                    <div className='mb-4 text-4xl font-bold'>
                                        $29<span className='text-lg'>/month</span>
                                    </div>
                                    <p className='mb-6 opacity-90'>For growing businesses</p>
                                    <ul className='mb-8 space-y-3 text-left'>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-300'>✓</span>
                                            <span>Unlimited bookings</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-300'>✓</span>
                                            <span>WhatsApp & SMS notifications</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-300'>✓</span>
                                            <span>Advanced analytics</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-300'>✓</span>
                                            <span>Staff management (up to 5)</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-300'>✓</span>
                                            <span>Custom branding</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-300'>✓</span>
                                            <span>Payment integration</span>
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => setShowRegistration(true)}
                                        className='text-primary w-full rounded-lg bg-white px-6 py-3 font-semibold transition-colors hover:bg-gray-100'>
                                        Start 30-Day Trial
                                    </button>
                                </div>

                                {/* Enterprise Plan */}
                                <div className='bg-card rounded-lg border p-8 text-center'>
                                    <h3 className='mb-2 text-2xl font-bold'>Enterprise</h3>
                                    <div className='text-primary mb-4 text-4xl font-bold'>
                                        $99<span className='text-lg'>/month</span>
                                    </div>
                                    <p className='text-muted-foreground mb-6'>For large operations</p>
                                    <ul className='mb-8 space-y-3 text-left'>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>Everything in Professional</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>Unlimited staff members</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>Custom domain</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>API access</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>Priority support</span>
                                        </li>
                                        <li className='flex items-center'>
                                            <span className='mr-3 text-green-600'>✓</span>
                                            <span>White-label option</span>
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => setShowRegistration(true)}
                                        className='border-primary text-primary hover:bg-primary/10 w-full rounded-lg border px-6 py-3 font-semibold transition-colors'>
                                        Contact Sales
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Demo Section */}
                    <section id='demo' className='bg-muted/50 py-20'>
                        <div className='container mx-auto px-4'>
                            <div className='mb-16 text-center'>
                                <h2 className='mb-4 text-4xl font-bold'>See Booqing In Action</h2>
                                <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
                                    Explore live examples of booking websites built with our platform
                                </p>
                            </div>

                            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                                <div className='bg-card overflow-hidden rounded-lg border'>
                                    <div className='flex h-48 items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100'>
                                        <span className='text-4xl'>💆‍♀️</span>
                                    </div>
                                    <div className='p-6'>
                                        <h3 className='mb-2 text-xl font-semibold'>Beauty & Spa</h3>
                                        <p className='text-muted-foreground mb-4'>
                                            Professional spa booking with service packages, staff selection, and home
                                            visits
                                        </p>
                                        <a
                                            href='/tenant/beautyspa'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-4 py-2 font-semibold transition-colors'>
                                            View Demo →
                                        </a>
                                    </div>
                                </div>

                                <div className='bg-card overflow-hidden rounded-lg border'>
                                    <div className='flex h-48 items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100'>
                                        <span className='text-4xl'>🦷</span>
                                    </div>
                                    <div className='p-6'>
                                        <h3 className='mb-2 text-xl font-semibold'>Dental Care</h3>
                                        <p className='text-muted-foreground mb-4'>
                                            Medical appointment booking with treatment types and insurance integration
                                        </p>
                                        <a
                                            href='/tenant/dentalcare'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-4 py-2 font-semibold transition-colors'>
                                            View Demo →
                                        </a>
                                    </div>
                                </div>

                                <div className='bg-card overflow-hidden rounded-lg border'>
                                    <div className='flex h-48 items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100'>
                                        <span className='text-4xl'>💪</span>
                                    </div>
                                    <div className='p-6'>
                                        <h3 className='mb-2 text-xl font-semibold'>Fitness Training</h3>
                                        <p className='text-muted-foreground mb-4'>
                                            Personal training sessions with trainer profiles and workout packages
                                        </p>
                                        <a
                                            href='/tenant/fitnesspro'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-4 py-2 font-semibold transition-colors'>
                                            View Demo →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Success Stories / Testimonials */}
                    <section id='testimonials' className='py-20'>
                        <div className='container mx-auto px-4'>
                            <div className='mb-16 text-center'>
                                <h2 className='mb-4 text-4xl font-bold'>Success Stories</h2>
                                <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
                                    See how businesses are growing with Booqing platform
                                </p>
                            </div>

                            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='mb-4 flex items-center'>
                                        <div className='bg-primary/10 mr-4 flex h-12 w-12 items-center justify-center rounded-full'>
                                            <span className='text-xl'>💇‍♀️</span>
                                        </div>
                                        <div>
                                            <h4 className='font-semibold'>Sarah's Hair Studio</h4>
                                            <p className='text-muted-foreground text-sm'>Beauty Salon</p>
                                        </div>
                                    </div>
                                    <p className='text-muted-foreground mb-4 italic'>
                                        "Booqing helped me go from 20 appointments per week to 60+. The automated
                                        WhatsApp reminders reduced no-shows by 80%!"
                                    </p>
                                    <div className='text-primary font-semibold'>+200% booking increase in 3 months</div>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='mb-4 flex items-center'>
                                        <div className='bg-primary/10 mr-4 flex h-12 w-12 items-center justify-center rounded-full'>
                                            <span className='text-xl'>🏥</span>
                                        </div>
                                        <div>
                                            <h4 className='font-semibold'>Dr. Ahmad Clinic</h4>
                                            <p className='text-muted-foreground text-sm'>Medical Practice</p>
                                        </div>
                                    </div>
                                    <p className='text-muted-foreground mb-4 italic'>
                                        "The patient management system is incredible. We can track medical history, send
                                        treatment reminders, and patients love the convenience."
                                    </p>
                                    <div className='text-primary font-semibold'>50% reduction in admin time</div>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='mb-4 flex items-center'>
                                        <div className='bg-primary/10 mr-4 flex h-12 w-12 items-center justify-center rounded-full'>
                                            <span className='text-xl'>🏠</span>
                                        </div>
                                        <div>
                                            <h4 className='font-semibold'>Clean Pro Services</h4>
                                            <p className='text-muted-foreground text-sm'>Home Cleaning</p>
                                        </div>
                                    </div>
                                    <p className='text-muted-foreground mb-4 italic'>
                                        "The home visit feature with GPS routing transformed our business. We now serve
                                        3 cities and customers love tracking our arrival."
                                    </p>
                                    <div className='text-primary font-semibold'>Expanded to 3 new cities</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className='bg-primary text-primary-foreground py-20'>
                        <div className='container mx-auto px-4 text-center'>
                            <h2 className='mb-4 text-4xl font-bold'>Ready to Transform Your Business?</h2>
                            <p className='mx-auto mb-8 max-w-2xl text-xl opacity-90'>
                                Join thousands of service businesses using Booqing to streamline appointments, reduce
                                no-shows, and grow their customer base.
                            </p>
                            <div className='mb-8 flex flex-col justify-center gap-4 sm:flex-row'>
                                <button
                                    onClick={() => setShowRegistration(true)}
                                    className='text-primary rounded-lg bg-white px-8 py-4 text-lg font-semibold shadow-lg transition-colors hover:bg-gray-100'>
                                    Start Your 30-Day Free Trial
                                </button>
                                <a
                                    href='#demo'
                                    className='rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold transition-colors hover:bg-white/10'>
                                    Explore Demo Sites
                                </a>
                            </div>
                            <div className='flex flex-col items-center justify-center gap-6 text-sm opacity-75 sm:flex-row'>
                                <span>✓ No setup fees</span>
                                <span>✓ Cancel anytime</span>
                                <span>✓ 24/7 support</span>
                                <span>✓ Data migration included</span>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className='bg-card border-t py-12'>
                        <div className='container mx-auto px-4'>
                            <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
                                <div>
                                    <h3 className='mb-4 text-lg font-semibold'>Booqing Platform</h3>
                                    <p className='text-muted-foreground mb-4 text-sm'>
                                        The complete booking solution for service businesses. Create your professional
                                        booking website and grow your business today.
                                    </p>
                                    <div className='flex space-x-4'>
                                        <a href='#' className='text-muted-foreground hover:text-primary'>
                                            📧
                                        </a>
                                        <a href='#' className='text-muted-foreground hover:text-primary'>
                                            📱
                                        </a>
                                        <a href='#' className='text-muted-foreground hover:text-primary'>
                                            🐦
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <h4 className='mb-4 font-semibold'>Platform</h4>
                                    <ul className='space-y-2 text-sm'>
                                        <li>
                                            <a href='#features' className='text-muted-foreground hover:text-primary'>
                                                Features
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#pricing' className='text-muted-foreground hover:text-primary'>
                                                Pricing
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#demo' className='text-muted-foreground hover:text-primary'>
                                                Live Demo
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' className='text-muted-foreground hover:text-primary'>
                                                API Documentation
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className='mb-4 font-semibold'>Business Types</h4>
                                    <ul className='space-y-2 text-sm'>
                                        <li>
                                            <a href='#' className='text-muted-foreground hover:text-primary'>
                                                Beauty & Spa
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' className='text-muted-foreground hover:text-primary'>
                                                Healthcare
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' className='text-muted-foreground hover:text-primary'>
                                                Fitness & Wellness
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' className='text-muted-foreground hover:text-primary'>
                                                Home Services
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' className='text-muted-foreground hover:text-primary'>
                                                Consulting
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className='mb-4 font-semibold'>Support</h4>
                                    <ul className='space-y-2 text-sm'>
                                        <li>
                                            <a href='#' className='text-muted-foreground hover:text-primary'>
                                                Help Center
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' className='text-muted-foreground hover:text-primary'>
                                                Contact Support
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' className='text-muted-foreground hover:text-primary'>
                                                System Status
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/admin' className='text-muted-foreground hover:text-primary'>
                                                Admin Login
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className='text-muted-foreground mt-8 flex flex-col items-center justify-between border-t pt-8 text-sm md:flex-row'>
                                <p>&copy; 2024 Booqing Platform. All rights reserved.</p>
                                <div className='mt-4 flex space-x-6 md:mt-0'>
                                    <a href='#' className='hover:text-primary'>
                                        Privacy Policy
                                    </a>
                                    <a href='#' className='hover:text-primary'>
                                        Terms of Service
                                    </a>
                                    <a href='#' className='hover:text-primary'>
                                        Cookie Policy
                                    </a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
}
