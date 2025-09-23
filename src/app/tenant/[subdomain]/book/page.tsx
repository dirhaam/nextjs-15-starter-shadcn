import BookingForm from '@/components/booking-form';

interface BookPageProps {
    params: Promise<{ subdomain: string }>;
    searchParams: Promise<{ service?: string }>;
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
    const { subdomain } = await params;
    const { service: selectedServiceId } = await searchParams;

    // TODO: Fetch from database
    const mockTenant = {
        name: subdomain,
        currency: 'USD'
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

    return (
        <BookingForm
            services={mockServices}
            selectedServiceId={selectedServiceId}
            tenant={mockTenant}
        />
    );
}
