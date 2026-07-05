import { useState, useCallback, useMemo } from "react";
import type { Question } from "@/types";

// тасование Фишера-Йетса
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

interface UseQuestionsReturn {
  currentQuestion: Question;
  currentIndex: number;
  total: number;
  goToNext: () => boolean;
  isLast: boolean;
}

export function useQuestions(allQuestions: Question[]): UseQuestionsReturn {
  const shuffled = useMemo(() => shuffle(allQuestions), [allQuestions]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    if (currentIndex < shuffled.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return true;
    }

    return false;
  }, [currentIndex, shuffled.length]);

  const isLast = currentIndex === shuffled.length - 1;

  return {
    currentQuestion: shuffled[currentIndex],
    currentIndex,
    total: shuffled.length,
    goToNext,
    isLast,
  };
}
