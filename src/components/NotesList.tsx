import { useState, useEffect } from 'react';
import { getDocuments } from '../lib/firebase/firebaseUtils';
import { format } from 'date-fns';

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await getDocuments('notes');
      setNotes(fetchedNotes as Note[]);
    };

    fetchNotes();
  }, []);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
      <ul className="space-y-4">
        {notes.map((note) => (
          <li key={note.id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-800">{note.text}</p>
            <p className="text-sm text-gray-500 mt-2">
              {format(new Date(note.timestamp), 'PPpp')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}