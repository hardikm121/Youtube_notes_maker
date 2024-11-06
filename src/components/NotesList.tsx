import React, { useState } from 'react';
import { Note } from '../types';
import { Clock, Search, Tag, Trash2 } from 'lucide-react';

interface NotesListProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onTimeClick: (time: number) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onDeleteNote, onTimeClick }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(notes.map(note => note.category)));
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Important': 'bg-red-100 text-red-800',
      'Question': 'bg-yellow-100 text-yellow-800',
      'Summary': 'bg-green-100 text-green-800',
      'Code': 'bg-purple-100 text-purple-800',
      'Reference': 'bg-blue-100 text-blue-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['General'];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              !selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              className={`px-3 py-1 rounded-full text-sm ${
                category === selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </span>
                </div>
                <p className="text-gray-800">{note.content}</p>
                <button
                  onClick={() => onTimeClick(note.timestamp)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Clock size={16} />
                  {note.formattedTime}
                </button>
              </div>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredNotes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {search || selectedCategory ? 'No matching notes found' : 'No notes yet'}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;