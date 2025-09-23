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

interface BookingFormProps {
    services: Service[];
    selectedServiceId?: string;
    tenant: {
        name: string;
        currency?: string;
    };
}

export default function BookingForm({ services, selectedServiceId, tenant }: BookingFormProps) {
    const [formData, setFormData] = useState({
        serviceId: selectedServiceId || '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        date: '',
        time: '',
        isHomeVisit: false,
        location: '',
        notes: ''
    });

    const currency = tenant.currency || 'USD';
    const selectedService = services.find(s => s.id === formData.serviceId);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const formatDuration = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Submit booking to API
        console.log('Booking data:', formData);
        alert('Booking submitted successfully! We will contact you soon.');
    };

    return (
        <div className='min-h-screen bg-background py-8'>
            <div className='container mx-auto px-4'>
                <div className='max-w-4xl mx-auto'>
                    <div className='mb-8 text-center'>
                        <h1 className='text-4xl font-bold text-primary mb-4'>Book Your Appointment</h1>
                        <p className='text-muted-foreground text-lg'>Choose your service and schedule your appointment</p>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Booking Form */}
                        <div className='bg-card border rounded-lg p-6 shadow-sm'>
                            <h2 className='text-2xl font-semibold mb-6'>Booking Details</h2>

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                {/* Service Selection */}
                                <div>
                                    <label className='block text-sm font-medium mb-2'>Select Service *</label>
                                    <select
                                        name='serviceId'
                                        value={formData.serviceId}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'>
                                        <option value=''>Choose a service...</option>
                                        {services.filter(s => s.isActive).map(service => (
                                            <option key={service.id} value={service.id}>
                                                {service.name} - {formatPrice(service.price)} ({formatDuration(service.duration)})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Customer Information */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium mb-1'>Full Name *</label>
                                        <input
                                            type='text'
                                            name='customerName'
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            required
                                            className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                            placeholder='Your full name'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium mb-1'>Email *</label>
                                        <input
                                            type='email'
                                            name='customerEmail'
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            required
                                            className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                            placeholder='your@email.com'
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium mb-1'>Phone Number *</label>
                                    <input
                                        type='tel'
                                        name='customerPhone'
                                        value={formData.customerPhone}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                        placeholder='Your phone number'
                                    />
                                </div>

                                {/* Date and Time */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium mb-1'>Date *</label>
                                        <input
                                            type='date'
                                            name='date'
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium mb-1'>Time *</label>
                                        <input
                                            type='time'
                                            name='time'
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                        />
                                    </div>
                                </div>

                                {/* Home Visit Option */}
                                <div className='flex items-center space-x-3'>
                                    <input
                                        type='checkbox'
                                        id='isHomeVisit'
                                        name='isHomeVisit'
                                        checked={formData.isHomeVisit}
                                        onChange={handleInputChange}
                                        className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary'
                                    />
                                    <label htmlFor='isHomeVisit' className='text-sm font-medium'>
                                        Request Home Visit Service
                                    </label>
                                </div>

                                {/* Location for Home Visit */}
                                {formData.isHomeVisit && (
                                    <div>
                                        <label className='block text-sm font-medium mb-1'>Location Address *</label>
                                        <input
                                            type='text'
                                            name='location'
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required={formData.isHomeVisit}
                                            className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                            placeholder='Enter your full address'
                                        />
                                        <p className='text-xs text-muted-foreground mt-1'>
                                            We'll use this address for navigation and routing
                                        </p>
                                    </div>
                                )}

                                {/* Additional Notes */}
                                <div>
                                    <label className='block text-sm font-medium mb-1'>Additional Notes</label>
                                    <textarea
                                        name='notes'
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                        placeholder='Any special requirements or notes...'
                                    />
                                </div>

                                <button
                                    type='submit'
                                    className='w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 px-6 rounded-lg transition-colors'>
                                    Book Appointment
                                </button>
                            </form>
                        </div>

                        {/* Booking Summary */}
                        <div className='bg-card border rounded-lg p-6 shadow-sm h-fit'>
                            <h2 className='text-2xl font-semibold mb-6'>Booking Summary</h2>

                            {selectedService ? (
                                <div className='space-y-4'>
                                    <div className='border-b pb-4'>
                                        <h3 className='text-lg font-semibold text-primary'>{selectedService.name}</h3>
                                        <p className='text-muted-foreground text-sm mt-1'>{selectedService.description}</p>
                                    </div>

                                    <div className='space-y-2'>
                                        <div className='flex justify-between'>
                                            <span>Service Price:</span>
                                            <span className='font-semibold'>{formatPrice(selectedService.price)}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Duration:</span>
                                            <span>{formatDuration(selectedService.duration)}</span>
                                        </div>
                                        {formData.isHomeVisit && (
                                            <div className='flex justify-between text-green-600'>
                                                <span>Home Visit:</span>
                                                <span>✓ Included</span>
                                            </div>
                                        )}
                                    </div>

                                    {formData.date && formData.time && (
                                        <div className='border-t pt-4'>
                                            <h4 className='font-semibold mb-2'>Appointment Details</h4>
                                            <div className='space-y-1 text-sm'>
                                                <div className='flex justify-between'>
                                                    <span>Date:</span>
                                                    <span>{new Date(formData.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span>Time:</span>
                                                    <span>{formData.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className='border-t pt-4'>
                                        <div className='flex justify-between text-lg font-bold'>
                                            <span>Total:</span>
                                            <span className='text-primary'>{formatPrice(selectedService.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className='text-muted-foreground'>Please select a service to see pricing details.</p>
                            )}

                            <div className='mt-6 p-4 bg-muted/50 rounded-lg'>
                                <h4 className='font-semibold mb-2'>What to Expect</h4>
                                <ul className='text-sm space-y-1 text-muted-foreground'>
                                    <li>• Confirmation email will be sent within 1 hour</li>
                                    <li>• WhatsApp/SMS reminder 24 hours before</li>
                                    <li>• Professional and punctual service</li>
                                    <li>• Satisfaction guaranteed</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}