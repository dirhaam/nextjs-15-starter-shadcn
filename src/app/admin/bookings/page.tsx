'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Calendar } from '@/registry/new-york-v4/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/new-york-v4/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';

import { format } from 'date-fns';
import { CalendarIcon, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
    id: string;
    tenantSubdomain: string;
    customerName: string;
    serviceName: string;
    date: number;
    time: string;
    status: string;
    amount: number;
}

export default function BookingOverview() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        startDate: '',
        endDate: ''
    });
    const [date, setDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        fetchBookings();
    }, [filters]);

    const fetchBookings = async () => {
        try {
            const params = new URLSearchParams({
                ...filters,
                startDate: filters.startDate ? Math.floor(new Date(filters.startDate).getTime() / 1000).toString() : '',
                endDate: filters.endDate ? Math.floor(new Date(filters.endDate).getTime() / 1000).toString() : ''
            });

            const res = await fetch(`/api/admin/bookings?${params}`);
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            } else {
                toast.error('Failed to fetch bookings');
            }
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
    };

    const handleStatusChange = (value: string) => {
        setFilters((prev) => ({ ...prev, status: value }));
    };

    const handleDateChange = (value: Date | undefined) => {
        if (value) {
            setFilters((prev) => ({
                ...prev,
                startDate: format(value, 'yyyy-MM-dd'),
                endDate: format(value, 'yyyy-MM-dd')
            }));
            setDate(value);
        }
    };

    const exportToXLS = async () => {
        if (bookings.length === 0) return;

        const XLSX = await import('xlsx');
        const wsData = [
            ['ID', 'Tenant', 'Customer', 'Service', 'Date', 'Time', 'Status', 'Amount'],
            ...bookings.map((b) => [
                b.id,
                b.tenantSubdomain,
                b.customerName,
                b.serviceName,
                new Date(b.date).toLocaleDateString(),
                b.time,
                b.status,
                b.amount
            ])
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
        XLSX.writeFile(wb, 'bookings-report.xlsx');
        toast.success('Bookings exported to XLS');
    };

    const exportToPDF = async () => {
        if (bookings.length === 0) return;

        const { PDFDocument, StandardFonts } = await import('pdf-lib');

        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        let page = pdfDoc.addPage([700, 1000]);
        page.drawText('Bookings Report', { x: 50, y: 950, size: 20, font: timesRomanFont });
        let y = 900;
        page.drawText('ID', { x: 50, y, size: 10, font: timesRomanFont });
        page.drawText('Tenant', { x: 100, y, size: 10, font: timesRomanFont });
        page.drawText('Customer', { x: 200, y, size: 10, font: timesRomanFont });
        page.drawText('Service', { x: 300, y, size: 10, font: timesRomanFont });
        page.drawText('Date', { x: 400, y, size: 10, font: timesRomanFont });
        page.drawText('Status', { x: 500, y, size: 10, font: timesRomanFont });
        page.drawText('Amount', { x: 600, y, size: 10, font: timesRomanFont });
        y -= 20;
        bookings.forEach((b) => {
            page.drawText(b.id, { x: 50, y, size: 8, font: timesRomanFont });
            page.drawText(b.tenantSubdomain, { x: 100, y, size: 8, font: timesRomanFont });
            page.drawText(b.customerName, { x: 200, y, size: 8, font: timesRomanFont });
            page.drawText(b.serviceName, { x: 300, y, size: 8, font: timesRomanFont });
            page.drawText(new Date(b.date).toLocaleDateString(), { x: 400, y, size: 8, font: timesRomanFont });
            page.drawText(b.status, { x: 500, y, size: 8, font: timesRomanFont });
            page.drawText(`$${b.amount}`, { x: 600, y, size: 8, font: timesRomanFont });
            y -= 15;
            if (y < 50) {
                y = 950;
                page = pdfDoc.addPage([700, 1000]);
            }
        });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings-report.pdf';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Bookings exported to PDF');
    };

    if (loading) {
        return <div className='p-8'>Loading bookings...</div>;
    }

    return (
        <div className='container mx-auto p-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Booking Overview</CardTitle>
                    <CardDescription>View and export bookings across all tenants</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='mb-6 flex flex-wrap gap-4'>
                        <div className='flex flex-col'>
                            <Label>Search Customer</Label>
                            <Input
                                placeholder='Search...'
                                value={filters.search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <Label>Status</Label>
                            <Select value={filters.status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder='All statuses' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=''>All</SelectItem>
                                    <SelectItem value='pending'>Pending</SelectItem>
                                    <SelectItem value='confirmed'>Confirmed</SelectItem>
                                    <SelectItem value='completed'>Completed</SelectItem>
                                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex flex-col'>
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant='outline'>
                                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0' align='start'>
                                    <Calendar mode='single' selected={date} onSelect={handleDateChange} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Button onClick={exportToXLS}>
                                <Download className='mr-2 h-4 w-4' />
                                XLS
                            </Button>
                            <Button onClick={exportToPDF}>
                                <Download className='mr-2 h-4 w-4' />
                                PDF
                            </Button>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Tenant</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell>{booking.tenantSubdomain}</TableCell>
                                    <TableCell>{booking.customerName}</TableCell>
                                    <TableCell>{booking.serviceName}</TableCell>
                                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{booking.time}</TableCell>
                                    <TableCell>
                                        <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${booking.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
