import BookingForm from './booking-form';

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

export default function LandingPage({ tenant, landingPage, services = [], reviews = [] }: LandingPageProps) {
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
                            <a href='#booking' className='text-foreground hover:text-primary transition-colors'>
                                Book Now
                            </a>
                            <a href='#features' className='text-foreground hover:text-primary transition-colors'>
                                Features
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
                            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 font-semibold transition-colors'>
                            Book Now
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className='from-primary/10 to-secondary/10 relative flex h-screen items-center justify-center bg-gradient-to-r'>
                <div className='container mx-auto px-4 text-center'>
                    <h1 className='text-primary mb-4 text-4xl font-bold md:text-6xl'>{landingPage.title}</h1>
                    {landingPage.subtitle && (
                        <h2 className='text-muted-foreground mb-6 text-2xl md:text-4xl'>{landingPage.subtitle}</h2>
                    )}
                    {landingPage.description && (
                        <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl'>
                            {landingPage.description}
                        </p>
                    )}
                    <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                        <a
                            href='#booking'
                            className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8 py-3 font-semibold transition-colors'>
                            Book Now
                        </a>
                        <a
                            href='#contact'
                            className='border-primary text-primary hover:bg-primary/10 rounded-lg border px-8 py-3 font-semibold transition-colors'>
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>

            {/* Images/Videos Section */}
            {(landingPage.images?.length || landingPage.videos?.length) && (
                <section className='bg-muted/50 py-16'>
                    <div className='container mx-auto px-4'>
                        <h3 className='mb-8 text-center text-3xl font-bold'>Gallery</h3>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {landingPage.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Gallery ${index + 1}`}
                                    className='h-64 w-full rounded-lg object-cover'
                                />
                            ))}
                            {landingPage.videos?.map((video, index) => (
                                <video
                                    key={index}
                                    src={video}
                                    controls
                                    className='h-64 w-full rounded-lg object-cover'
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Services Section */}
            {services.length > 0 && (
                <section id='services' className='py-16'>
                    <div className='container mx-auto px-4'>
                        <h3 className='mb-8 text-center text-3xl font-bold'>Our Services</h3>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {services
                                .filter((service) => service.isActive)
                                .map((service) => (
                                    <div key={service.id} className='bg-card rounded-lg border p-6 shadow-sm'>
                                        <h4 className='mb-2 text-xl font-semibold'>{service.name}</h4>
                                        <p className='text-muted-foreground mb-4'>{service.description}</p>
                                        <div className='mb-4 flex items-center justify-between'>
                                            <span className='text-primary text-2xl font-bold'>
                                                {formatPrice(service.price)}
                                            </span>
                                            <span className='text-muted-foreground text-sm'>
                                                {formatDuration(service.duration)}
                                            </span>
                                        </div>
                                        <a
                                            href={`/book?service=${service.id}`}
                                            className='bg-primary text-primary-foreground hover:bg-primary/90 block w-full rounded-lg px-4 py-2 text-center font-semibold transition-colors'>
                                            Book This Service
                                        </a>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section id='features' className='bg-muted/50 py-16'>
                <div className='container mx-auto px-4'>
                    <h3 className='mb-8 text-center text-3xl font-bold'>Why Choose Us</h3>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                        <div className='text-center'>
                            <div className='bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                                📅
                            </div>
                            <h4 className='mb-2 text-xl font-semibold'>Flexible Booking</h4>
                            <p className='text-muted-foreground'>
                                Daily or hourly slots available to fit your schedule
                            </p>
                        </div>
                        <div className='text-center'>
                            <div className='bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                                🏠
                            </div>
                            <h4 className='mb-2 text-xl font-semibold'>Home Visits</h4>
                            <p className='text-muted-foreground'>Convenient home visit services with integrated maps</p>
                        </div>
                        <div className='text-center'>
                            <div className='bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                                💬
                            </div>
                            <h4 className='mb-2 text-xl font-semibold'>Multi-Channel Notifications</h4>
                            <p className='text-muted-foreground'>WhatsApp, email, and SMS notifications</p>
                        </div>
                        <div className='text-center'>
                            <div className='bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                                🌍
                            </div>
                            <h4 className='mb-2 text-xl font-semibold'>Multi-Language Support</h4>
                            <p className='text-muted-foreground'>Available in multiple languages and currencies</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Section */}
            <section id='booking' className='bg-muted/50 py-16'>
                <div className='container mx-auto px-4'>
                    <div className='mb-12 text-center'>
                        <h3 className='mb-4 text-3xl font-bold'>Book Your Appointment</h3>
                        <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
                            Schedule your service appointment easily. Choose your preferred service, date, and time.
                        </p>
                    </div>

                    <div className='mx-auto max-w-6xl'>
                        <BookingForm services={services} tenant={tenant} />
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            {reviews.length > 0 && (
                <section id='reviews' className='py-16'>
                    <div className='container mx-auto px-4'>
                        <h3 className='mb-8 text-center text-3xl font-bold'>Customer Reviews</h3>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {reviews.slice(0, 6).map((review) => (
                                <div key={review.id} className='bg-card rounded-lg border p-6 shadow-sm'>
                                    <div className='mb-4 flex items-center'>
                                        <div className='mr-2 flex'>{renderStars(review.rating)}</div>
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
                    </div>
                </section>
            )}

            {/* Contact Section */}
            <section id='contact' className='py-16'>
                <div className='container mx-auto px-4'>
                    <h3 className='mb-8 text-center text-3xl font-bold'>Contact Information</h3>
                    <div className='mx-auto max-w-4xl'>
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                            {/* Contact Info */}
                            <div className='text-center md:text-left'>
                                {landingPage.address && (
                                    <div className='mb-6 flex items-start'>
                                        <div className='bg-primary/10 text-primary mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full'>
                                            📍
                                        </div>
                                        <div>
                                            <h4 className='mb-1 font-semibold'>Address</h4>
                                            <p className='text-muted-foreground'>{landingPage.address}</p>
                                        </div>
                                    </div>
                                )}
                                {landingPage.phone && (
                                    <div className='mb-6 flex items-start'>
                                        <div className='bg-primary/10 text-primary mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full'>
                                            📞
                                        </div>
                                        <div>
                                            <h4 className='mb-1 font-semibold'>Phone</h4>
                                            <p className='text-muted-foreground'>{landingPage.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {landingPage.email && (
                                    <div className='mb-6 flex items-start'>
                                        <div className='bg-primary/10 text-primary mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full'>
                                            ✉️
                                        </div>
                                        <div>
                                            <h4 className='mb-1 font-semibold'>Email</h4>
                                            <p className='text-muted-foreground'>{landingPage.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick Booking Form */}
                            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                                <h4 className='mb-4 text-xl font-semibold'>Quick Booking Inquiry</h4>
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
                                            rows={3}
                                            className='border-input focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none'
                                            placeholder='Tell us about your booking requirements...'
                                        />
                                    </div>
                                    <button
                                        type='submit'
                                        className='bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-2 font-semibold transition-colors'>
                                        Send Inquiry
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className='bg-card border-t py-8'>
                <div className='container mx-auto px-4'>
                    <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                        <div>
                            <h4 className='mb-4 text-lg font-semibold'>{tenant.name}</h4>
                            <p className='text-muted-foreground'>{tenant.description || landingPage.description}</p>
                        </div>
                        <div>
                            <h4 className='mb-4 text-lg font-semibold'>Quick Links</h4>
                            <ul className='space-y-2'>
                                <li>
                                    <a href='#booking' className='text-muted-foreground hover:text-primary'>
                                        Book Now
                                    </a>
                                </li>
                                <li>
                                    <a href='#services' className='text-muted-foreground hover:text-primary'>
                                        Services
                                    </a>
                                </li>
                                <li>
                                    <a href='#contact' className='text-muted-foreground hover:text-primary'>
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a href='#reviews' className='text-muted-foreground hover:text-primary'>
                                        Reviews
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className='mb-4 text-lg font-semibold'>Booking Options</h4>
                            <ul className='text-muted-foreground space-y-2'>
                                <li>✓ Online Booking</li>
                                <li>✓ Home Visit Services</li>
                                <li>✓ Flexible Scheduling</li>
                                <li>✓ Multi-language Support</li>
                            </ul>
                        </div>
                    </div>
                    <div className='text-muted-foreground mt-8 border-t pt-8 text-center'>
                        <p>&copy; 2024 {tenant.name}. Powered by Booqing Platform.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
