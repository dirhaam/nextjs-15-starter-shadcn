'use client';

import { useState } from 'react';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    customerName: string;
    createdAt: string;
}

interface LandingPageProps {
    tenant: {
        name: string;
        description?: string;
        currency?: string;
        language?: string;
    };
    landingPage: {
        title: string;
        subtitle?: string;
        description?: string;
        images?: string[];
        videos?: string[];
        address?: string;
        phone?: string;
        email?: string;
    };
    services?: Service[];
    reviews?: Review[];
}

export default function TenantLandingPage({ tenant, landingPage, services = [], reviews = [] }: LandingPageProps) {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const currency = tenant.currency || 'USD';

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(price);
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
            </span>
        ));
    };

    return (
        <div className='bg-background min-h-screen'>
            {/* Navigation */}
            <nav className='bg-card/80 sticky top-0 z-50 border-b backdrop-blur-sm'>
                <div className='container mx-auto px-4'>
                    <div className='flex h-16 items-center justify-between'>
                        <div className='text-primary text-xl font-bold'>{tenant.name}</div>
                        <div className='hidden space-x-8 md:flex'>
                            <a href='#services' className='text-foreground hover:text-primary transition-colors'>
                                Services
                            </a>
                            <a href='#about' className='text-foreground hover:text-primary transition-colors'>
                                About
                            </a>
                            <a href='#reviews' className='text-foreground hover:text-primary transition-colors'>
                                Reviews
                            </a>
                            <a href='#contact' className='text-foreground hover:text-primary transition-colors'>
                                Contact
                            </a>
                        </div>
                        <a
                            href='/book'
                            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold transition-colors'>
                            Book Appointment
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className='from-primary/10 to-secondary/10 relative bg-gradient-to-br py-20'>
                <div className='container mx-auto px-4 text-center'>
                    <h1 className='text-primary mb-4 text-5xl font-bold md:text-6xl'>{landingPage.title}</h1>
                    {landingPage.subtitle && (
                        <h2 className='text-muted-foreground mb-6 text-2xl md:text-3xl'>{landingPage.subtitle}</h2>
                    )}
                    {landingPage.description && (
                        <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl'>
                            {landingPage.description}
                        </p>
                    )}
                    <div className='flex flex-col justify-center gap-4 sm:flex-row mb-8'>
                        <a
                            href='#services'
                            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8 py-4 text-lg font-semibold transition-colors shadow-lg'>
                            View Our Services
                        </a>
                        <a
                            href='/book'
                            className='border-primary text-primary hover:bg-primary/10 rounded-lg border px-8 py-4 text-lg font-semibold transition-colors'>
                            Book Now
                        </a>
                    </div>

                    {/* Trust Indicators */}
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground'>
                        <span className='flex items-center'>
                            <span className='text-green-600 mr-2'>✓</span>
                            Professional Service
                        </span>
                        <span className='flex items-center'>
                            <span className='text-green-600 mr-2'>✓</span>
                            Easy Online Booking
                        </span>
                        <span className='flex items-center'>
                            <span className='text-green-600 mr-2'>✓</span>
                            Satisfaction Guaranteed
                        </span>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            {(landingPage.images?.length || landingPage.videos?.length) && (
                <section className='py-16'>
                    <div className='container mx-auto px-4'>
                        <h3 className='mb-8 text-center text-3xl font-bold'>Our Work</h3>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {landingPage.images?.map((image, index) => (
                                <div key={index} className='overflow-hidden rounded-lg shadow-md'>
                                    <img
                                        src={image}
                                        alt={`Gallery ${index + 1}`}
                                        className='h-64 w-full object-cover hover:scale-105 transition-transform duration-300'
                                    />
                                </div>
                            ))}
                            {landingPage.videos?.map((video, index) => (
                                <div key={index} className='overflow-hidden rounded-lg shadow-md'>
                                    <video
                                        src={video}
                                        controls
                                        className='h-64 w-full object-cover'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Services Section */}
            {services.length > 0 && (
                <section id='services' className='bg-muted/50 py-16'>
                    <div className='container mx-auto px-4'>
                        <div className='text-center mb-12'>
                            <h3 className='mb-4 text-3xl font-bold'>Our Services</h3>
                            <p className='text-muted-foreground max-w-2xl mx-auto text-lg'>
                                Choose from our range of professional services designed to meet your needs
                            </p>
                        </div>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {services
                                .filter((service) => service.isActive)
                                .map((service) => (
                                    <div
                                        key={service.id}
                                        className={`bg-card rounded-lg border p-6 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                            selectedService === service.id ? 'ring-2 ring-primary' : ''
                                        }`}
                                        onClick={() => setSelectedService(service.id)}>
                                        <h4 className='mb-3 text-xl font-semibold'>{service.name}</h4>
                                        <p className='text-muted-foreground mb-4 text-sm'>{service.description}</p>
                                        <div className='flex items-center justify-between mb-4'>
                                            <span className='text-primary text-2xl font-bold'>
                                                {formatPrice(service.price)}
                                            </span>
                                            <span className='text-muted-foreground text-sm bg-muted px-2 py-1 rounded'>
                                                {formatDuration(service.duration)}
                                            </span>
                                        </div>
                                        <a
                                            href={`/book?service=${service.id}`}
                                            className='bg-primary text-primary-foreground hover:bg-primary/90 block w-full rounded-lg px-4 py-3 text-center font-semibold transition-colors'>
                                            Book This Service
                                        </a>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About/Why Choose Us Section */}
            <section id='about' className='py-16'>
                <div className='container mx-auto px-4'>
                    <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 items-center'>
                        <div>
                            <h3 className='text-3xl font-bold mb-6'>Why Choose {tenant.name}?</h3>
                            <p className='text-muted-foreground text-lg mb-6'>
                                {tenant.description || `Experience professional service with ${tenant.name}. We're committed to providing exceptional quality and customer satisfaction.`}
                            </p>
                            <div className='space-y-4'>
                                <div className='flex items-start'>
                                    <div className='bg-primary/10 text-primary mr-4 flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0'>
                                        ⭐
                                    </div>
                                    <div>
                                        <h4 className='font-semibold mb-1'>Quality Service</h4>
                                        <p className='text-muted-foreground text-sm'>Professional and experienced team dedicated to excellence</p>
                                    </div>
                                </div>
                                <div className='flex items-start'>
                                    <div className='bg-primary/10 text-primary mr-4 flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0'>
                                        📅
                                    </div>
                                    <div>
                                        <h4 className='font-semibold mb-1'>Easy Booking</h4>
                                        <p className='text-muted-foreground text-sm'>Simple online booking system available 24/7</p>
                                    </div>
                                </div>
                                <div className='flex items-start'>
                                    <div className='bg-primary/10 text-primary mr-4 flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0'>
                                        🏠
                                    </div>
                                    <div>
                                        <h4 className='font-semibold mb-1'>Home Visits Available</h4>
                                        <p className='text-muted-foreground text-sm'>Convenient home service options for your comfort</p>
                                    </div>
                                </div>
                                <div className='flex items-start'>
                                    <div className='bg-primary/10 text-primary mr-4 flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0'>
                                        💬
                                    </div>
                                    <div>
                                        <h4 className='font-semibold mb-1'>Stay Updated</h4>
                                        <p className='text-muted-foreground text-sm'>WhatsApp and SMS notifications for appointments</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-card rounded-lg border p-8'>
                            <h4 className='text-xl font-semibold mb-4'>Ready to Book?</h4>
                            <p className='text-muted-foreground mb-6'>
                                Schedule your appointment today and experience our professional service.
                            </p>
                            <div className='space-y-4'>
                                <a
                                    href='/book'
                                    className='bg-primary text-primary-foreground hover:bg-primary/90 block w-full rounded-lg px-6 py-3 text-center font-semibold transition-colors'>
                                    Book Online Now
                                </a>
                                {landingPage.phone && (
                                    <a
                                        href={`tel:${landingPage.phone}`}
                                        className='border-primary text-primary hover:bg-primary/10 block w-full rounded-lg border px-6 py-3 text-center font-semibold transition-colors'>
                                        Call {landingPage.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            {reviews.length > 0 && (
                <section id='reviews' className='bg-muted/50 py-16'>
                    <div className='container mx-auto px-4'>
                        <div className='text-center mb-12'>
                            <h3 className='mb-4 text-3xl font-bold'>What Our Customers Say</h3>
                            <p className='text-muted-foreground max-w-2xl mx-auto'>
                                Read reviews from our satisfied customers
                            </p>
                        </div>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {reviews.slice(0, 6).map((review) => (
                                <div key={review.id} className='bg-card rounded-lg border p-6 shadow-sm'>
                                    <div className='flex items-center mb-4'>
                                        <div className='flex mr-2'>{renderStars(review.rating)}</div>
                                        <span className='text-muted-foreground ml-2 text-sm'>{review.rating}/5</span>
                                    </div>
                                    <p className='text-muted-foreground mb-4 italic'>"{review.comment}"</p>
                                    <div className='flex items-center justify-between'>
                                        <span className='font-semibold'>{review.customerName}</span>
                                        <span className='text-muted-foreground text-sm'>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {reviews.length > 6 && (
                            <div className='text-center mt-8'>
                                <button className='border-primary text-primary hover:bg-primary/10 rounded-lg border px-6 py-2 font-semibold transition-colors'>
                                    View All Reviews
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Contact Section */}
            <section id='contact' className='py-16'>
                <div className='container mx-auto px-4'>
                    <div className='text-center mb-12'>
                        <h3 className='mb-4 text-3xl font-bold'>Get In Touch</h3>
                        <p className='text-muted-foreground max-w-2xl mx-auto'>
                            Have questions? Ready to book? We're here to help you.
                        </p>
                    </div>
                    <div className='mx-auto max-w-4xl'>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                            {/* Contact Info */}
                            <div className='space-y-6'>
                                {landingPage.address && (
                                    <div className='flex items-start'>
                                        <div className='bg-primary/10 text-primary mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full'>
                                            📍
                                        </div>
                                        <div>
                                            <h4 className='mb-1 font-semibold'>Visit Us</h4>
                                            <p className='text-muted-foreground'>{landingPage.address}</p>
                                        </div>
                                    </div>
                                )}
                                {landingPage.phone && (
                                    <div className='flex items-start'>
                                        <div className='bg-primary/10 text-primary mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full'>
                                            📞
                                        </div>
                                        <div>
                                            <h4 className='mb-1 font-semibold'>Call Us</h4>
                                            <a href={`tel:${landingPage.phone}`} className='text-primary hover:underline'>
                                                {landingPage.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {landingPage.email && (
                                    <div className='flex items-start'>
                                        <div className='bg-primary/10 text-primary mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full'>
                                            ✉️
                                        </div>
                                        <div>
                                            <h4 className='mb-1 font-semibold'>Email Us</h4>
                                            <a href={`mailto:${landingPage.email}`} className='text-primary hover:underline'>
                                                {landingPage.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Business Hours */}
                                <div className='bg-card rounded-lg border p-6'>
                                    <h4 className='font-semibold mb-3'>Business Hours</h4>
                                    <div className='space-y-2 text-sm'>
                                        <div className='flex justify-between'>
                                            <span>Monday - Friday:</span>
                                            <span>9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Saturday:</span>
                                            <span>9:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Sunday:</span>
                                            <span>Closed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Contact Form */}
                            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                                <h4 className='mb-4 text-xl font-semibold'>Send us a Message</h4>
                                <form className='space-y-4'>
                                    <div>
                                        <label className='mb-1 block text-sm font-medium'>Name</label>
                                        <input
                                            type='text'
                                            className='border-input focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none'
                                            placeholder='Your name'
                                        />
                                    </div>
                                    <div>
                                        <label className='mb-1 block text-sm font-medium'>Email</label>
                                        <input
                                            type='email'
                                            className='border-input focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none'
                                            placeholder='your@email.com'
                                        />
                                    </div>
                                    <div>
                                        <label className='mb-1 block text-sm font-medium'>Phone</label>
                                        <input
                                            type='tel'
                                            className='border-input focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none'
                                            placeholder='Your phone number'
                                        />
                                    </div>
                                    <div>
                                        <label className='mb-1 block text-sm font-medium'>Message</label>
                                        <textarea
                                            rows={4}
                                            className='border-input focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none'
                                            placeholder='Your message or questions...'
                                        />
                                    </div>
                                    <button
                                        type='submit'
                                        className='bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-3 font-semibold transition-colors'>
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className='bg-primary py-16 text-primary-foreground'>
                <div className='container mx-auto px-4 text-center'>
                    <h3 className='text-3xl font-bold mb-4'>Ready to Experience Our Service?</h3>
                    <p className='text-xl mb-8 opacity-90 max-w-2xl mx-auto'>
                        Book your appointment today and let us take care of your needs with professional excellence.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <a
                            href='/book'
                            className='bg-white text-primary hover:bg-gray-100 rounded-lg px-8 py-4 text-lg font-semibold transition-colors shadow-lg'>
                            Book Appointment Now
                        </a>
                        {landingPage.phone && (
                            <a
                                href={`tel:${landingPage.phone}`}
                                className='border-white border-2 hover:bg-white/10 rounded-lg px-8 py-4 text-lg font-semibold transition-colors'>
                                Call {landingPage.phone}
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className='bg-card border-t py-8'>
                <div className='container mx-auto px-4'>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                        <div>
                            <h4 className='mb-4 text-lg font-semibold'>{tenant.name}</h4>
                            <p className='text-muted-foreground text-sm mb-4'>
                                {tenant.description || landingPage.description}
                            </p>
                            {/* Social Links */}
                            <div className='flex space-x-4'>
                                <a href='#' className='text-muted-foreground hover:text-primary text-xl'>📘</a>
                                <a href='#' className='text-muted-foreground hover:text-primary text-xl'>📷</a>
                                <a href='#' className='text-muted-foreground hover:text-primary text-xl'>🐦</a>
                            </div>
                        </div>
                        <div>
                            <h4 className='mb-4 text-lg font-semibold'>Quick Links</h4>
                            <ul className='space-y-2'>
                                <li>
                                    <a href='#services' className='text-muted-foreground hover:text-primary text-sm'>
                                        Our Services
                                    </a>
                                </li>
                                <li>
                                    <a href='#about' className='text-muted-foreground hover:text-primary text-sm'>
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href='#reviews' className='text-muted-foreground hover:text-primary text-sm'>
                                        Customer Reviews
                                    </a>
                                </li>
                                <li>
                                    <a href='#contact' className='text-muted-foreground hover:text-primary text-sm'>
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className='mb-4 text-lg font-semibold'>Contact Info</h4>
                            <div className='space-y-2 text-sm'>
                                {landingPage.address && (
                                    <p className='text-muted-foreground'>📍 {landingPage.address}</p>
                                )}
                                {landingPage.phone && (
                                    <p className='text-muted-foreground'>📞 {landingPage.phone}</p>
                                )}
                                {landingPage.email && (
                                    <p className='text-muted-foreground'>✉️ {landingPage.email}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='text-muted-foreground mt-8 border-t pt-8 text-center text-sm'>
                        <p>&copy; 2024 {tenant.name}. All rights reserved. | Powered by Booqing</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}