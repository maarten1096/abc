
'use client';

import { useState } from 'react';
import { useGenerationStore } from '@/lib/generationStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

export function FlashcardTool() {
    const { flashcards, isLoading } = useGenerationStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (isLoading && (!flashcards || flashcards.length === 0)) {
        return <div className="text-center text-gray-500">Generating flashcards...</div>;
    }

    if (!flashcards || flashcards.length === 0) {
        return <div className="text-center text-gray-500">Generate flashcards to get started!</div>;
    }

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    };

    const currentCard = flashcards[currentIndex];

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
            <div className="relative w-full max-w-lg h-64 perspective-1000">
                <div 
                    className={`relative w-full h-full text-center transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front of the card */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-white border-2 rounded-lg shadow-lg p-6">
                        <p className="text-xl font-semibold">{currentCard.term}</p>
                    </div>
                    {/* Back of the card */}
                    <div className="absolute w-full h-full rotate-y-180 backface-hidden flex flex-col items-center justify-center bg-white border-2 rounded-lg shadow-lg p-6">
                        <p className="text-lg">{currentCard.definition}</p>
                        {currentCard.example && <p className="text-sm text-gray-500 mt-4"><em>e.g., {currentCard.example}</em></p>}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-8 mt-6">
                <Button onClick={handlePrev} size="icon" variant="outline">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <span className='text-xl font-bold'>
                    {currentIndex + 1} / {flashcards.length}
                </span>
                <Button onClick={handleNext} size="icon" variant="outline">
                    <ArrowRight className="h-6 w-6" />
                </Button>
            </div>

            <Button onClick={() => setIsFlipped(!isFlipped)} variant="ghost" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" /> Flip Card
            </Button>
        </div>
    );
}
