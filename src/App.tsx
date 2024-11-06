import React, { useState, useRef } from 'react';
import { Download, Youtube, AlertCircle } from 'lucide-react';
import VideoPlayer from './components/VideoPlayer';
import NoteInput from './components/NoteInput';
import NotesList from './components/NotesList';
import { Note, VideoDetails } from './types';
import jsPDF from 'jspdf';

function App() {
  const [videoId, setVideoId] = useState('');
  const [inputVideoId, setInputVideoId] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const playerRef = useRef<any>(null);

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const id = extractVideoId(inputVideoId);
    if (id) {
      setVideoId(id);
      setInputVideoId('');
      // Reset state for new video
      setNotes([]);
      setVideoDetails(null);
    } else {
      setError('Please enter a valid YouTube URL or video ID');
    }
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url.length === 11 ? url : null;
  };

  const handleAddNote = (content: string, category: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      timestamp: currentTime,
      content,
      category,
      formattedTime: new Date(currentTime * 1000).toISOString().substr(11, 8),
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const handleTimeClick = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
      playerRef.current.playVideo();
    }
  };

  const handleVideoError = () => {
    setError('Failed to load video. Please check the URL and try again.');
    setVideoId('');
  };

  const handlePlayerReady = (event: any) => {
    playerRef.current = event.target;
    // Get video details
    setVideoDetails({
      title: event.target.getVideoData().title,
      description: 'Loading description...',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    });
  };

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    let yPosition = 20;

    // Add title and video details
    pdf.setFontSize(20);
    pdf.text('Video Notes', 20, yPosition);
    yPosition += 15;

    if (videoDetails) {
      pdf.setFontSize(16);
      pdf.text(videoDetails.title, 20, yPosition);
      yPosition += 15;
    }

    pdf.setFontSize(12);
    pdf.text(`Video ID: ${videoId}`, 20, yPosition);
    yPosition += 10;

    // Group notes by category
    const notesByCategory = notes.reduce((acc, note) => {
      if (!acc[note.category]) {
        acc[note.category] = [];
      }
      acc[note.category].push(note);
      return acc;
    }, {} as Record<string, Note[]>);

    // Add notes by category
    Object.entries(notesByCategory).forEach(([category, categoryNotes]) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 150);
      pdf.text(category, 20, yPosition);
      yPosition += 10;

      pdf.setTextColor(0, 0, 0);
      categoryNotes.forEach((note) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(10);
        pdf.text(`[${note.formattedTime}]`, 20, yPosition);
        const lines = pdf.splitTextToSize(note.content, 170);
        pdf.text(lines, 35, yPosition);
        yPosition += 10 + (lines.length * 7);
      });

      yPosition += 5;
    });

    pdf.save(`${videoDetails?.title || 'video'}-notes.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Youtube className="text-red-600" />
            YouTube Note Taker
          </h1>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {!videoId ? (
          <form onSubmit={handleVideoSubmit} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVideoId}
                onChange={(e) => setInputVideoId(e.target.value)}
                placeholder="Enter YouTube URL or video ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Load Video
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <VideoPlayer
                  videoId={videoId}
                  onPause={(time) => setCurrentTime(time)}
                  onPlayerReady={handlePlayerReady}
                  onError={handleVideoError}
                  videoDetails={videoDetails}
                />
                <NoteInput onAddNote={handleAddNote} currentTime={currentTime} />
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Your Notes</h2>
                  {notes.length > 0 && (
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download size={20} />
                      Export PDF
                    </button>
                  )}
                </div>
                <NotesList
                  notes={notes}
                  onDeleteNote={(id) => setNotes((prev) => prev.filter(note => note.id !== id))}
                  onTimeClick={handleTimeClick}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;