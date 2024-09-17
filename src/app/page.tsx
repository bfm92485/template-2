'use client';

import { useState, useEffect } from 'react';
import { Mic, StopCircle, History } from "lucide-react";
import Link from 'next/link';
import { useDeepgram } from '../lib/contexts/DeepgramContext';
import { addDocument, getDocuments } from '../lib/firebase/firebaseUtils';

interface Recording {
  id: string;
  text: string;
  timestamp: string;
}

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [recentRecordings, setRecentRecordings] = useState<Recording[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { connectToDeepgram, disconnectFromDeepgram, realtimeTranscript } = useDeepgram();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchRecentRecordings();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isRecording) {
      setCurrentTranscription(realtimeTranscript);
    }
  }, [realtimeTranscript, isRecording]);

  const fetchRecentRecordings = async () => {
    try {
      const fetchedNotes = await getDocuments('notes');
      setRecentRecordings(fetchedNotes.slice(0, 3) as Recording[]);
    } catch (error) {
      console.error('Error fetching recent recordings:', error);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      disconnectFromDeepgram();
      if (currentTranscription.trim() !== '') {
        await addDocument('notes', {
          text: currentTranscription,
          timestamp: new Date().toISOString(),
        });
        fetchRecentRecordings();
      }
    } else {
      await connectToDeepgram();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center text-xl font-semibold text-gray-700">
        {currentTime.toLocaleTimeString()}
      </div>

      <div className="bg-gray-100 rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
        <p className="text-gray-800">
          {currentTranscription || "Your transcription will appear here..."}
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          className={`w-24 h-24 rounded-full transition-all duration-300 ${
            isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-red-500 hover:bg-red-600'
          }`}
          onClick={toggleRecording}
        >
          {isRecording ? (
            <StopCircle className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </button>
        <div className="text-sm font-medium">
          {isRecording ? 'Tap to stop' : 'Tap to record'}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-center">Recent Recordings</h2>
        {recentRecordings.map((recording) => (
          <div key={recording.id} className="bg-white rounded-lg p-4 shadow">
            <p className="text-sm text-gray-800">{recording.text}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t flex justify-center">
        <Link href="/history" passHref>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <History className="w-4 h-4 mr-2" />
            View History
          </button>
        </Link>
      </div>
    </div>
  );
}
