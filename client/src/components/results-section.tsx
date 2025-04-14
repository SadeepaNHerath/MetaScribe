import { ScoreOverview } from "@/components/score-overview";
import { PreviewSection } from "@/components/preview-section";
import { AnalysisSection } from "@/components/analysis-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { SeoAnalysisData } from "@shared/schema";

interface ResultsSectionProps {
  analysisData: SeoAnalysisData | undefined;
  isLoading: boolean;
  error: Error | null;
  url: string;
}

export function ResultsSection({ analysisData, isLoading, error, url }: ResultsSectionProps) {
  if (isLoading) {
    return <ResultsSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || "Failed to analyze the URL. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!analysisData) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Analysis Results</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Analyzed:</span>
          <span className="font-medium">{analysisData.url}</span>
          <Check className="h-5 w-5 text-secondary" />
        </div>
      </div>

      <ScoreOverview scores={analysisData.scores} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PreviewSection metaTags={analysisData.metaTags} url={analysisData.url} />
        <AnalysisSection 
          metaTags={analysisData.metaTags} 
          recommendations={analysisData.recommendations}
          rawHtml={analysisData.rawHtml}
        />
      </div>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mt-8 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Skeleton className="h-7 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Skeleton className="h-7 w-48 mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
        <div className="space-y-8">
          <Skeleton className="h-7 w-56 mb-4" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
