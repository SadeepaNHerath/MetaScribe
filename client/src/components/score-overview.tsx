import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreProps {
  scores: {
    overall: number;
    requiredTags: number;
    socialTags: number;
    bestPractices: number;
  };
}

export function ScoreOverview({ scores }: ScoreProps) {
  const scoreCategories = [
    {
      name: "Overall Score",
      value: scores.overall,
      color: getColorForScore(scores.overall),
    },
    {
      name: "Required Tags",
      value: scores.requiredTags,
      color: getColorForScore(scores.requiredTags),
    },
    {
      name: "Social Tags",
      value: scores.socialTags,
      color: getColorForScore(scores.socialTags),
    },
    {
      name: "Best Practices",
      value: scores.bestPractices,
      color: getColorForScore(scores.bestPractices),
    },
  ];

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold mb-6">SEO Tag Health Score</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {scoreCategories.map((category) => (
          <div key={category.name} className="bg-neutral rounded-lg p-4 text-center">
            <div className={`text-3xl font-bold ${category.color} mb-2`}>
              {category.value}%
            </div>
            <div className="text-sm font-medium">{category.name}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`${getProgressColor(category.color)} rounded-full h-2`}
                style={{ width: `${category.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getColorForScore(score: number): string {
  if (score >= 90) return "text-secondary";
  if (score >= 70) return "text-primary";
  if (score >= 50) return "text-warning";
  return "text-error";
}

function getProgressColor(textColor: string): string {
  switch (textColor) {
    case "text-secondary":
      return "bg-secondary";
    case "text-primary":
      return "bg-primary";
    case "text-warning":
      return "bg-warning";
    case "text-error":
      return "bg-error";
    default:
      return "bg-primary";
  }
}
