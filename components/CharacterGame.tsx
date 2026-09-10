'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Loader2, ArrowRight } from 'lucide-react';
import GameCard from './GameCard';
import { useGameLogic } from '@/hooks/useGameLogic';

export default function CharacterGame() {
  const { 
    gameData, 
    loading, 
    score, 
    streak, 
    highScore, 
    nextRound, 
    handleCorrectAnswer, 
    handleWrongAnswer 
  } = useGameLogic({ mode: 'character' });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCardClick = (index: number) => {
    if (showResult) return;
    setSelectedIndex(index);
    setShowResult(true);

    if (gameData && index === gameData.correctAnswer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const handleNextClick = () => {
    setShowResult(false);
    setSelectedIndex(null);
    nextRound();
  };

  const baseUrl = 'https://shikimori.one';

  if (loading || !gameData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-white">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl font-medium animate-pulse">Загружаем персонажа и сейю...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Верхняя панель */}
      <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-8 text-white shadow-lg border border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-gray-300 uppercase font-bold">Счет</p>
            <p className="text-xl font-bold font-mono">{score}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
           <p className="text-xs text-gray-400 uppercase">Рекорд</p>
           <p className="text-lg font-bold text-yellow-200">{highScore}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-gray-300 uppercase font-bold">Серия</p>
            <p className={`text-xl font-bold font-mono ${streak > 2 ? 'text-orange-400' : ''}`}>{streak}</p>
          </div>
          <div className={`p-2 rounded-lg ${streak > 2 ? 'bg-orange-500/20 animate-pulse' : 'bg-gray-500/20'}`}>
            <Flame className={`w-6 h-6 ${streak > 2 ? 'text-orange-500' : 'text-gray-400'}`} />
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row gap-8 items-start"
      >
        {/* Карточка Персонажа */}
        <div className="w-full md:w-1/3 md:sticky md:top-24 flex flex-col items-center">
          <motion.div 
            layoutId="main-card"
            className="bg-white rounded-2xl p-2 shadow-2xl w-full max-w-sm"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-4">
              <img
                src={`${baseUrl}${gameData.mainEntity.image?.original || gameData.mainEntity.image?.preview || ''}`}
                alt={gameData.mainEntity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <span className="inline-block px-2 py-1 bg-pink-600 text-white text-xs font-bold rounded mb-2">
                  ПЕРСОНАЖ
                </span>
                <h2 className="text-2xl font-bold text-white leading-tight">{gameData.mainEntity.name}</h2>
                {gameData.mainEntity.russian && (
                  <p className="text-white/80">{gameData.mainEntity.russian}</p>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-gray-700 text-center font-medium">
                Кто озвучил этого персонажа?
                <br/>
                <span className="text-sm text-gray-500 mt-1 block">(Один верный ответ)</span>
              </p>
            </div>
          </motion.div>

          <AnimatePresence>
            {showResult && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleNextClick}
                className="mt-6 w-full py-4 bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 hover:bg-pink-500 transition-colors md:hidden"
              >
                Следующий раунд <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Сетка вариантов */}
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {gameData.options.map((seiyuu, index) => {
              let status: 'idle' | 'selected' | 'correct' | 'wrong' | 'revealed' = 'idle';
              
              if (showResult) {
                if (index === gameData.correctAnswer) {
                  status = 'correct'; // Тут нужно угадать КТО, поэтому правильный - зеленый
                } else if (selectedIndex === index) {
                  status = 'wrong';
                } else {
                  status = 'idle';
                }
                
                // Если ошиблись, подсвечиваем правильный
                if (selectedIndex !== gameData.correctAnswer && index === gameData.correctAnswer) {
                  status = 'revealed';
                }
              } else if (selectedIndex === index) {
                status = 'selected';
              }

              return (
                <GameCard
                  key={`${seiyuu.id}-${index}`}
                  imageUrl={seiyuu.image?.original || seiyuu.image?.preview || seiyuu.image?.x160 || ''}
                  name={seiyuu.name}
                  russianName={seiyuu.russian}
                  onClick={() => handleCardClick(index)}
                  status={status}
                  disabled={showResult}
                />
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex justify-end hidden md:flex"
              >
                <button
                  onClick={handleNextClick}
                  className="px-8 py-4 bg-white text-pink-900 rounded-xl font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  Следующий раунд <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}