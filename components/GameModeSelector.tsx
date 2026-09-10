'use client';

import { motion } from 'framer-motion';
import { Mic2, User } from 'lucide-react';

interface GameModeSelectorProps {
  onSelectMode: (mode: 'seiyuu' | 'character') => void;
}

export default function GameModeSelector({ onSelectMode }: GameModeSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
          SEIYUU <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">GAME</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-medium">
          Проверь свои знания японской озвучки в этой увлекательной викторине!
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4 relative z-10">
        <motion.div
          whileHover={{ scale: 1.03, rotate: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode('seiyuu')}
          className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 cursor-pointer overflow-hidden transition-all hover:bg-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]"
        >
          <div className="absolute top-0 right-0 p-32 bg-purple-500/20 blur-[60px] rounded-full -mr-16 -mt-16 transition-all group-hover:bg-purple-500/30" />
          
          <div className="relative z-10 flex flex-col items-center text-center h-full">
            <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform">
              <Mic2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Режим: Сейю</h2>
            <div className="w-12 h-1 bg-purple-500 rounded-full mb-4" />
            <p className="text-gray-300 leading-relaxed">
              Тебе покажут сейю и 9 персонажей. Твоя задача — найти <span className="text-white font-bold">Лишнего</span>! Того, кого этот актер НЕ озвучивал.
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03, rotate: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode('character')}
          className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 cursor-pointer overflow-hidden transition-all hover:bg-white/20 hover:shadow-[0_0_40px_rgba(236,72,153,0.3)]"
        >
          <div className="absolute top-0 right-0 p-32 bg-pink-500/20 blur-[60px] rounded-full -mr-16 -mt-16 transition-all group-hover:bg-pink-500/30" />
          
          <div className="relative z-10 flex flex-col items-center text-center h-full">
            <div className="w-20 h-20 bg-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg -rotate-3 group-hover:-rotate-6 transition-transform">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Режим: Персонаж</h2>
            <div className="w-12 h-1 bg-pink-500 rounded-full mb-4" />
            <p className="text-gray-300 leading-relaxed">
              Ты увидишь персонажа и 9 сейю. Угадай, чей голос принадлежит этому герою! Только <span className="text-white font-bold">один</span> ответ верный.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}