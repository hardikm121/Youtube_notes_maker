export interface Note {
  id: string;
  timestamp: number;
  content: string;
  formattedTime: string;
  category: string;
}

export interface VideoDetails {
  title: string;
  description: string;
  thumbnail: string;
}

export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}