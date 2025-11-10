// app/components/Promptbar.tsx
"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";

export default function Promptbar({ onSend, loading, disabled }: { onSend: (val: string) => void; loading?: boolean; disabled?: boolean }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text?.length > 0) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="p-3 border-t">
      <div className="relative">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="w-full h-12 p-3 pr-10 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-50"
          placeholder="Ask me anything..."
          disabled={disabled || loading}
        />
        <button
          onClick={handleSend}
          className="absolute right-3 top-3 w-6 h-6 disabled:opacity-50"
          disabled={disabled || loading || !text}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}