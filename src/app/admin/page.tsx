'use client';

import { useState } from 'react';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data - in real app this would come from API
    const stats = {
        totalTenants: 125,
        activeBookings: 2456,
        totalRevenue: 125680,
        premiumTenants: 23,
        monthlyGrowth: 12.5,
        avgBookingsPerTenant: 19.6
    };

    const recentBookings = [
        {
            id: '1',
            tenant: 'beautyspa',
            customer: 'Sarah Johnson',
            service: 'Facial Treatment',
            amount: 85,
            date: '2024-01-20',
            status: 'confirmed'
        },
        {
            id: '2',
            tenant: 'dentalcare',
            customer: 'Mike Chen',
            service: 'Teeth Cleaning',
            amount: 120,
            date: '2024-01-20',
            status: 'pending'
        },
        {
            id: '3',
            tenant: 'fitnesspro',
            customer: 'Emma Davis',
            service: 'Personal Training',
            amount: 75,
            date: '2024-01-19',
            status: 'completed'
        }
    ];

    const tenants = [
        {
            id: '1',
            name: 'Beauty Spa Elite',
            subdomain: 'beautyspa',
            status: 'active',
            plan: 'professional',
            bookings: 145,
            revenue: 12400,
            owner: 'Sarah Williams',
            joinDate: '2023-08-15',
            lastActive: '2024-01-20'
        },
        {
            id: '2',
            name: 'Dental Care Plus',
            subdomain: 'dentalcare',
            status: 'active',
            plan: 'starter',
            bookings: 89,
            revenue: 8900,
            owner: 'Dr. Michael Chen',
            joinDate: '2023-09-22',
            lastActive: '2024-01-19'
        },
        {
            id: '3',
            name: 'Fitness Pro Studio',
            subdomain: 'fitnesspro',
            status: 'active',
            plan: 'enterprise',
            bookings: 267,
            revenue: 18600,
            owner: 'Jake Thompson',
            joinDate: '2023-07-10',
            lastActive: '2024-01-20'
        },
        {
            id: '4',
            name: 'Home Clean Masters',
            subdomain: 'homeclean',
            status: 'suspended',
            plan: 'starter',
            bookings: 12,
            revenue: 450,
            owner: 'Maria Rodriguez',
            joinDate: '2024-01-05',
            lastActive: '2024-01-15'
        }
    ];

    const premiumFeatures = [
        {
            id: 'whatsapp',
            name: 'WhatsApp Business API',
            description: 'Enable WhatsApp notifications for premium tenants',
            activeTenants: 18,
            revenue: 2340
        },
        {
            id: 'analytics',
            name: 'Advanced Analytics',
            description: 'Detailed reporting and insights dashboard',
            activeTenants: 23,
            revenue: 1150
        },
        {
            id: 'customdomain',
            name: 'Custom Domain',
            description: 'Allow tenants to use their own domain names',
            activeTenants: 8,
            revenue: 800
        },
        {
            id: 'api',
            name: 'API Access',
            description: 'Full API access for integrations',
            activeTenants: 5,
            revenue: 500
        }
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'no-show': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case 'starter': return 'bg-gray-100 text-gray-800';
            case 'professional': return 'bg-blue-100 text-blue-800';
            case 'enterprise': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='bg-background min-h-screen'>
            {/* Header */}
            <div className='bg-card border-b px-6 py-4'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-primary text-2xl font-bold'>Booqing Admin Dashboard</h1>
                    <div className='flex items-center space-x-4'>
                        <a href='/' className='text-muted-foreground hover:text-primary text-sm transition-colors'>
                            ← Back to Landing Page
                        </a>
                        <span className='text-muted-foreground text-sm'>Welcome, Admin</span>
                        <button className='bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm'>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className='flex'>
                {/* Sidebar */}
                <div className='bg-card min-h-screen w-64 border-r'>
                    <nav className='space-y-2 p-4'>
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${
                                activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}>
                            📊 Dashboard Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('tenants')}
                            className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${
                                activeTab === 'tenants' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}>
                            🏢 Tenant Management
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${
                                activeTab === 'bookings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}>
                            📅 Booking Monitoring
                        </button>
                        <button
                            onClick={() => setActiveTab('premium')}
                            className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${
                                activeTab === 'premium' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}>
                            ⭐ Premium Features
                        </button>
                        <button
                            onClick={() => setActiveTab('financial')}
                            className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${
                                activeTab === 'financial' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}>
                            💰 Financial Reports
                        </button>
                        <button
                            onClick={() => setActiveTab('system')}
                            className={`w-full rounded-lg px-4 py-2 text-left transition-colors ${
                                activeTab === 'system' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}>
                            ⚙️ System Settings
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className='flex-1 p-6'>
                    {activeTab === 'overview' && (
                        <div className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-2xl font-bold'>Platform Overview</h2>
                                <div className='flex items-center space-x-2'>
                                    <span className='text-sm text-muted-foreground'>Last updated:</span>
                                    <span className='text-sm font-medium'>{new Date().toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Enhanced Stats Cards */}
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Total Tenants</p>
                                            <p className='text-primary text-3xl font-bold'>{stats.totalTenants}</p>
                                            <p className='text-green-600 text-xs'>↗ +{stats.monthlyGrowth}% this month</p>
                                        </div>
                                        <div className='text-3xl'>🏢</div>
                                    </div>
                                </div>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Active Bookings</p>
                                            <p className='text-primary text-3xl font-bold'>{stats.activeBookings.toLocaleString()}</p>
                                            <p className='text-muted-foreground text-xs'>Avg: {stats.avgBookingsPerTenant}/tenant</p>
                                        </div>
                                        <div className='text-3xl'>📅</div>
                                    </div>
                                </div>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Platform Revenue</p>
                                            <p className='text-primary text-3xl font-bold'>
                                                {formatCurrency(stats.totalRevenue)}
                                            </p>
                                            <p className='text-green-600 text-xs'>↗ Monthly recurring</p>
                                        </div>
                                        <div className='text-3xl'>💰</div>
                                    </div>
                                </div>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Premium Tenants</p>
                                            <p className='text-primary text-3xl font-bold'>{stats.premiumTenants}</p>
                                            <p className='text-muted-foreground text-xs'>{((stats.premiumTenants/stats.totalTenants)*100).toFixed(1)}% conversion</p>
                                        </div>
                                        <div className='text-3xl'>⭐</div>
                                    </div>
                                </div>
                            </div>

                            {/* Platform Health */}
                            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                {/* Recent Activity */}
                                <div className='bg-card rounded-lg border p-6'>
                                    <h3 className='mb-4 text-xl font-semibold'>Recent Platform Activity</h3>
                                    <div className='space-y-3'>
                                        {recentBookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className='flex items-center justify-between border-b pb-3'>
                                                <div>
                                                    <p className='font-semibold'>{booking.customer}</p>
                                                    <p className='text-muted-foreground text-sm'>
                                                        {booking.service} • {booking.tenant} • {formatCurrency(booking.amount)}
                                                    </p>
                                                </div>
                                                <div className='text-right'>
                                                    <p className='text-sm'>{booking.date}</p>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* System Status */}
                                <div className='bg-card rounded-lg border p-6'>
                                    <h3 className='mb-4 text-xl font-semibold'>System Health</h3>
                                    <div className='space-y-4'>
                                        <div className='flex items-center justify-between'>
                                            <span>Platform Uptime</span>
                                            <div className='flex items-center'>
                                                <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                                                <span className='text-green-600 font-semibold'>99.9%</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <span>Database Status</span>
                                            <div className='flex items-center'>
                                                <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                                                <span className='text-green-600 font-semibold'>Healthy</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <span>API Response Time</span>
                                            <span className='font-semibold'>142ms</span>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <span>Storage Usage</span>
                                            <span className='font-semibold'>64% (12.8GB)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className='bg-card rounded-lg border p-6'>
                                <h3 className='mb-4 text-xl font-semibold'>Quick Actions</h3>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                    <button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-3 font-semibold transition-colors'>
                                        Create New Tenant
                                    </button>
                                    <button className='border-primary text-primary hover:bg-primary/10 rounded-lg border px-4 py-3 font-semibold transition-colors'>
                                        Send Platform Announcement
                                    </button>
                                    <button className='border-primary text-primary hover:bg-primary/10 rounded-lg border px-4 py-3 font-semibold transition-colors'>
                                        Export Monthly Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tenants' && (
                        <div className='space-y-6'>
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <h2 className='text-2xl font-bold'>Tenant Management</h2>
                                    <button className='bg-primary text-primary-foreground rounded-lg px-4 py-2'>
                                        Add New Tenant
                                    </button>
                                </div>
                                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                                    <p className='text-sm text-blue-800'>
                                        <strong>💡 Localhost Testing:</strong> Click the "localhost/tenant/[subdomain]"
                                        links to test tenant websites on your local development server.
                                    </p>
                                </div>
                            </div>

                            <div className='bg-card overflow-hidden rounded-lg border'>
                                <table className='w-full'>
                                    <thead className='bg-muted'>
                                        <tr>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Tenant</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Subdomain</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Status</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Plan</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Bookings</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y'>
                                        {tenants.map((tenant) => (
                                            <tr key={tenant.id}>
                                                <td className='px-6 py-4'>{tenant.name}</td>
                                                <td className='px-6 py-4'>
                                                    <div className='space-y-1'>
                                                        <a
                                                            href={`https://${tenant.subdomain}.booqing.my.id`}
                                                            className='text-primary block hover:underline'
                                                            target='_blank'
                                                            rel='noopener noreferrer'>
                                                            {tenant.subdomain}.booqing.my.id
                                                        </a>
                                                        <a
                                                            href={`/tenant/${tenant.subdomain}`}
                                                            className='text-muted-foreground hover:text-primary text-sm'
                                                            target='_blank'
                                                            rel='noopener noreferrer'>
                                                            localhost/tenant/{tenant.subdomain}
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs ${
                                                            tenant.status === 'active'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {tenant.status}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs ${getPlanColor(tenant.plan)}`}>
                                                        {tenant.plan}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>{tenant.bookings}</td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex space-x-2'>
                                                        <button className='text-primary text-sm hover:underline'>
                                                            Edit
                                                        </button>
                                                        <button className='text-sm text-red-600 hover:underline'>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-2xl font-bold'>Booking Management</h2>
                                <div className='flex space-x-2'>
                                    <button className='border-primary text-primary hover:bg-primary/10 rounded-lg border px-4 py-2'>
                                        Export Report
                                    </button>
                                </div>
                            </div>

                            {/* Booking Stats */}
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
                                <div className='bg-card rounded-lg border p-4'>
                                    <p className='text-muted-foreground text-sm'>Today's Bookings</p>
                                    <p className='text-primary text-2xl font-bold'>32</p>
                                    <p className='text-green-600 text-xs'>↗ +12% from yesterday</p>
                                </div>
                                <div className='bg-card rounded-lg border p-4'>
                                    <p className='text-muted-foreground text-sm'>Pending Confirmation</p>
                                    <p className='text-yellow-600 text-2xl font-bold'>8</p>
                                    <p className='text-muted-foreground text-xs'>Requires attention</p>
                                </div>
                                <div className='bg-card rounded-lg border p-4'>
                                    <p className='text-muted-foreground text-sm'>This Month</p>
                                    <p className='text-primary text-2xl font-bold'>1,247</p>
                                    <p className='text-green-600 text-xs'>↗ +23% growth</p>
                                </div>
                                <div className='bg-card rounded-lg border p-4'>
                                    <p className='text-muted-foreground text-sm'>No-Show Rate</p>
                                    <p className='text-red-600 text-2xl font-bold'>3.2%</p>
                                    <p className='text-green-600 text-xs'>↓ -1.1% improvement</p>
                                </div>
                            </div>

                            {/* Recent Bookings Table */}
                            <div className='bg-card overflow-hidden rounded-lg border'>
                                <div className='px-6 py-4 border-b bg-muted'>
                                    <h3 className='text-lg font-semibold'>Recent Bookings Across All Tenants</h3>
                                </div>
                                <table className='w-full'>
                                    <thead className='bg-muted/50'>
                                        <tr>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Customer</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Tenant</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Service</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Date & Time</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Amount</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Status</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y'>
                                        {[
                                            {
                                                id: '1',
                                                customer: 'Sarah Johnson',
                                                tenant: 'beautyspa',
                                                service: 'Facial Treatment',
                                                datetime: '2024-01-20 14:00',
                                                amount: 85,
                                                status: 'confirmed'
                                            },
                                            {
                                                id: '2',
                                                customer: 'Mike Chen',
                                                tenant: 'dentalcare',
                                                service: 'Teeth Cleaning',
                                                datetime: '2024-01-20 10:30',
                                                amount: 120,
                                                status: 'pending'
                                            },
                                            {
                                                id: '3',
                                                customer: 'Emma Davis',
                                                tenant: 'fitnesspro',
                                                service: 'Personal Training',
                                                datetime: '2024-01-19 16:00',
                                                amount: 75,
                                                status: 'completed'
                                            },
                                            {
                                                id: '4',
                                                customer: 'John Smith',
                                                tenant: 'beautyspa',
                                                service: 'Hair Cut & Style',
                                                datetime: '2024-01-19 11:00',
                                                amount: 65,
                                                status: 'no-show'
                                            }
                                        ].map((booking) => (
                                            <tr key={booking.id}>
                                                <td className='px-6 py-4'>
                                                    <div>
                                                        <p className='font-semibold'>{booking.customer}</p>
                                                        <p className='text-muted-foreground text-sm'>#{booking.id}</p>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <span className='bg-primary/10 text-primary rounded px-2 py-1 text-sm'>
                                                        {booking.tenant}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>{booking.service}</td>
                                                <td className='px-6 py-4'>
                                                    <div>
                                                        <p className='text-sm'>{booking.datetime.split(' ')[0]}</p>
                                                        <p className='text-muted-foreground text-xs'>{booking.datetime.split(' ')[1]}</p>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 font-semibold'>{formatCurrency(booking.amount)}</td>
                                                <td className='px-6 py-4'>
                                                    <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex space-x-2'>
                                                        <button className='text-primary text-sm hover:underline'>
                                                            View
                                                        </button>
                                                        {booking.status === 'pending' && (
                                                            <button className='text-green-600 text-sm hover:underline'>
                                                                Confirm
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'premium' && (
                        <div className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-2xl font-bold'>Premium Features Management</h2>
                                <button className='bg-primary text-primary-foreground rounded-lg px-4 py-2'>
                                    Add New Feature
                                </button>
                            </div>

                            {/* Premium Revenue Overview */}
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Premium Revenue</p>
                                            <p className='text-primary text-3xl font-bold'>{formatCurrency(4790)}</p>
                                            <p className='text-green-600 text-xs'>↗ +15% this month</p>
                                        </div>
                                        <div className='text-3xl'>💰</div>
                                    </div>
                                </div>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Active Premium Users</p>
                                            <p className='text-primary text-3xl font-bold'>23</p>
                                            <p className='text-muted-foreground text-xs'>18.4% of total tenants</p>
                                        </div>
                                        <div className='text-3xl'>⭐</div>
                                    </div>
                                </div>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Features Active</p>
                                            <p className='text-primary text-3xl font-bold'>4</p>
                                            <p className='text-green-600 text-xs'>All features deployed</p>
                                        </div>
                                        <div className='text-3xl'>🚀</div>
                                    </div>
                                </div>
                            </div>

                            {/* Premium Features Grid */}
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                {premiumFeatures.map((feature) => (
                                    <div key={feature.id} className='bg-card rounded-lg border p-6'>
                                        <div className='flex items-center justify-between mb-4'>
                                            <h3 className='text-lg font-semibold'>{feature.name}</h3>
                                            <span className='bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs'>
                                                Active
                                            </span>
                                        </div>
                                        <p className='text-muted-foreground text-sm mb-4'>{feature.description}</p>

                                        <div className='grid grid-cols-2 gap-4 mb-4'>
                                            <div>
                                                <p className='text-muted-foreground text-xs'>Active Tenants</p>
                                                <p className='text-primary text-xl font-bold'>{feature.activeTenants}</p>
                                            </div>
                                            <div>
                                                <p className='text-muted-foreground text-xs'>Monthly Revenue</p>
                                                <p className='text-primary text-xl font-bold'>{formatCurrency(feature.revenue)}</p>
                                            </div>
                                        </div>

                                        <div className='flex space-x-2'>
                                            <button className='bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded px-3 py-2 text-sm transition-colors'>
                                                Manage Settings
                                            </button>
                                            <button className='border-primary text-primary hover:bg-primary/10 rounded border px-3 py-2 text-sm transition-colors'>
                                                View Usage
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Feature Usage Analytics */}
                            <div className='bg-card rounded-lg border p-6'>
                                <h3 className='text-xl font-semibold mb-4'>Feature Adoption Analytics</h3>
                                <div className='space-y-4'>
                                    {premiumFeatures.map((feature) => {
                                        const adoptionRate = ((feature.activeTenants / stats.premiumTenants) * 100).toFixed(1);
                                        return (
                                            <div key={feature.id} className='flex items-center justify-between'>
                                                <div className='flex-1'>
                                                    <div className='flex items-center justify-between mb-1'>
                                                        <span className='text-sm font-medium'>{feature.name}</span>
                                                        <span className='text-sm text-muted-foreground'>{adoptionRate}%</span>
                                                    </div>
                                                    <div className='bg-muted h-2 rounded-full'>
                                                        <div
                                                            className='bg-primary h-2 rounded-full transition-all duration-300'
                                                            style={{ width: `${adoptionRate}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='ml-4 text-sm text-muted-foreground'>
                                                    {feature.activeTenants}/{stats.premiumTenants} users
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'financial' && (
                        <div className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-2xl font-bold'>Financial Reports</h2>
                                <div className='flex space-x-2'>
                                    <button className='border-primary text-primary hover:bg-primary/10 rounded-lg border px-4 py-2'>
                                        Export Financial Report
                                    </button>
                                </div>
                            </div>

                            {/* Financial Overview */}
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Total Platform Revenue</p>
                                            <p className='text-primary text-3xl font-bold'>{formatCurrency(stats.totalRevenue)}</p>
                                            <p className='text-green-600 text-xs'>↗ +18% this quarter</p>
                                        </div>
                                        <div className='text-3xl'>💰</div>
                                    </div>
                                </div>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Monthly Recurring Revenue</p>
                                            <p className='text-primary text-3xl font-bold'>{formatCurrency(8450)}</p>
                                            <p className='text-green-600 text-xs'>↗ +12% growth</p>
                                        </div>
                                        <div className='text-3xl'>📈</div>
                                    </div>
                                </div>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Average Revenue Per User</p>
                                            <p className='text-primary text-3xl font-bold'>{formatCurrency(67.6)}</p>
                                            <p className='text-muted-foreground text-xs'>Per tenant/month</p>
                                        </div>
                                        <div className='text-3xl'>💎</div>
                                    </div>
                                </div>
                                <div className='bg-card rounded-lg border p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-muted-foreground text-sm'>Churn Rate</p>
                                            <p className='text-red-600 text-3xl font-bold'>2.1%</p>
                                            <p className='text-green-600 text-xs'>↓ -0.5% improvement</p>
                                        </div>
                                        <div className='text-3xl'>📉</div>
                                    </div>
                                </div>
                            </div>

                            {/* Revenue Breakdown */}
                            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                <div className='bg-card rounded-lg border p-6'>
                                    <h3 className='text-xl font-semibold mb-4'>Revenue by Plan</h3>
                                    <div className='space-y-4'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <div className='w-4 h-4 bg-purple-500 rounded mr-3'></div>
                                                <span>Enterprise Plan</span>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-semibold'>{formatCurrency(4950)}</p>
                                                <p className='text-muted-foreground text-xs'>39.4%</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <div className='w-4 h-4 bg-blue-500 rounded mr-3'></div>
                                                <span>Professional Plan</span>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-semibold'>{formatCurrency(3625)}</p>
                                                <p className='text-muted-foreground text-xs'>28.8%</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <div className='w-4 h-4 bg-gray-400 rounded mr-3'></div>
                                                <span>Starter Plan</span>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-semibold'>{formatCurrency(0)}</p>
                                                <p className='text-muted-foreground text-xs'>0% (Free)</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <div className='w-4 h-4 bg-yellow-500 rounded mr-3'></div>
                                                <span>Premium Add-ons</span>
                                            </div>
                                            <div className='text-right'>
                                                <p className='font-semibold'>{formatCurrency(3995)}</p>
                                                <p className='text-muted-foreground text-xs'>31.8%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='bg-card rounded-lg border p-6'>
                                    <h3 className='text-xl font-semibold mb-4'>Top Performing Tenants</h3>
                                    <div className='space-y-4'>
                                        {tenants
                                            .sort((a, b) => b.revenue - a.revenue)
                                            .slice(0, 4)
                                            .map((tenant, index) => (
                                                <div key={tenant.id} className='flex items-center justify-between'>
                                                    <div className='flex items-center'>
                                                        <div className='text-muted-foreground mr-3 text-sm w-4'>#{index + 1}</div>
                                                        <div>
                                                            <p className='font-semibold'>{tenant.name}</p>
                                                            <p className='text-muted-foreground text-xs'>{tenant.subdomain}</p>
                                                        </div>
                                                    </div>
                                                    <div className='text-right'>
                                                        <p className='font-semibold'>{formatCurrency(tenant.revenue)}</p>
                                                        <p className='text-muted-foreground text-xs'>{tenant.bookings} bookings</p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Analytics */}
                            <div className='bg-card rounded-lg border p-6'>
                                <h3 className='text-xl font-semibold mb-4'>Payment Analytics</h3>
                                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                                    <div className='text-center'>
                                        <p className='text-muted-foreground text-sm mb-2'>Transaction Success Rate</p>
                                        <p className='text-primary text-2xl font-bold'>98.7%</p>
                                        <p className='text-green-600 text-xs'>↗ +0.3% improvement</p>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-muted-foreground text-sm mb-2'>Average Transaction Value</p>
                                        <p className='text-primary text-2xl font-bold'>{formatCurrency(87.50)}</p>
                                        <p className='text-green-600 text-xs'>↗ +5.2% increase</p>
                                    </div>
                                    <div className='text-center'>
                                        <p className='text-muted-foreground text-sm mb-2'>Failed Payments</p>
                                        <p className='text-red-600 text-2xl font-bold'>1.3%</p>
                                        <p className='text-green-600 text-xs'>↓ -0.3% reduction</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className='bg-card overflow-hidden rounded-lg border'>
                                <div className='px-6 py-4 border-b bg-muted'>
                                    <h3 className='text-lg font-semibold'>Recent Platform Transactions</h3>
                                </div>
                                <table className='w-full'>
                                    <thead className='bg-muted/50'>
                                        <tr>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Date</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Tenant</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Plan/Feature</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Amount</th>
                                            <th className='px-6 py-3 text-left text-sm font-semibold'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y'>
                                        {[
                                            { date: '2024-01-20', tenant: 'fitnesspro', plan: 'Enterprise Plan', amount: 99, status: 'completed' },
                                            { date: '2024-01-20', tenant: 'beautyspa', plan: 'WhatsApp API', amount: 30, status: 'completed' },
                                            { date: '2024-01-19', tenant: 'dentalcare', plan: 'Professional Plan', amount: 29, status: 'completed' },
                                            { date: '2024-01-19', tenant: 'homeclean', plan: 'Professional Plan', amount: 29, status: 'failed' },
                                            { date: '2024-01-18', tenant: 'beautyspa', plan: 'Custom Domain', amount: 10, status: 'completed' }
                                        ].map((transaction, index) => (
                                            <tr key={index}>
                                                <td className='px-6 py-4 text-sm'>{transaction.date}</td>
                                                <td className='px-6 py-4'>
                                                    <span className='bg-primary/10 text-primary rounded px-2 py-1 text-sm'>
                                                        {transaction.tenant}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4'>{transaction.plan}</td>
                                                <td className='px-6 py-4 font-semibold'>{formatCurrency(transaction.amount)}</td>
                                                <td className='px-6 py-4'>
                                                    <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(transaction.status)}`}>
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
