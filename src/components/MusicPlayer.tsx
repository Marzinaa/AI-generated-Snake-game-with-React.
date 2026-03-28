import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_01.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "VOID_RESONANCE.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "CORRUPT_SECTOR.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="w-full flex flex-col gap-4 font-mono">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={playNext}
        loop={false}
      />
      
      <div className="flex items-center justify-between border border-magenta-500 p-2 bg-magenta-950/30">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <Radio className="w-6 h-6 text-magenta-500 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h3 className="text-cyan-400 font-bold text-lg truncate uppercase">{currentTrack.title}</h3>
            <p className="text-magenta-500 text-sm uppercase">FREQ: {(Math.random() * 100 + 800).toFixed(2)} MHz</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={toggleMute} className="text-cyan-400 hover:text-magenta-500 transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 accent-magenta-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <button onClick={playPrev} className="text-cyan-400 hover:text-magenta-500 transition-colors border-2 border-cyan-400 hover:border-magenta-500 p-2">
          <SkipBack className="w-8 h-8" />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-16 h-16 bg-magenta-500 hover:bg-cyan-400 flex items-center justify-center text-black transition-colors border-4 border-black outline outline-2 outline-magenta-500 hover:outline-cyan-400"
        >
          {isPlaying ? 
            <Pause className="w-8 h-8" /> : 
            <Play className="w-8 h-8 ml-1" />
          }
        </button>
        <button onClick={playNext} className="text-cyan-400 hover:text-magenta-500 transition-colors border-2 border-cyan-400 hover:border-magenta-500 p-2">
          <SkipForward className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
