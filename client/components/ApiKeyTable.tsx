'use client';

import React, { useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Eye, EyeOff } from 'lucide-react';

interface ApiKey {
    id: string;
    key: string;
    created: string;
    requests: number;
}

interface KeyVisibilityState {
    [key: string]: boolean;
}

const ApiKeyTable = () => {

    const [keyVisibility, setKeyVisibility] = useState<KeyVisibilityState>({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
    
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', key: 'sk_live_abcdefghijklmnopqrstuvwxyz123456', created: '2025-04-01T10:30:00Z', requests: 1245 },
    { id: '2', key: 'sk_live_zyxwvutsrqponmlkjihgfedcba654321', created: '2025-03-15T14:22:10Z', requests: 532 },
    { id: '3', key: 'sk_live_9876543210abcdefghijklmnopqrstuv', created: '2025-02-28T09:15:45Z', requests: 3087 },
    ]);

    const toggleKeyVisibility = (keyId: string) => {
        setKeyVisibility({
          ...keyVisibility,
          [keyId]: !keyVisibility[keyId]
        });
    };

    const maskKey = (key: string) => {
        return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDeleteKey = (keyId: string) => {
        setKeyToDelete(keyId);
        setIsDeleteDialogOpen(true);
    };
    

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-1/2">API Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                    <TableCell className="font-mono">
                    <div className="flex items-center space-x-2">
                        {keyVisibility[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                        {keyVisibility[apiKey.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                        <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(apiKey.key)}
                        >
                        <Copy size={16} />
                        </Button>
                    </div>
                    </TableCell>
                    <TableCell>{formatDate(apiKey.created)}</TableCell>
                    <TableCell>{apiKey.requests.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteKey(apiKey.id)}
                    >
                        <Trash2 size={18} />
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
                {apiKeys.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    No API keys found. Create your first key to get started.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
    )
};

export default ApiKeyTable;
