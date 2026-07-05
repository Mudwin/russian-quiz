import { useMemo } from "react";
import type { Question } from "@/types";

const PROTOTYPE_RANGES: [number, number][] = [
  [1, 16], // 1
  [17, 31], // 2
  [32, 46], // 3
  [47, 61], // 4
  [62, 76], // 5
  [77, 91], // 6
  [92, 106], // 7
  [107, 121], // 8
  [122, 136], // 9
  [137, 151], // 10
  [152, 166], // 11
  [167, 181], // 12
  [182, 196], // 13
  [212, 226], // 14
  [227, 241], // 15
  [242, 256], // 16
  [257, 271], // 17
  [272, 286], // 18
  [287, 301], // 19
  [302, 316], // 20
];

function pickRandomFromRange(
  questions: Question[],
  min: number,
  max: number,
): Question {
  const pool = questions.filter(
    (question) => Number(question.id) >= min && Number(question.id) <= max,
  );

  if (pool.length === 0) {
    return questions[Math.floor(Math.random() * questions.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function useExamQuestions(
  allQuestions: Question[],
  refreshKey: number,
): Question[] {
  const examQuestions = useMemo(() => {
    return PROTOTYPE_RANGES.map(([min, max]) =>
      pickRandomFromRange(allQuestions, min, max),
    );
  }, [allQuestions, refreshKey]);

  return examQuestions;
}
