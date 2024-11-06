import React from 'react';
import { FastForward, Pause, Play, Rewind, Volume2 } from 'lucide-react';
import type { VideoState } from '../types';

interface VideoControlsProps {
  videoState: VideoState;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
  onPlaybackRateChange: (rate: number) => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  videoState,
  onPlayPause,
  onSeek,
  onPlaybackRateChange,
}) => {
  const { isPlaying, currentTime, duration, playbackRate } = videoState;

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value));
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-b-lg">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onPlayPause}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={() => onSeek(currentTime - 10)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <Rewind size={20} />
          </button>
          
          <button
            onClick={() => onSeek(currentTime + 10)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <FastForward size={20} />
          </button>

          <div className="flex items-center gap-2">
            <Volume2 size={20} />
            <select
              value={playbackRate}
              onChange={(e) => onPlaybackRateChange(Number(e.target.value))}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                <option key={rate} value={rate}>
                  {rate}x
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex items-center gap-2 text-sm">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeekChange}
              className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;