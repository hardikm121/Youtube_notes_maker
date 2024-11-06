import React, { useState, useCallback, useEffect } from 'react';
import YouTube from 'react-youtube';
import { RefreshCcw } from 'lucide-react';
import type { VideoDetails, VideoState } from '../types';
import VideoControls from './VideoControls';

interface VideoPlayerProps {
  videoId: string;
  onPause: (currentTime: number) => void;
  onPlayerReady: (event: any) => void;
  onError: () => void;
  videoDetails: VideoDetails | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  onPause,
  onPlayerReady,
  onError,
  videoDetails,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
  });

  const updateVideoState = useCallback(() => {
    if (player) {
      setVideoState((prev) => ({
        ...prev,
        currentTime: player.getCurrentTime(),
        duration: player.getDuration(),
        isPlaying: player.getPlayerState() === 1,
      }));
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      const interval = setInterval(updateVideoState, 1000);
      return () => clearInterval(interval);
    }
  }, [player, updateVideoState]);

  const handleReady = (event: any) => {
    setIsLoading(false);
    setPlayer(event.target);
    onPlayerReady(event);
  };

  const handlePlayPause = () => {
    if (player) {
      if (videoState.isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleSeek = (seconds: number) => {
    if (player) {
      player.seekTo(seconds);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (player) {
      player.setPlaybackRate(rate);
      setVideoState((prev) => ({ ...prev, playbackRate: rate }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-xl">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <RefreshCcw className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        <div className="aspect-video">
          <YouTube
            videoId={videoId}
            className="w-full h-full"
            opts={{
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
                controls: 0,
              },
            }}
            onReady={handleReady}
            onError={onError}
            onPause={(event) => {
              updateVideoState();
              onPause(event.target.getCurrentTime());
            }}
            onPlay={updateVideoState}
          />
        </div>
        <VideoControls
          videoState={videoState}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onPlaybackRateChange={handlePlaybackRateChange}
        />
      </div>
      {videoDetails && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">{videoDetails.title}</h2>
          <p className="text-gray-600 text-sm whitespace-pre-line">{videoDetails.description}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;