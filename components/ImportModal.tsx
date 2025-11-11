
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SearchResult {
  id: string;
  title: string;
  description: string;
}

export function ImportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch('/api/items/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Failed to search items:', error);
    }
    setLoading(false);
  };

  const handleSelect = (item: SearchResult) => {
    // For now, just log the selected item
    console.log('Selected item:', item);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import</DialogTitle>
          <DialogDescription>
            Import a previously created item by searching for it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="query" className="text-right">
              Search
            </Label>
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="col-span-3"
            />
          </div>
          {loading && <p>Searching...</p>}
          {results.length > 0 && (
            <div className="-mx-2 mt-4 max-h-64 overflow-y-auto">
              <p className="px-2 text-sm font-semibold text-gray-500">Results</p>
              <div className="space-y-1 p-2">
                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="cursor-pointer rounded-md p-2 hover:bg-gray-100"
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Find Matches'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
