import { useState } from "react";
import type { MultipleContent } from "@/types";
import styles from "./MultipleChoice.module.css";

interface MultipleChoiceProps {
  content: MultipleContent;
  onNext: () => void;
  onComplete: (isCorrect: boolean) => void;
}

const MultipleChoice = ({
  content,
  onNext,
  onComplete,
}: MultipleChoiceProps) => {
  const { options, correct } = content;
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggleOption = (index: number) => {
    if (submitted) return;

    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;

    setSubmitted(true);

    const correctSet = new Set(correct);
    const isCorrect =
      selected.size === correctSet.size &&
      [...selected].every((s) => correctSet.has(s));

    onComplete(isCorrect);
  };

  const handleNext = () => {
    setSelected(new Set());
    setSubmitted(false);
    onNext();
  };

  const getOptionClass = (index: number) => {
    if (!submitted) {
      return selected.has(index) ? styles.selected : styles.option;
    }

    const isCorrectOption = correct.includes(index);
    const isSelected = selected.has(index);

    if (isCorrectOption && isSelected) return styles.correctSelected;
    if (isCorrectOption && !isSelected) return styles.correctMissed;
    if (!isCorrectOption && isSelected) return styles.incorrectSelected;

    return styles.option;
  };

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {options.map((text, index) => (
          <div
            key={index}
            className={getOptionClass(index)}
            onClick={() => toggleOption(index)}
          >
            <span className={styles.index}>{index + 1}.</span> {text}
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        {!submitted ? (
          <button
            className={styles.submitBtn}
            disabled={selected.size === 0}
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

export default MultipleChoice;
