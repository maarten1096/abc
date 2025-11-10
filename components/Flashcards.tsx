
'use client';

import { useState } from 'react';

const Flashcards = ({ flashcards }: any) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return <div>No flashcards found.</div>;
  }

  const handleNextCard = () => {
    setCurrentCard((currentCard + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrevCard = () => {
    setCurrentCard((currentCard - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className="relative w-96 h-64 perspective-1000"
        onClick={handleFlipCard}
      >
        <div
          className={`absolute w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-white border rounded-lg shadow-lg">
            <p className="text-2xl">{flashcards[currentCard].question}</p>
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-white border rounded-lg shadow-lg">
            <p className="text-2xl">{flashcards[currentCard].answer}</p>
          </div>
        </div>
      </div>
      <div className="flex mt-4">
        <button
          className="px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={handlePrevCard}
        >
          Prev
        </button>
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={handleNextCard}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
