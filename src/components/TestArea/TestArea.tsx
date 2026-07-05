import type { Mode, Question } from "@/types";
import QuestionRenderer from "@/components/QuestionRenderer";
import styles from "./TestArea.module.css";

interface TestAreaProps {
  currentQuestion: Question;
  currentIndex: number;
  total: number;
  onNext: () => void;
  onComplete: (isCorrect: boolean) => void;
  onBack: () => void;
}

const TestArea = ({
  currentQuestion,
  currentIndex,
  total,
  onNext,
  onComplete,
  onBack,
}: TestAreaProps) => {
  return (
    <div className={styles.test}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← В меню
        </button>
        <span className={styles.counter}>
          {currentIndex + 1} / {total}
        </span>
      </div>
      <h2 className={styles.instruction}>{currentQuestion.instruction}</h2>
      <QuestionRenderer
        question={currentQuestion}
        onNext={onNext}
        onComplete={onComplete}
      />
    </div>
  );
};

export default TestArea;
