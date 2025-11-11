'use client';

import { useGenerationStore } from '@/lib/generationStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';

export function ErrorDisplay() {
    const { error, clearError } = useGenerationStore();

    if (!error) return null;

    return (
        <div className="p-4">
            <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                    <button onClick={clearError} className="ml-4 text-sm font-medium underline">Dismiss</button>
                </AlertDescription>
            </Alert>
        </div>
    );
}
