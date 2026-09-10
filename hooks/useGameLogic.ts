import { useState, useEffect, useCallback, useRef } from 'react';

interface GameData {
  mainEntity: any;
  options: any[];
  correctAnswer: number;
}

interface UseGameLogicProps {
  mode: 'seiyuu' | 'character';
}

export function useGameLogic({ mode }: UseGameLogicProps) {
  // Текущее состояние игры
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  // Буфер для следующей игры (предзагрузка)
  const [nextGameBuffer, setNextGameBuffer] = useState<GameData | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Флаг, чтобы не делать дублирующие запросы
  const isFetchingRef = useRef(false);

  // Функция загрузки данных
  const fetchGameData = async (): Promise<GameData | null> => {
    try {
      const response = await fetch(`/api/shikimori?mode=${mode}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch game data:', error);
      return null;
    }
  };

  // Инициализация первой игры
  const initGame = useCallback(async () => {
    setLoading(true);
    const data = await fetchGameData();
    if (data) {
      setCurrentGame(data);
      // Сразу начинаем грузить следующий раунд
      fetchNextBuffer();
    }
    setLoading(false);
  }, [mode]);

  // Загрузка в буфер
  const fetchNextBuffer = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    const data = await fetchGameData();
    if (data) {
      setNextGameBuffer(data);
    }
    isFetchingRef.current = false;
  };

  useEffect(() => {
    initGame();
    // Восстанавливаем рекорд из localStorage
    const savedHighScore = localStorage.getItem(`highScore-${mode}`);
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
  }, [initGame, mode]);

  // Переход к следующему раунду
  const nextRound = async () => {
    if (nextGameBuffer) {
      // Если есть в буфере, берем оттуда мгновенно
      setCurrentGame(nextGameBuffer);
      setNextGameBuffer(null);
      // И сразу грузим новый буфер
      fetchNextBuffer();
    } else {
      // Если игрок слишком быстрый и буфер не успел, показываем загрузку
      setLoading(true);
      const data = await fetchGameData();
      if (data) setCurrentGame(data);
      setLoading(false);
      fetchNextBuffer();
    }
  };

  const handleCorrectAnswer = () => {
    const newScore = score + 10 + (streak * 2); // Бонус за серию
    const newStreak = streak + 1;
    setScore(newScore);
    setStreak(newStreak);
    
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem(`highScore-${mode}`, newScore.toString());
    }
  };

  const handleWrongAnswer = () => {
    setStreak(0);
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    initGame();
  };

  return {
    gameData: currentGame,
    loading,
    score,
    streak,
    highScore,
    nextRound,
    handleCorrectAnswer,
    handleWrongAnswer,
    resetGame
  };
}