import { useState } from "react";
import type { MatchingContent } from "@/types";
import styles from "./Matching.module.css";

interface MatchingProps {
  content: MatchingContent;
  onNext: () => void;
  onComplete: (isCorrect: boolean) => void;
}

const Matching = ({ content, onNext, onComplete }: MatchingProps) => {
  const { left, right, pairs } = content;
  const correctMap = new Map<number, number>(pairs);

  const [selected, setSelected] = useState<Map<number, number>>(new Map());
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (leftIndex: number, rightIndex: number) => {
    if (submitted) return;

    setSelected((prev) => {
      const next = new Map(prev);

      next.set(leftIndex, rightIndex);
      return next;
    });
  };

  const isComplete =
    selected.size === left.length &&
    [...selected.entries()].every(
      ([left, right]) => correctMap.get(left) === right,
    );

  const handleSubmit = () => {
    if (selected.size !== left.length) return;

    setSubmitted(true);
    onComplete(isComplete);
  };

  const handleNext = () => {
    setSelected(new Map());
    setSubmitted(false);
    onNext();
  };

  const getRightClass = (leftIndex: number, rightIndex: number) => {
    const isSelected = selected.get(leftIndex) === rightIndex;

    if (!submitted) {
      return isSelected ? styles.rightSelected : styles.rightOption;
    }

    const isCorrectPair = correctMap.get(leftIndex) === rightIndex;

    if (isCorrectPair && isSelected) return styles.correctSelected;
    if (isCorrectPair && !isSelected) return styles.correctMissed;
    if (!isCorrectPair && isSelected) return styles.incorrectSelected;

    return styles.rightOption;
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.columnHeader}>Фраза / предложение</div>
        <div className={styles.columnHeader}>Ваш выбор</div>

        {left.map((leftText, leftIndex) => (
          <div key={leftIndex} className={styles.row}>
            <div className={styles.leftCell}>{leftText}</div>
            <div className={styles.rightGroup}>
              {right.map((rightText, rightIndex) => (
                <button
                  key={rightIndex}
                  className={getRightClass(leftIndex, rightIndex)}
                  onClick={() => handleSelect(leftIndex, rightIndex)}
                  disabled={submitted}
                >
                  {rightText}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        {!submitted ? (
          <button
            className={styles.submitBtn}
            disabled={selected.size !== left.length}
            onClick={handleSubmit}
          >
            Проверить
          </button>
        ) : (
          <button className={styles.nextBtn} onClick={handleNext}>
            Далее
          </button>
        )}
      </div>
    </div>
  );
};

export default Matching;
