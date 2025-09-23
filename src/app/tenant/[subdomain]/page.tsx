import TenantLandingPage from '@/components/tenant-landing-page';

interface TenantPageProps {
    params: Promise<{ subdomain: string }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
    const { subdomain } = await params;

    // TODO: Fetch from database
    const mockTenant = {
        name: subdomain,
        description: `Welcome to ${subdomain}'s booking platform`,
        currency: 'USD',
        language: 'en'
    };

    const mockLandingPage = {
        title: `Book with ${subdomain}`,
        subtitle: 'Professional Services at Your Convenience',
        description:
            'Schedule your appointments easily with our flexible booking system. Daily or hourly slots available.',
        images: [
            'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
        ],
        address: '123 Main Street, City, Country',
        phone: '+1 (555) 123-4567',
        email: `contact@${subdomain}.com`
    };

    const mockServices = [
        {
            id: '1',
            name: 'Consultation',
            description: 'Professional consultation service with detailed analysis and recommendations',
            price: 100,
            duration: 60,
            isActive: true
        },
        {
            id: '2',
            name: 'Home Visit',
            description: 'Convenient home visit service with complete on-site assistance',
            price: 150,
            duration: 90,
            isActive: true
        },
        {
            id: '3',
            name: 'Premium Package',
            description: 'Comprehensive premium package with full support and follow-up',
            price: 250,
            duration: 120,
            isActive: true
        }
    ];

    const mockReviews = [
        {
            id: '1',
            rating: 5,
            comment: 'Excellent service! Very professional and punctual. Highly recommended.',
            customerName: 'John Smith',
            createdAt: '2024-01-15'
        },
        {
            id: '2',
            rating: 4,
            comment: 'Great experience overall. The booking process was smooth and easy.',
            customerName: 'Sarah Johnson',
            createdAt: '2024-01-10'
        },
        {
            id: '3',
            rating: 5,
            comment: 'Outstanding quality of service. Will definitely book again!',
            customerName: 'Michael Brown',
            createdAt: '2024-01-05'
        }
    ];

    return (
        <TenantLandingPage
            tenant={mockTenant}
            landingPage={mockLandingPage}
            services={mockServices}
            reviews={mockReviews}
        />
    );
}
