import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { UrlInput } from "@/components/url-input";
import { ResultsSection } from "@/components/results-section";
import type { SeoAnalysisData } from "@shared/schema";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: analysisData, isLoading, error } = useQuery<SeoAnalysisData>({
    queryKey: isSubmitted ? [`/api/analyze?url=${encodeURIComponent(url)}`] : [],
    enabled: isSubmitted && !!url,
  });

  const handleSubmit = async (submittedUrl: string) => {
    setUrl(submittedUrl);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-3">
            Meta<span className="text-primary">Scribe</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Analyze and optimize your website's SEO with powerful insights
          </p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
          <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        
        {isSubmitted && (
          <ResultsSection 
            analysisData={analysisData} 
            isLoading={isLoading} 
            error={error as Error | null} 
            url={url}
          />
        )}
      </main>
      <AppFooter />
    </div>
  );
}
