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
    <div className="min-h-screen flex flex-col bg-gray-100 text-textDark">
      <AppHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />
        
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
