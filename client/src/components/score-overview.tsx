import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle, AlertTriangle, Globe, Share2, BookCheck } from "lucide-react";

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
      icon: <Globe className="h-6 w-6" />,
      description: "Your overall SEO health score based on all meta tag categories",
      status: getScoreStatus(scores.overall),
      tips: "This score represents the overall health of your meta tags implementation."
    },
    {
      name: "Required Tags",
      value: scores.requiredTags,
      color: getColorForScore(scores.requiredTags),
      icon: <CheckCircle className="h-6 w-6" />,
      description: "Essential meta tags like title, description, and viewport",
      status: getScoreStatus(scores.requiredTags),
      tips: "These tags are crucial for search engines to understand and rank your page properly."
    },
    {
      name: "Social Tags",
      value: scores.socialTags,
      color: getColorForScore(scores.socialTags),
      icon: <Share2 className="h-6 w-6" />,
      description: "Open Graph and Twitter Card tags for social media sharing",
      status: getScoreStatus(scores.socialTags),
      tips: "These tags control how your content appears when shared on social platforms."
    },
    {
      name: "Best Practices",
      value: scores.bestPractices,
      color: getColorForScore(scores.bestPractices),
      icon: <BookCheck className="h-6 w-6" />,
      description: "SEO best practices like robots, canonical, and language tags",
      status: getScoreStatus(scores.bestPractices),
      tips: "Following these practices helps search engines index your content properly."
    },
  ];

  return (
    <section className="bg-card rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">SEO Tag Health Score</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scoreCategories.map((category) => (
          <Card key={category.name} className="overflow-hidden">
            <CardHeader className={`${getBgColorForScore(category.color)} p-4`}>
              <div className="flex justify-between items-center">
                <div className="text-white">
                  {category.icon}
                </div>
                <div className="text-3xl font-bold text-white">
                  {category.value}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center mb-2">
                <h4 className="font-semibold">{category.name}</h4>
                {getStatusIcon(category.status)}
              </div>
              <p className="text-sm text-muted-foreground">{category.description}</p>
              <div className="w-full bg-secondary/20 rounded-full h-2 mt-4">
                <div
                  className={`${getProgressColor(category.color)} rounded-full h-2`}
                  style={{ width: `${category.value}%` }}
                ></div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <p className="text-xs text-muted-foreground">{category.tips}</p>
            </CardFooter>
          </Card>
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

function getBgColorForScore(textColor: string): string {
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

function getScoreStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

function getStatusIcon(status: 'excellent' | 'good' | 'fair' | 'poor') {
  switch (status) {
    case 'excellent':
      return <CheckCircle className="h-4 w-4 ml-2 text-secondary" />;
    case 'good':
      return <CheckCircle className="h-4 w-4 ml-2 text-primary" />;
    case 'fair':
      return <AlertTriangle className="h-4 w-4 ml-2 text-warning" />;
    case 'poor':
      return <AlertCircle className="h-4 w-4 ml-2 text-error" />;
    default:
      return null;
  }
}
