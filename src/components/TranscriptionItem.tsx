'use client';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface Recording {
  id: string;
  text: string;
  timestamp: string;
}

interface TranscriptionItemProps {
  recording: Recording;
}

export default function TranscriptionItem({ recording }: TranscriptionItemProps) {
  const [copied, setCopied] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const copyToClipboard = useCallback(() => {
    const textToCopy = `${recording.text}\n\nRecorded on: ${new Date(recording.timestamp).toLocaleString()}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setIsFlashing(true);
      setTimeout(() => {
        setCopied(false);
        setIsFlashing(false);
      }, 1000);
    });
  }, [recording]);

  return (
    <div 
      className={`
        bg-gray-100 rounded-lg p-4 shadow relative
        transition-colors duration-200 ease-in-out
        ${isFlashing ? 'bg-gray-200' : ''}
      `}
    >
      <p className="text-sm text-gray-800 mb-4">{recording.text}</p>
      <p className="text-xs text-gray-500">{new Date(recording.timestamp).toLocaleString()}</p>
      <button
        onClick={copyToClipboard}
        className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        title="Copy transcription"
      >
        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      </button>
    </div>
  );
}