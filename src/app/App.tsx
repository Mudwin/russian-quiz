import { useState, useCallback, useRef } from "react";
import type { Mode, Phase, Question, ExamResult } from "@/types";
import { useQuestions } from "@/hooks/useQuestions";
import { useExamQuestions } from "@/hooks/useExamQuestions";
import TestArea from "@/components/TestArea";
import questionsData from "@/data/questions.json";
import styles from "./App.module.css";

const allQuestions: Question[] = questionsData as Question[];
const TRAINER_PROGRESS_KEY = "trainer_progress";
const EXAM_SESSIONS_KEY = "exam_sessions";

const loadTrainerProgress = (): number => {
  const raw = localStorage.getItem(TRAINER_PROGRESS_KEY);
  if (raw) {
    try {
      const { completedCount } = JSON.parse(raw);
      return completedCount ?? 0;
    } catch {}
  }
  return 0;
};

const saveTrainerProgress = (count: number) => {
  localStorage.setItem(
    TRAINER_PROGRESS_KEY,
    JSON.stringify({ completedCount: count }),
  );
};

const loadExamSessions = (): ExamResult[] => {
  const raw = localStorage.getItem(EXAM_SESSIONS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as ExamResult[];
    } catch {}
  }
  return [];
};

const saveExamSessions = (sessions: ExamResult[]) => {
  localStorage.setItem(EXAM_SESSIONS_KEY, JSON.stringify(sessions));
};

export default function App() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [mode, setMode] = useState<Mode | null>(null);
  const [trainerCompleted, setTrainerCompleted] = useState(loadTrainerProgress);
  const [examSessions, setExamSessions] =
    useState<ExamResult[]>(loadExamSessions);

  const [examRefreshKey, setExamRefreshKey] = useState(0);

  const [currentExamResult, setCurrentExamResult] = useState<ExamResult | null>(
    null,
  );

  const examAnswersRef = useRef<boolean[]>([]);

  const trainer = useQuestions(allQuestions);
  const examQuestions = useExamQuestions(allQuestions, examRefreshKey);

  const [examIndex, setExamIndex] = useState(0);

  const startExam = () => {
    examAnswersRef.current = [];

    setExamRefreshKey((prev) => prev + 1);
    setExamIndex(0);
    setCurrentExamResult(null);
    setMode("exam");
    setPhase("active");
  };

  const startTrainer = () => {
    setMode("trainer");
    setPhase("active");
  };

  const handleComplete = useCallback(
    (isCorrect: boolean) => {
      if (mode === "trainer") {
        const newCount = trainerCompleted + 1;

        setTrainerCompleted(newCount);
        saveTrainerProgress(newCount);
      } else if (mode === "exam") {
        examAnswersRef.current.push(isCorrect);
      }
    },
    [mode, trainerCompleted],
  );

  const handleNext = useCallback(() => {
    if (mode === "trainer") {
      const hasNext = trainer.goToNext();

      if (!hasNext) {
        setMode(null);
        setPhase("menu");
      }
    } else if (mode === "exam") {
      if (examIndex < examQuestions.length - 1) {
        setExamIndex((prev) => prev + 1);
      } else {
        const answers = examAnswersRef.current;
        const correctCount = answers.filter(Boolean).length;
        const total = examQuestions.length;
        const percentage = Math.round((correctCount / total) * 100);

        const newSession: ExamResult = {
          date: new Date().toLocaleString("ru-RU"),
          correct: correctCount,
          total,
          percentage,
        };

        const updatedSessions = [newSession, ...examSessions].slice(0, 10);
        setExamSessions(updatedSessions);
        saveExamSessions(updatedSessions);

        setCurrentExamResult(newSession);
        setPhase("examResult");
      }
    }
  }, [mode, trainer, examIndex, examQuestions.length, examSessions]);

  const backToMenu = () => {
    setMode(null);
    setPhase("menu");
    setCurrentExamResult(null);
  };

  const restartExam = () => {
    startExam();
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
            Пройдено в тренажёре: {trainerCompleted}
          </div>
          <button className={styles.button} onClick={startTrainer}>
            Тренажёр
          </button>
          <button className={styles.button} onClick={startExam}>
            Экзамен
          </button>

          {examSessions.length > 0 && (
            <div className={styles.history}>
              <h3>Последние результаты экзамена</h3>
              <ul>
                {examSessions.slice(0, 5).map((session, i) => (
                  <li key={i}>
                    {session.date}: {session.correct}/{session.total} (
                    {session.percentage}%)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {phase === "active" && mode === "trainer" && (
        <TestArea
          key="trainer"
          currentQuestion={trainer.currentQuestion}
          currentIndex={trainer.currentIndex}
          total={trainer.total}
          onNext={handleNext}
          onComplete={handleComplete}
          onBack={backToMenu}
        />
      )}

      {phase === "active" && mode === "exam" && (
        <TestArea
          key={`exam-${examRefreshKey}`}
          currentQuestion={examQuestions[examIndex]}
          currentIndex={examIndex}
          total={examQuestions.length}
          onNext={handleNext}
          onComplete={handleComplete}
          onBack={backToMenu}
        />
      )}

      {phase === "examResult" && currentExamResult && (
        <div className={styles.result}>
          <h2>Экзамен завершён</h2>
          <p>
            Правильные ответы: {currentExamResult.correct} из{" "}
            {currentExamResult.total}
          </p>
          <p>Прогресс: {currentExamResult.percentage}%</p>
          <button className={styles.button} onClick={restartExam}>
            Начать заново
          </button>
          <button className={styles.button} onClick={backToMenu}>
            В меню
          </button>
        </div>
      )}
    </div>
  );
}
