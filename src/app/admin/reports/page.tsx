'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';

import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ReportData {
    totalRevenue: number;
    totalBookings: number;
    averageRevenuePerBooking: number;
    monthlyRevenue: { month: string; total: number }[];
    bookings: any[];
}

export default function FinancialReports() {
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [tenantId, setTenantId] = useState<string | null>(null);

    useEffect(() => {
        fetchReports();
    }, [tenantId]);

    const fetchReports = async () => {
        try {
            const url = tenantId ? `/api/admin/reports?tenantId=${tenantId}` : '/api/admin/reports';
            const res = await fetch(url);
            if (res.ok) {
                const reportData = await res.json();
                setData(reportData);
            } else {
                toast.error('Failed to fetch reports');
            }
        } catch (error) {
            toast.error('Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    const exportToXLS = async () => {
        if (!data) return;

        const XLSX = await import('xlsx');
        const wb = XLSX.utils.book_new();
        const wsData = [['Month', 'Revenue'], ...data.monthlyRevenue.map((item) => [item.month, item.total])];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wbout = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbout, ws, 'Revenue');
        XLSX.writeFile(wbout, 'financial-report.xlsx');
        toast.success('Report exported to XLS');
    };

    const exportToPDF = async () => {
        if (!data) return;

        const { PDFDocument, StandardFonts } = await import('pdf-lib');

        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const page = pdfDoc.addPage([600, 400]);
        page.drawText('Financial Report', { x: 50, y: 350, size: 20, font: timesRomanFont });
        page.drawText(`Total Revenue: ${data.totalRevenue}`, { x: 50, y: 330, size: 12, font: timesRomanFont });
        page.drawText(`Total Bookings: ${data.totalBookings}`, { x: 50, y: 310, size: 12, font: timesRomanFont });
        page.drawText('Monthly Revenue:', { x: 50, y: 290, size: 14, font: timesRomanFont });
        let y = 270;
        data.monthlyRevenue.forEach((item) => {
            page.drawText(`${item.month}: ${item.total}`, { x: 50, y, size: 10, font: timesRomanFont });
            y -= 15;
        });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-report.pdf';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Report exported to PDF');
    };

    if (loading) {
        return <div className='p-8'>Loading reports...</div>;
    }

    if (!data) {
        return <div className='p-8'>No data available</div>;
    }

    return (
        <div className='container mx-auto p-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Financial Reports</CardTitle>
                    <CardDescription>Platform financial overview and exports</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='mb-6 flex justify-between'>
                        <h2 className='text-2xl font-bold'>Financial Overview</h2>
                        <div className='flex space-x-2'>
                            <Button onClick={exportToXLS}>
                                <Download className='mr-2 h-4 w-4' />
                                Export XLS
                            </Button>
                            <Button onClick={exportToPDF}>
                                <Download className='mr-2 h-4 w-4' />
                                Export PDF
                            </Button>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-3xl font-bold'>${data.totalRevenue}</p>
                                <p className='text-muted-foreground text-sm'>From completed bookings</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Bookings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-3xl font-bold'>{data.totalBookings}</p>
                                <p className='text-muted-foreground text-sm'>Completed transactions</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Avg Revenue per Booking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-3xl font-bold'>${data.averageRevenuePerBooking.toFixed(2)}</p>
                                <p className='text-muted-foreground text-sm'>Average transaction value</p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className='mt-6'>
                        <CardHeader>
                            <CardTitle>Monthly Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='h-64'>
                                <table className='w-full'>
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.monthlyRevenue.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.month}</td>
                                                <td>${item.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='mt-6'>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tenant</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.bookings.slice(0, 10).map((booking, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{booking.tenantSubdomain}</TableCell>
                                            <TableCell>{booking.customerName}</TableCell>
                                            <TableCell>{booking.serviceName}</TableCell>
                                            <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                            <TableCell>${booking.amount}</TableCell>
                                            <TableCell>
                                                <Badge variant='outline'>{booking.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}
