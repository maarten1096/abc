
'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function ImportModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="p-8 rounded-lg w-full max-w-2xl"
        style={{ backgroundColor: theme.main, border: `1.5px solid ${theme.accent}` }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.accent }}>Import Existing Item</h2>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for items..."
          className="w-full p-2 rounded-md bg-transparent mb-4"
          style={{ border: `1.5px solid ${theme.accent}`, color: theme.accent }}
        />
        {/* Search results will be displayed here */}
        <button 
          onClick={onClose} 
          className="mt-4 p-2 rounded-md text-white"
          style={{ backgroundColor: theme.blue }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
