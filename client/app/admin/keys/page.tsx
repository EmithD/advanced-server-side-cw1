'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Copy, Loader2, AlertCircle } from 'lucide-react';
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import ApiKeyTable from '@/components/ApiKeyTable';
import { IsAuth } from '@/app/auth/IsAuth';

interface ApiKey {
  id: string;
  api_key: string;
  user_id: string;
  created_at: string;
}

const ApiKeysPage = () => {

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    IsAuth(localStorage.getItem('authToken') || '')
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        window.location.href = '/auth/login';
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:8080/api/api-keys', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setApiKeys(data.data);
        setError(null); // Clear any previous errors
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching API keys:', err);
      setError(err instanceof Error ? err.message : 'Failed to load API keys');
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        window.location.href = '/api/login';
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:8080/api/api-keys/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create API key');
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error('Failed to create API key');
      }

      const generatedKey = data.data.api_key;
      const newKeyObj: ApiKey = {
        id: data.data.id,
        api_key: generatedKey,
        user_id: data.data.user_id,
        created_at: data.data.created_at,
      };

      setApiKeys([...apiKeys, newKeyObj]);
      setNewKey(generatedKey);
      setIsCreateDialogOpen(true);
      setError(null); // Clear any previous errors on success

    } catch (err) {
      console.error('Error creating API key:', err);
      setError(err instanceof Error ? err.message : 'Failed to create API key');
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = (keyId: string) => {
    setKeyToDelete(keyId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteKey = async () => {
    if (!keyToDelete) return;
    
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        localStorage.removeItem('authToken');
        window.location.href = '/api/login';
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:8080/api/api-keys/${keyToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete API key');
      }

      setApiKeys(apiKeys.filter(key => key.id !== keyToDelete));
      setError(null); // Clear any previous errors on success
      

    } catch (err) {
      console.error('Error deleting API key:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete API key');
      

    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could also add a temporary success message here if you want
  };

  // Function to dismiss error alerts
  const dismissError = () => {
    setError(null);
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
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Key
            </>
          )}
        </Button>
      </div>

      {/* Display error if present */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto" 
            onClick={dismissError}
          >
            Dismiss
          </Button>
        </Alert>
      )}

      <ApiKeyTable 
        apiKeys={apiKeys} 
        onDelete={handleDeleteKey} 
        onCopy={copyToClipboard}
        isLoading={isLoading}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New API Key Created</DialogTitle>
            <DialogDescription>
              Make sure to copy your API key now. You would not be able to see it again!
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
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApiKeysPage;