'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface GameCardProps {
  imageUrl: string;
  name: string;
  russianName?: string;
  onClick: () => void;
  disabled?: boolean;
  status: 'idle' | 'selected' | 'correct' | 'wrong' | 'revealed';
}

export default function GameCard({
  imageUrl,
  name,
  russianName,
  onClick,
  disabled,
  status,
}: GameCardProps) {
  const baseUrl = 'https://shikimori.one';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

  // Определение стилей рамки и оверлея в зависимости от статуса
  let ringColor = 'ring-transparent';
  let overlay = null;

  if (status === 'selected') ringColor = 'ring-blue-500 ring-4 scale-105';
  if (status === 'correct') ringColor = 'ring-green-500 ring-4 scale-105';
  if (status === 'wrong') ringColor = 'ring-red-500 ring-4 scale-95 opacity-50';
  if (status === 'revealed') ringColor = 'ring-green-500 ring-4 opacity-100 scale-100'; // Показываем правильный, если ошиблись

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={!disabled ? { scale: 1.05, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`
        relative cursor-pointer rounded-xl overflow-hidden bg-white shadow-xl 
        transition-all duration-300 w-full aspect-[2/3] group
        ${ringColor}
        ${disabled && status === 'idle' ? 'opacity-50 grayscale' : ''}
      `}
    >
      <div className="absolute inset-0">
        <img
          src={fullImageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Градиент снизу для читаемости текста */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Индикаторы статуса */}
      {status === 'correct' && (
        <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="bg-green-500 rounded-full p-2"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      )}
      
      {status === 'wrong' && (
        <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="bg-red-500 rounded-full p-2"
          >
            <X className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-3 text-white">
        <p className="font-bold text-sm md:text-base leading-tight drop-shadow-md truncate">{name}</p>
        {russianName && (
          <p className="text-xs text-gray-300 truncate drop-shadow-md">{russianName}</p>
        )}
      </div>
    </motion.div>
  );
}