import React, { useState, useCallback } from 'react';
import { Send, Tag, Clock } from 'lucide-react';

interface NoteInputProps {
  onAddNote: (content: string, category: string) => void;
  currentTime: number;
}

const CATEGORIES = ['General', 'Important', 'Question', 'Summary', 'Code', 'Reference'];

const NoteInput: React.FC<NoteInputProps> = ({ onAddNote, currentTime }) => {
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('General');
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimestamp = useCallback((time: number) => {
    return new Date(time * 1000).toISOString().substr(11, 8);
  }, []);

  const insertTimestamp = useCallback(() => {
    const timestamp = `[${formatTimestamp(currentTime)}] `;
    setNote((prev) => prev + timestamp);
  }, [currentTime, formatTimestamp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onAddNote(note, category);
      setNote('');
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add your note here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={insertTimestamp}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
            title="Insert current timestamp"
          >
            <Clock size={18} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Select category"
        >
          <Tag size={20} />
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Send size={20} /> Add Note
        </button>
      </div>
      
      {isExpanded && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between text-sm text-gray-500">
        <span>Current timestamp: {formatTimestamp(currentTime)}</span>
        <span>Category: {category}</span>
      </div>
    </form>
  );
};

export default NoteInput;