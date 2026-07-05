import type { MatchingContent, MultipleContent, Question } from "@/types";
import MultipleChoice from "@/components/MultipleChoice";
import Matching from "@/components/Matching";

interface QuestionRendererProps {
  question: Question;
  onNext: () => void;
  onComplete: (isCorrect: boolean) => void;
}

const QuestionRenderer = ({
  question,
  onNext,
  onComplete,
}: QuestionRendererProps) => {
  if (question.type === "multiple") {
    return (
      <MultipleChoice
        content={question.content as MultipleContent}
        onNext={onNext}
        onComplete={onComplete}
      />
    );
  }

  if (question.type === "matching") {
    return (
      <Matching
        content={question.content as MatchingContent}
        onNext={onNext}
        onComplete={onComplete}
      />
    );
  }

  return <div>Неизвестный тип вопроса</div>;
};

export default QuestionRenderer;
