'use client';

import { useState } from 'react';

interface TenantRegistrationFormProps {
    onClose?: () => void;
}

export default function TenantRegistrationForm({ onClose }: TenantRegistrationFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        subdomain: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        businessType: '',
        description: '',
        acceptTerms: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Auto-generate subdomain from business name
            if (name === 'name' && !formData.subdomain) {
                const subdomain = value.toLowerCase()
                    .replace(/[^a-z0-9]/g, '')
                    .substring(0, 20);
                setFormData(prev => ({ ...prev, subdomain }));
            }
        }

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Business name is required';
        if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required';
        if (formData.subdomain && !/^[a-z0-9]+$/.test(formData.subdomain)) {
            newErrors.subdomain = 'Subdomain can only contain lowercase letters and numbers';
        }
        if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
        if (!formData.ownerEmail.trim()) newErrors.ownerEmail = 'Email is required';
        if (formData.ownerEmail && !/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
            newErrors.ownerEmail = 'Please enter a valid email address';
        }
        if (!formData.ownerPhone.trim()) newErrors.ownerPhone = 'Phone number is required';
        if (!formData.businessType) newErrors.businessType = 'Please select a business type';
        if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/register-tenant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            alert(`Registration successful! Your booking platform will be available at: ${data.tenant.url}`);

            if (onClose) onClose();
        } catch (error: any) {
            console.error('Registration failed:', error);
            alert(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='mx-auto max-w-2xl'>
            <div className='bg-card border rounded-lg p-6 shadow-lg'>
                <div className='mb-6 text-center'>
                    <h2 className='text-3xl font-bold text-primary mb-2'>Create Your Booking Platform</h2>
                    <p className='text-muted-foreground'>Start your professional booking business in minutes</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Business Information */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold border-b pb-2'>Business Information</h3>

                        <div>
                            <label className='block text-sm font-medium mb-1'>Business Name *</label>
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    errors.name ? 'border-red-500' : 'border-input'
                                }`}
                                placeholder='Your Business Name'
                            />
                            {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
                        </div>

                        <div>
                            <label className='block text-sm font-medium mb-1'>Subdomain *</label>
                            <div className='flex items-center'>
                                <input
                                    type='text'
                                    name='subdomain'
                                    value={formData.subdomain}
                                    onChange={handleInputChange}
                                    className={`flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.subdomain ? 'border-red-500' : 'border-input'
                                    }`}
                                    placeholder='yourbusiness'
                                />
                                <span className='bg-muted border border-l-0 px-3 py-2 rounded-r-lg text-muted-foreground'>
                                    .booqing.my.id
                                </span>
                            </div>
                            {errors.subdomain && <p className='text-red-500 text-xs mt-1'>{errors.subdomain}</p>}
                            {formData.subdomain && !errors.subdomain && (
                                <p className='text-green-600 text-xs mt-1'>
                                    Your platform will be available at: {formData.subdomain}.booqing.my.id
                                </p>
                            )}
                        </div>

                        <div>
                            <label className='block text-sm font-medium mb-1'>Business Type *</label>
                            <select
                                name='businessType'
                                value={formData.businessType}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    errors.businessType ? 'border-red-500' : 'border-input'
                                }`}>
                                <option value=''>Select your business type</option>
                                <option value='beauty'>Beauty & Spa</option>
                                <option value='healthcare'>Healthcare</option>
                                <option value='fitness'>Fitness & Wellness</option>
                                <option value='education'>Education & Training</option>
                                <option value='consulting'>Consulting</option>
                                <option value='repair'>Repair & Maintenance</option>
                                <option value='cleaning'>Cleaning Services</option>
                                <option value='photography'>Photography</option>
                                <option value='other'>Other Professional Services</option>
                            </select>
                            {errors.businessType && <p className='text-red-500 text-xs mt-1'>{errors.businessType}</p>}
                        </div>

                        <div>
                            <label className='block text-sm font-medium mb-1'>Business Description</label>
                            <textarea
                                name='description'
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                placeholder='Brief description of your business and services...'
                            />
                        </div>
                    </div>

                    {/* Owner Information */}
                    <div className='space-y-4'>
                        <h3 className='text-lg font-semibold border-b pb-2'>Owner Information</h3>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium mb-1'>Full Name *</label>
                                <input
                                    type='text'
                                    name='ownerName'
                                    value={formData.ownerName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.ownerName ? 'border-red-500' : 'border-input'
                                    }`}
                                    placeholder='Your full name'
                                />
                                {errors.ownerName && <p className='text-red-500 text-xs mt-1'>{errors.ownerName}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-1'>Phone Number *</label>
                                <input
                                    type='tel'
                                    name='ownerPhone'
                                    value={formData.ownerPhone}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.ownerPhone ? 'border-red-500' : 'border-input'
                                    }`}
                                    placeholder='Your phone number'
                                />
                                {errors.ownerPhone && <p className='text-red-500 text-xs mt-1'>{errors.ownerPhone}</p>}
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium mb-1'>Email Address *</label>
                            <input
                                type='email'
                                name='ownerEmail'
                                value={formData.ownerEmail}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    errors.ownerEmail ? 'border-red-500' : 'border-input'
                                }`}
                                placeholder='your@email.com'
                            />
                            {errors.ownerEmail && <p className='text-red-500 text-xs mt-1'>{errors.ownerEmail}</p>}
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className='space-y-4'>
                        <div className='flex items-start space-x-3'>
                            <input
                                type='checkbox'
                                id='acceptTerms'
                                name='acceptTerms'
                                checked={formData.acceptTerms}
                                onChange={handleInputChange}
                                className='mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary'
                            />
                            <label htmlFor='acceptTerms' className='text-sm'>
                                I agree to the{' '}
                                <a href='#' className='text-primary hover:underline'>Terms of Service</a>
                                {' '}and{' '}
                                <a href='#' className='text-primary hover:underline'>Privacy Policy</a>
                            </label>
                        </div>
                        {errors.acceptTerms && <p className='text-red-500 text-xs'>{errors.acceptTerms}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <button
                            type='submit'
                            disabled={isLoading}
                            className='flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-semibold py-3 px-6 rounded-lg transition-colors'>
                            {isLoading ? 'Creating Your Platform...' : 'Create My Booking Platform'}
                        </button>
                        {onClose && (
                            <button
                                type='button'
                                onClick={onClose}
                                className='px-6 py-3 border border-input rounded-lg hover:bg-muted transition-colors'>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* Features Preview */}
                <div className='mt-8 p-4 bg-muted/50 rounded-lg'>
                    <h4 className='font-semibold mb-2'>What you'll get:</h4>
                    <ul className='text-sm space-y-1 text-muted-foreground'>
                        <li>✓ Professional booking website</li>
                        <li>✓ Custom subdomain (yourname.booqing.my.id)</li>
                        <li>✓ Online appointment scheduling</li>
                        <li>✓ Customer management system</li>
                        <li>✓ Email & SMS notifications</li>
                        <li>✓ Mobile-responsive design</li>
                        <li>✓ 30-day free trial</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}