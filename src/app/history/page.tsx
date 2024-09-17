'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDocuments } from '../../lib/firebase/firebaseUtils';
import TranscriptionItem from '../../components/TranscriptionItem';

interface Recording {
  id: string;
  text: string;
  timestamp: string;
}

export default function HistoryPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const fetchedNotes = await getDocuments('notes');
        setRecordings(fetchedNotes
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) as Recording[]);
      } catch (error) {
        console.error('Error fetching recordings:', error);
      }
    };

    fetchRecordings();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transcription History</h1>
        <Link href="/" className="text-blue-500 hover:text-blue-600 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recorder
        </Link>
      </div>
      <div className="space-y-4">
        {recordings.map((recording) => (
          <TranscriptionItem key={recording.id} recording={recording} />
        ))}
      </div>
    </div>
  );
}