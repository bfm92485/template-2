'use client';

import { useState, useEffect } from 'react';
import { Mic, StopCircle, History } from "lucide-react";
import Link from 'next/link';
import { useDeepgram } from '../lib/contexts/DeepgramContext';
import { addDocument, getDocuments } from '../lib/firebase/firebaseUtils';
import TranscriptionItem from './TranscriptionItem';

interface Recording {
  id: string;
  text: string;
  timestamp: string;
}

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [recentRecordings, setRecentRecordings] = useState<Recording[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  const { connectToDeepgram, disconnectFromDeepgram, realtimeTranscript } = useDeepgram();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
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
      setRecentRecordings(fetchedNotes
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3) as Recording[]);
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
    <div className="max-w-md mx-auto p-6 space-y-6 bg-white min-h-screen">
      <div className="text-center text-xl font-semibold text-gray-700">
        {currentTime}
      </div>

      <div 
        className={`
          bg-gray-100 rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto 
          transition-all duration-300 
          ${isRecording ? 'animate-pulse shadow-[0_0_0_2px_rgba(239,68,68,0.2)]' : ''}
        `}
      >
        <p className={`text-gray-800 ${isRecording ? 'text-gray-900' : ''}`}>
          {currentTranscription || "Your transcription will appear here..."}
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          className={`w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center ${
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
        <div className="text-base font-bold text-gray-700">
          {isRecording ? 'Tap to stop' : 'Tap to record'}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-center text-gray-800">Recent Recordings</h2>
        {recentRecordings.map((recording) => (
          <TranscriptionItem key={recording.id} recording={recording} />
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