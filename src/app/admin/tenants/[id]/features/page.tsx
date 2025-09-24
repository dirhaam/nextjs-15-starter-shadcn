'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Switch } from '@/registry/new-york-v4/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';

import { toast } from 'sonner';

interface Feature {
    id: string;
    featureName: string;
    isEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export default function TenantFeatures() {
    const params = useParams();
    const router = useRouter();
    const tenantId = params.id as string;
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (tenantId) {
            fetchFeatures();
        }
    }, [tenantId]);

    const fetchFeatures = async () => {
        try {
            const res = await fetch(`/api/admin/tenants/${tenantId}/features`);
            if (res.ok) {
                const data = await res.json();
                setFeatures(data);
            } else {
                toast.error('Failed to fetch features');
            }
        } catch (error) {
            toast.error('Failed to fetch features');
        } finally {
            setLoading(false);
        }
    };

    const toggleFeature = async (featureId: string, isEnabled: boolean) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/tenants/${tenantId}/features`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featureName: features.find((f) => f.id === featureId)?.featureName, isEnabled })
            });

            if (res.ok) {
                toast.success(isEnabled ? 'Feature enabled' : 'Feature disabled');
                fetchFeatures();
            } else {
                toast.error('Failed to update feature');
            }
        } catch (error) {
            toast.error('Failed to update feature');
        } finally {
            setSaving(false);
        }
    };

    const predefinedFeatures = [
        { name: 'WhatsApp Notifications', key: 'whatsapp' },
        { name: 'Advanced Analytics', key: 'analytics' },
        { name: 'Custom Domain', key: 'custom_domain' },
        { name: 'API Access', key: 'api_access' },
        { name: 'Priority Support', key: 'priority_support' },
        { name: 'White Label', key: 'white_label' }
    ];

    if (loading) {
        return <div className='p-8'>Loading features...</div>;
    }

    return (
        <div className='container mx-auto p-6'>
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Premium Features for Tenant</CardTitle>
                            <CardDescription>Manage premium features for this tenant</CardDescription>
                        </div>
                        <Button onClick={() => router.back()}>Back to Tenants</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Feature</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {predefinedFeatures.map((pf) => {
                                const feature = features.find((f) => f.featureName === pf.key);

                                return (
                                    <TableRow key={pf.key}>
                                        <TableCell className='font-medium'>{pf.name}</TableCell>
                                        <TableCell>
                                            {pf.name === 'WhatsApp Notifications'
                                                ? 'Enable WhatsApp Business API for automated notifications'
                                                : pf.name === 'Advanced Analytics'
                                                  ? 'Detailed reporting and insights dashboard'
                                                  : pf.name === 'Custom Domain'
                                                    ? 'Allow custom domain usage'
                                                    : pf.name === 'API Access'
                                                      ? 'Full API access for integrations'
                                                      : pf.name === 'Priority Support'
                                                        ? '24/7 priority customer support'
                                                        : 'Remove Booqing branding'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={feature?.isEnabled ? 'default' : 'secondary'}>
                                                {feature?.isEnabled ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={feature?.isEnabled || false}
                                                onCheckedChange={(checked) =>
                                                    toggleFeature(feature?.id || pf.key, checked)
                                                }
                                                disabled={saving}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
