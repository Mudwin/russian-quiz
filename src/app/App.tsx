import { useState, useEffect, useCallback } from "react";
import type { Mode, Phase, Question } from "@/types";
import { useQuestions } from "@/hooks/useQuestions";
import QuestionRenderer from "@/components/QuestionRenderer";
import questionsData from "@/data/questions.json";
import styles from "./App.module.css";

const allQuestions: Question[] = questionsData as Question[];
const PROGRESS_KEY = "trainer_progress";

const loadProgress = (): number => {
  const raw = localStorage.getItem(PROGRESS_KEY);

  if (raw) {
    try {
      const { completedCount } = JSON.parse(raw);
      return completedCount ?? 0;
    } catch {
      return 0;
    }
  }

  return 0;
};

const saveProgress = (count: number) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ completedCount: count }));
};

export default function App() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [mode, setMode] = useState<Mode | null>(null);
  const [completedCount, setCompletedCount] = useState(loadProgress);

  const { currentQuestion, currentIndex, total, goToNext, isLast } =
    useQuestions(allQuestions);

  const handleComplete = useCallback(
    (isCorrect: boolean) => {
      const newCount = completedCount + 1;

      setCompletedCount(newCount);
      saveProgress(newCount);
    },
    [completedCount],
  );

  const handleNext = () => {
    const hasNext = goToNext();

    if (!hasNext) {
      setMode(null);
      setPhase("menu");
    }
  };

  const startTrainer = () => {
    setMode("trainer");
    setPhase("active");
  };

  const startExam = () => {
    setMode("exam");
    setPhase("active");
  };

  const backToMenu = () => {
    setMode(null);
    setPhase("menu");
  };

  return (
    <div className={styles.container}>
      {phase === "menu" && (
        <div className={styles.menu}>
          <h1 className={styles.title}>Тренажёр по русскому языку</h1>
          <p className={styles.subtitle}>
            300+ вопросов по различным темам для подготовки к экзамену
          </p>
          <div className={styles.progress}>
            Пройдено в тренажёре: {completedCount}
          </div>
          <button className={styles.button} onClick={startTrainer}>
            Тренажёр
          </button>
          <button className={styles.button} onClick={startExam}>
            Экзамен
          </button>
        </div>
      )}

      {phase === "active" && mode && (
        <div className={styles.test}>
          <div className={styles.header}>
            <button className={styles.backBtn} onClick={backToMenu}>
              ← В меню
            </button>
            <span className={styles.counter}>
              {currentIndex + 1} / {total}
            </span>
          </div>
          <h2 className={styles.instruction}>{currentQuestion.instruction}</h2>
          <QuestionRenderer
            question={currentQuestion}
            onNext={handleNext}
            onComplete={handleComplete}
          />
        </div>
      )}
    </div>
  );
}
