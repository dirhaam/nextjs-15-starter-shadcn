'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

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

import { Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    description?: string;
    currency?: string;
    language?: string;
    createdAt: Date;
    updatedAt: Date;
}

const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    subdomain: z.string().min(1, 'Subdomain is required'),
    description: z.string().optional(),
    currency: z.string().optional(),
    language: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const userFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required'),
    tenantId: z.string().min(1, 'Tenant is required'),
    role: z.string().refine((val) => ['user', 'admin'].includes(val), { message: 'Role is required' })
});

type UserFormData = z.infer<typeof userFormSchema>;

interface User {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: string;
    createdAt: string;
}

export default function TenantManagement() {
    const router = useRouter();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentTenant, setCurrentTenant] = useState<FormData | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // User management state
    const [selectedTenantId, setSelectedTenantId] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [creatingUser, setCreatingUser] = useState(false);

    const userForm = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            tenantId: '',
            role: 'user'
        }
    });

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subdomain: '',
            description: '',
            currency: 'USD',
            language: 'en'
        }
    });

    useEffect(() => {
        fetchTenants();
    }, []);

    useEffect(() => {
        if (selectedTenantId) {
            userForm.setValue('tenantId', selectedTenantId);
            fetchUsers(selectedTenantId);
        } else {
            setUsers([]);
        }
    }, [selectedTenantId]);

    const fetchTenants = async () => {
        try {
            const res = await fetch('/api/admin/tenants');
            if (res.ok) {
                const data = await res.json();
                setTenants(data);
            } else {
                toast.error('Failed to fetch tenants');
            }
        } catch (error) {
            toast.error('Failed to fetch tenants');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const url = '/api/admin/tenants';
            const method = isEdit ? 'PUT' : 'POST';
            const body = JSON.stringify(data);

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body
            });

            if (res.ok) {
                toast.success(isEdit ? 'Tenant updated' : 'Tenant created');
                setIsDialogOpen(false);
                form.reset();
                setIsEdit(false);
                setCurrentTenant(null);
                fetchTenants();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to save tenant');
            }
        } catch (error) {
            toast.error('Failed to save tenant');
        }
    };

    const handleEdit = (tenant: Tenant) => {
        setCurrentTenant({
            id: tenant.id,
            name: tenant.name,
            subdomain: tenant.subdomain,
            description: tenant.description || '',
            currency: tenant.currency,
            language: tenant.language
        });
        setIsEdit(true);
        setIsDialogOpen(true);
        form.reset({
            id: tenant.id,
            name: tenant.name,
            subdomain: tenant.subdomain,
            description: tenant.description || '',
            currency: tenant.currency,
            language: tenant.language
        });
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/tenants?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('Tenant deleted');
                fetchTenants();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to delete tenant');
            }
        } catch (error) {
            toast.error('Failed to delete tenant');
        }
        setDeletingId(null);
    };

    const fetchUsers = async (tenantId: string) => {
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
        }
    };

    const onUserSubmit = async (data: UserFormData) => {
        setCreatingUser(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                toast.success('User created successfully');
                userForm.reset();
                if (selectedTenantId) {
                    fetchUsers(selectedTenantId);
                }
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to create user');
            }
        } catch (error) {
            toast.error('Failed to create user');
        } finally {
            setCreatingUser(false);
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('User deleted successfully');
                if (selectedTenantId) {
                    fetchUsers(selectedTenantId);
                }
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    if (loading) {
        return <div className='p-8'>Loading tenants...</div>;
    }

    return (
        <div className='container mx-auto p-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Tenant Management</CardTitle>
                    <CardDescription>Manage your tenants and subdomains</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='mb-6 flex justify-between'>
                        <h2 className='text-2xl font-bold'>Tenants ({tenants.length})</h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => {
                                        setIsEdit(false);
                                        setCurrentTenant(null);
                                        form.reset();
                                    }}>
                                    Add Tenant
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='max-w-md'>
                                <DialogHeader>
                                    <DialogTitle>{isEdit ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
                                    <DialogDescription>Fill in the tenant details.</DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Tenant Name' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='subdomain'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Subdomain</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='subdomain' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='description'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Description (optional)' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='currency'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Currency</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value || 'USD'}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select currency' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value='USD'>USD</SelectItem>
                                                            <SelectItem value='EUR'>EUR</SelectItem>
                                                            <SelectItem value='IDR'>IDR</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name='language'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Language</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value || 'en'}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder='Select language' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value='en'>English</SelectItem>
                                                            <SelectItem value='id'>Indonesian</SelectItem>
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
                                            <Button type='submit'>{isEdit ? 'Update' : 'Create'}</Button>
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
                                <TableHead>Subdomain</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead>Language</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tenants.map((tenant) => (
                                <TableRow key={tenant.id}>
                                    <TableCell>{tenant.name}</TableCell>
                                    <TableCell>
                                        <Badge variant='outline'>{tenant.subdomain}</Badge>
                                    </TableCell>
                                    <TableCell>{tenant.description || 'No description'}</TableCell>
                                    <TableCell>{tenant.currency || 'USD'}</TableCell>
                                    <TableCell>{tenant.language || 'en'}</TableCell>
                                    <TableCell>{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant='outline' size='sm' onClick={() => handleEdit(tenant)}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant='destructive'
                                            size='sm'
                                            onClick={() => setDeletingId(tenant.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {deletingId && (
                        <div className='bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black'>
                            <Card className='p-6'>
                                <CardHeader>
                                    <CardTitle>Confirm Delete</CardTitle>
                                    <CardDescription>
                                        Are you sure you want to delete this tenant? This action cannot be undone.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className='flex justify-end space-x-2'>
                                    <Button variant='outline' onClick={() => setDeletingId(null)}>
                                        Cancel
                                    </Button>
                                    <Button variant='destructive' onClick={() => handleDelete(deletingId)}>
                                        Delete
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Management Section */}
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage users for selected tenant</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='mb-6 space-y-4'>
                        <div className='flex items-center space-x-2'>
                            <Label>Select Tenant</Label>
                            <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                                <SelectTrigger className='w-[180px]'>
                                    <SelectValue placeholder='Choose tenant' />
                                </SelectTrigger>
                                <SelectContent>
                                    {tenants.map((tenant) => (
                                        <SelectItem key={tenant.id} value={tenant.id}>
                                            {tenant.subdomain}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedTenantId && (
                            <div className='space-y-4'>
                                <form onSubmit={userForm.handleSubmit(onUserSubmit)} className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='name'>Name</Label>
                                        <Input id='name' {...userForm.register('name')} />
                                        {userForm.formState.errors.name && (
                                            <p className='text-destructive text-sm'>
                                                {userForm.formState.errors.name.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='email'>Email</Label>
                                        <Input id='email' type='email' {...userForm.register('email')} />
                                        {userForm.formState.errors.email && (
                                            <p className='text-destructive text-sm'>
                                                {userForm.formState.errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='password'>Password</Label>
                                        <Input id='password' type='password' {...userForm.register('password')} />
                                        {userForm.formState.errors.password && (
                                            <p className='text-destructive text-sm'>
                                                {userForm.formState.errors.password.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className='space-y-2'>
                                        <Label>Role</Label>
                                        <Select
                                            onValueChange={(value) => userForm.setValue('role', value)}
                                            value={userForm.watch('role')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select role' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='user'>User</SelectItem>
                                                <SelectItem value='admin'>Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {userForm.formState.errors.role && (
                                            <p className='text-destructive text-sm'>
                                                {userForm.formState.errors.role.message}
                                            </p>
                                        )}
                                    </div>
                                    <Button type='submit' disabled={creatingUser} className='col-span-2'>
                                        {creatingUser ? 'Creating...' : 'Create User'}
                                    </Button>
                                </form>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => {
                                                            /* Edit */
                                                        }}>
                                                        <Edit className='h-4 w-4' />
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => deleteUser(user.id)}>
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {users.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className='text-center'>
                                                    No users for this tenant
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
