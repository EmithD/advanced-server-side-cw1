'use client';

import React, { useState } from 'react';
import { PlusCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import ApiKeyTable from '@/components/ApiKeyTable';

interface ApiKey {
  id: string;
  key: string;
  created: string;
  requests: number;
}

const ApiKeysPage = () => {

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: '1', key: 'sk_live_abcdefghijklmnopqrstuvwxyz123456', created: '2025-04-01T10:30:00Z', requests: 1245 },
    { id: '2', key: 'sk_live_zyxwvutsrqponmlkjihgfedcba654321', created: '2025-03-15T14:22:10Z', requests: 532 },
    { id: '3', key: 'sk_live_9876543210abcdefghijklmnopqrstuv', created: '2025-02-28T09:15:45Z', requests: 3087 },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const handleCreateKey = () => {
    // In a real app, you would call your API to create a new key
    const generatedKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const newKeyObj: ApiKey = {
      id: `${apiKeys.length + 1}`,
      key: generatedKey,
      created: new Date().toISOString(),
      requests: 0
    };
    
    setApiKeys([...apiKeys, newKeyObj]);
    setNewKey(generatedKey);
    setIsCreateDialogOpen(true);
  };

  const confirmDeleteKey = () => {
    setApiKeys(apiKeys.filter(key => key.id !== keyToDelete));
    setIsDeleteDialogOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };


  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">API Keys</h1>
          <p className="text-slate-500 mt-1">Manage your API keys for authentication</p>
        </div>
        <Button 
          onClick={handleCreateKey} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Key
        </Button>
      </div>

      <ApiKeyTable />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New API Key Created</DialogTitle>
            <DialogDescription>
              Make sure to copy your API key now. You won't be able to see it again!
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input
              readOnly
              value={newKey || ''}
              className="font-mono"
            />
            <Button
              size="sm" 
              variant="outline" 
              onClick={() => newKey && copyToClipboard(newKey)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setIsCreateDialogOpen(false)} 
              className="w-full sm:w-auto"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? Any applications using this key will no longer be able to authenticate. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteKey}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApiKeysPage;