'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/registry/new-york-v4/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/registry/new-york-v4/ui/form';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    email: z.string().email('Invalid email'),
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required')
});

type FormData = z.infer<typeof formSchema>;

export default function TenantUsers() {
    const params = useParams();
    const router = useRouter();
    const tenantId = params.id as string;
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentUser, setCurrentUser] = useState<FormData | null>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            name: '',
            role: 'user'
        }
    });

    useEffect(() => {
        if (tenantId) {
            fetchUsers();
        }
    }, [tenantId]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`/api/admin/users?tenantId=${tenantId}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const url = '/api/admin/users';
            const method = isEdit ? 'PUT' : 'POST';
            const body = JSON.stringify({ ...data, tenantId });

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body
            });

            if (res.ok) {
                toast.success(isEdit ? 'User updated' : 'User added');
                setIsDialogOpen(false);
                form.reset();
                setIsEdit(false);
                setCurrentUser(null);
                fetchUsers();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to save user');
            }
        } catch (error) {
            toast.error('Failed to save user');
        }
    };

    const handleEdit = (user: any) => {
        setCurrentUser({
            email: user.email,
            name: user.name,
            role: user.role
        });
        setIsEdit(true);
        setIsDialogOpen(true);
        form.reset({
            email: user.email,
            name: user.name,
            role: user.role
        });
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('User deleted');
                fetchUsers();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to delete user');
            }
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    if (loading) {
        return <div className='p-8'>Loading users...</div>;
    }

    return (
        <div className='container mx-auto p-6'>
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Users for Tenant</CardTitle>
                            <CardDescription>Manage users for this tenant</CardDescription>
                        </div>
                        <Button onClick={() => router.back()}>Back to Tenants</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='mb-6'>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => {
                                        setIsEdit(false);
                                        setCurrentUser(null);
                                        form.reset();
                                    }}>
                                    Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-md'>
                                <DialogHeader>
                                    <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
                                    <DialogDescription>Fill in the user details for this tenant.</DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                                        <FormField
                                            control={form.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='user@example.com' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Full Name' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='role'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select role' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value='owner'>Owner</SelectItem>
                                                            <SelectItem value='staff'>Staff</SelectItem>
                                                            <SelectItem value='finance'>Finance</SelectItem>
                                                            <SelectItem value='user'>User</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                onClick={() => setIsDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type='submit'>{isEdit ? 'Update' : 'Add'}</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant='outline'>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant='outline' size='sm' onClick={() => handleEdit(user)}>
                                            Edit
                                        </Button>
                                        <Button variant='destructive' size='sm' onClick={() => handleDelete(user.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
