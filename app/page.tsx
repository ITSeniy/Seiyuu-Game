'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import GameModeSelector from '@/components/GameModeSelector';
import SeiyuuGame from '@/components/SeiyuuGame';
import CharacterGame from '@/components/CharacterGame';

export default function Home() {
  const [gameMode, setGameMode] = useState<'seiyuu' | 'character' | null>(null);

  const handleSelectMode = (mode: 'seiyuu' | 'character') => {
    setGameMode(mode);
  };

  const handleBackToMenu = () => {
    setGameMode(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-900 overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Глобальный фон для всех страниц */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/50 via-[#0f172a] to-[#0f172a] pointer-events-none" />
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!gameMode ? (
            <motion.div 
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GameModeSelector onSelectMode={handleSelectMode} />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <button
                onClick={handleBackToMenu}
                className="fixed top-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              {gameMode === 'seiyuu' ? <SeiyuuGame /> : <CharacterGame />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}