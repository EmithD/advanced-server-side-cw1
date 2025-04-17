'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Search, 
  KeyRound, 
  Loader2,
  Globe,
  AlertCircle
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { IsAuth } from '@/app/auth/IsAuth';

const searchOptions = [
  { value: 'name', label: 'Country Name' },
  { value: 'capital', label: 'Capital City' },
  { value: 'currency', label: 'Currency' },
  { value: 'lang', label: 'Language' },
  { value: 'region', label: 'Region' },
  { value: 'subregion', label: 'Subregion' },
];

interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
}

const ApiPage = () => {
  const [searchType, setSearchType] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    IsAuth(localStorage.getItem('authToken') || '');
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/countries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          searchType,
          searchQuery,
          apiKey
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setCountries(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error('Error fetching country data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch country data');
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrencies = (currencies?: Record<string, { name: string; symbol: string }>) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map(currency => `${currency.name} (${currency.symbol})`)
      .join(', ');
  };

  const getLanguages = (languages?: Record<string, string>) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">REST Countries API Explorer</CardTitle>
          <CardDescription>
            Search for countries by name, capital, currency, language, or region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 items-center gap-2">
                <Select 
                  value={searchType} 
                  onValueChange={setSearchType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Search by" />
                  </SelectTrigger>
                  <SelectContent>
                    {searchOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={`Enter ${searchOptions.find(opt => opt.value === searchType)?.label.toLowerCase()}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="relative flex-1 md:max-w-xs">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="h-10"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {countries.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableCaption>
                    {countries.length} countries found matching your search
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flag</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Capital</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Population</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Languages</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {countries.map((country, index) => (
                      <TableRow key={index}>
                        <TableCell>
                            <Image 
                              src={country.flags.png} 
                              alt={country.flags.alt || `Flag of ${country.name.common}`} 
                              width={40}
                              height={24}
                              className="object-cover rounded"
                            />
                        </TableCell>
                        <TableCell className="font-medium">
                          {country.name.common}
                          <div className="text-xs text-muted-foreground">
                            {country.name.official}
                          </div>
                        </TableCell>
                        <TableCell>{country.capital?.join(', ') || 'N/A'}</TableCell>
                        <TableCell>
                          {country.region}
                          {country.subregion && (
                            <div className="text-xs text-muted-foreground">
                              {country.subregion}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{country.population.toLocaleString()}</TableCell>
                        <TableCell>{getCurrencies(country.currencies)}</TableCell>
                        <TableCell>{getLanguages(country.languages)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : !loading && !error && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Globe className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No results to display</h3>
                <p className="text-muted-foreground mt-1">
                  Enter a search query and your API key to see country data
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiPage;