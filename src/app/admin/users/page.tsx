'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import { zodResolver } from '@hookform/resolvers/zod';

import { Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const roles = ['user', 'admin'] as const;
type Role = (typeof roles)[number];

const formSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required'),
    tenantId: z.string().min(1, 'Tenant is required'),
    role: z.string().refine((val) => roles.includes(val as Role), { message: 'Role is required' })
});

type FormData = z.infer<typeof formSchema>;

interface User {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: string;
    createdAt: string;
}

interface Tenant {
    id: string;
    subdomain: string;
    name: string;
}

export default function UserManagement() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            tenantId: '',
            role: 'user'
        }
    });

    useEffect(() => {
        fetchTenants();
        fetchUsers();
    }, []);

    const fetchTenants = async () => {
        try {
            const res = await fetch('/api/admin/tenants');
            if (res.ok) {
                const data = await res.json();
                setTenants(data);
            }
        } catch (error) {
            toast.error('Failed to fetch tenants');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        setCreating(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                toast.success('User created successfully');
                form.reset();
                fetchUsers();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to create user');
            }
        } catch (error) {
            toast.error('Failed to create user');
        } finally {
            setCreating(false);
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('User deleted successfully');
                fetchUsers();
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    if (loading) {
        return <div className='p-8'>Loading...</div>;
    }

    return (
        <div className='container mx-auto space-y-6 p-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                    <CardDescription>Create a user account for tenant subdomain login</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='name'>Name</Label>
                                <Input id='name' {...form.register('name')} />
                                {form.formState.errors.name && (
                                    <p className='text-destructive text-sm'>{form.formState.errors.name.message}</p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='email'>Email</Label>
                                <Input id='email' type='email' {...form.register('email')} />
                                {form.formState.errors.email && (
                                    <p className='text-destructive text-sm'>{form.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='password'>Password</Label>
                                <Input id='password' type='password' {...form.register('password')} />
                                {form.formState.errors.password && (
                                    <p className='text-destructive text-sm'>{form.formState.errors.password.message}</p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='tenantId'>Tenant</Label>
                                <Select
                                    onValueChange={(value) => form.setValue('tenantId', value)}
                                    value={form.watch('tenantId')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select tenant' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tenants.map((tenant) => (
                                            <SelectItem key={tenant.id} value={tenant.id}>
                                                {tenant.subdomain} - {tenant.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.tenantId && (
                                    <p className='text-destructive text-sm'>{form.formState.errors.tenantId.message}</p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='role'>Role</Label>
                                <Select
                                    onValueChange={(value) => form.setValue('role', value)}
                                    value={form.watch('role')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select role' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='user'>User</SelectItem>
                                        <SelectItem value='admin'>Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.role && (
                                    <p className='text-destructive text-sm'>{form.formState.errors.role.message}</p>
                                )}
                            </div>
                        </div>
                        <Button type='submit' disabled={creating}>
                            {creating ? 'Creating...' : 'Create User'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>All users across tenants</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Tenant</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => {
                                const tenant = tenants.find((t) => t.id === user.tenantId);

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {tenant ? `${tenant.subdomain} - ${tenant.name}` : 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className='space-x-2'>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => {
                                                    /* Edit logic */
                                                }}>
                                                <Edit className='h-4 w-4' />
                                            </Button>
                                            <Button variant='ghost' size='sm' onClick={() => deleteUser(user.id)}>
                                                <Trash2 className='h-4 w-4' />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center'>
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
