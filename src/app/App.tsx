import { useState } from "react";
import type { Mode, Phase, Question } from "@/types";
import questionsData from "@/data/questions.json";
import styles from "./App.module.css";

const allQuestions: Question[] = questionsData as Question[];

export default function App() {
  const [phase, setPhase] = useState<Phase>("menu");
  const [mode, setMode] = useState<Mode | null>(null);

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
          <button className={styles.button} onClick={startTrainer}>
            Тренажёр
          </button>
          <button className={styles.button} onClick={startExam}>
            Экзамен
          </button>
        </div>
      )}

      {phase === "active" && mode && (
        <div className={styles.placeholder}>
          <p>Режим «{mode === "trainer" ? "Тренажёр" : "Экзамен"}» </p>
          <button className={styles.button} onClick={backToMenu}>
            Назад в меню
          </button>
        </div>
      )}

      {phase === "examResult" && (
        <div className={styles.placeholder}>
          <p>Результаты экзамена</p>
          <button className={styles.button} onClick={backToMenu}>
            Назад в меню
          </button>
        </div>
      )}
    </div>
  );
}
