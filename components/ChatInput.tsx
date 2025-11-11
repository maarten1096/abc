
'use client';

import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { CornerDownLeft, FileImage, Mic } from "lucide-react";
import { useUIStore } from '@/lib/store';
import { ImportModal } from '@/components/ImportModal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

export function ChatInput() {
  const { inputText, setInputText, setSummary } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setSummary(''); // Clear previous summary

    try {
      const response = await fetch('/api/ai/handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'summary',
          input_text: inputText,
          options: {
            animation: true // You can control this from the store later
          }
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get streaming response.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        streamedText += chunk;
        setSummary(streamedText);
      }

    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('Error: Could not generate summary.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <div className="relative flex-grow">
            <TextareaAutosize
                maxRows={15}
                minRows={1}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to summarize..."
                spellCheck={false}
                value={inputText}
                className="w-full resize-none rounded-2xl border border-input bg-background p-4 pr-12 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
            />
        </div>

        <div className="flex items-center gap-3">
            <Button size="icon" type="submit" variant="secondary" onClick={handleGenerateSummary} disabled={isLoading}>
                <CornerDownLeft className="size-5" />
            </Button>

            <DialogTrigger asChild>
              <Button size="icon" variant="outline" disabled={isLoading}>
                  <FileImage className="size-5" />
              </Button>
            </DialogTrigger>

            <Button size="icon" variant="outline" disabled={isLoading}>
                <Mic className="size-5" />
            </Button>
        </div>
        <ImportModal />
      </Dialog>
    </div>
  );
}
