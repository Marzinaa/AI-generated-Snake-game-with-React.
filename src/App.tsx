import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col relative overflow-hidden font-sans selection:bg-magenta-500/50">
      <div className="scanlines" />
      <div className="noise" />
      
      {/* Header */}
      <header className="relative z-10 w-full p-4 flex justify-between items-center border-b-4 border-magenta-500 bg-black">
        <div className="flex items-center gap-4">
          <Terminal className="w-8 h-8 text-magenta-500" />
          <h1 
            className="text-4xl font-black tracking-widest text-cyan-400 uppercase glitch"
            data-text="SYS.SNAKE_PROTOCOL"
          >
            SYS.SNAKE_PROTOCOL
          </h1>
        </div>
        <div className="text-magenta-500 text-xl animate-pulse">
          [STATUS: ONLINE]
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 gap-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
          
          {/* Game Section */}
          <div className="w-full lg:flex-1 flex justify-center border-2 border-cyan-500 p-4 bg-black relative min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-magenta-500 animate-pulse" />
            <SnakeGame />
          </div>

          {/* Sidebar / Music Player */}
          <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
            <div className="bg-black border-2 border-magenta-500 p-6 relative">
              <div className="absolute top-0 right-0 bg-magenta-500 text-black px-2 py-1 text-sm font-bold">
                AUDIO.MOD
              </div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3 uppercase glitch" data-text="TRANSMISSION">
                TRANSMISSION
              </h2>
              <MusicPlayer />
            </div>

            <div className="bg-black border-2 border-cyan-500 p-6 relative">
              <div className="absolute top-0 right-0 bg-cyan-500 text-black px-2 py-1 text-sm font-bold">
                INPUT.MOD
              </div>
              <h3 className="text-xl font-bold text-magenta-500 mb-3 uppercase tracking-wider glitch" data-text="PARAMETERS">PARAMETERS</h3>
              <ul className="space-y-2 text-lg text-cyan-400">
                <li className="flex justify-between border-b border-cyan-900 pb-1"><span>EXECUTE_MOVE</span> <span className="text-magenta-400">W,A,S,D / ARROWS</span></li>
                <li className="flex justify-between border-b border-cyan-900 pb-1"><span>HALT_PROCESS</span> <span className="text-magenta-400">SPACEBAR</span></li>
                <li className="flex justify-between border-b border-cyan-900 pb-1"><span>AUDIO_OVERRIDE</span> <span className="text-magenta-400">CLICK ICON</span></li>
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
