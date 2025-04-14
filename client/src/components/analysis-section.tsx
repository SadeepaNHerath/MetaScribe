import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Lightbulb, Copy, Check, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { MetaTag, Recommendation } from "@shared/schema";

interface AnalysisSectionProps {
  metaTags: MetaTag[];
  recommendations: Recommendation[];
  rawHtml?: string;
}

export function AnalysisSection({ metaTags, recommendations, rawHtml }: AnalysisSectionProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const visibleTags = showAllTags ? metaTags : metaTags.slice(0, 5);
  
  const copyRawHtml = () => {
    if (rawHtml) {
      navigator.clipboard.writeText(rawHtml);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Raw HTML has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="space-y-8">
      <h3 className="text-xl font-semibold">Analysis & Recommendations</h3>
      
      {/* Meta Tags Analysis */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Code className="text-primary mr-2 h-5 w-5" />
            <h4 className="font-semibold">Detected Meta Tags</h4>
          </div>
          
          <div className="space-y-4">
            {visibleTags.map((tag, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-primary">{tag.name}</div>
                  <span className={`text-xs font-medium ${getStatusColor(tag.status)} px-2 py-1 rounded-full`}>
                    {tag.status === 'present' ? 'Present' : tag.status === 'missing' ? 'Missing' : 'Warning'}
                  </span>
                </div>
                <div className="mt-1 text-sm bg-gray-50 p-2 rounded">
                  {tag.content ? (
                    <code className="text-gray-700">{tag.content}</code>
                  ) : (
                    <span className="text-gray-500 italic">
                      No {tag.name} meta tag detected. {tag.name === 'robots' ? 'Search engines will use their default behavior.' : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {metaTags.length > 5 && (
              <div className="mt-4">
                <Button
                  variant="link"
                  className="text-primary hover:text-primary/80 font-medium p-0 h-auto"
                  onClick={() => setShowAllTags(!showAllTags)}
                >
                  {showAllTags ? (
                    <>
                      <ChevronUp className="mr-1 h-4 w-4" />
                      Hide additional meta tags
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1 h-4 w-4" />
                      Show all detected meta tags ({metaTags.length})
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendations */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Lightbulb className="text-secondary mr-2 h-5 w-5" />
            <h4 className="font-semibold">Recommendations</h4>
          </div>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`border-l-4 ${getRecommendationBorder(rec.type)} rounded-r-lg p-4`}
              >
                <h5 className="font-medium mb-1">{rec.title}</h5>
                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                {rec.code && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <code className="text-gray-700 whitespace-pre-wrap">{rec.code}</code>
                  </div>
                )}
              </div>
            ))}
            
            <div className="text-sm text-gray-500 border-t border-gray-200 pt-4 mt-6">
              <div className="flex items-start">
                <Info className="text-gray-400 mr-2 text-sm h-4 w-4" />
                <p>These recommendations are based on SEO best practices and may vary based on your specific goals and target platforms.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Raw Meta Tags */}
      {rawHtml && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Code className="text-primary mr-2 h-5 w-5" />
                <h4 className="font-semibold">Raw Meta Tags</h4>
              </div>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 text-sm font-medium"
                onClick={copyRawHtml}
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-auto max-h-80 text-sm">
              <pre>
                <code>{rawHtml}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'present':
      return 'bg-secondary/20 text-secondary';
    case 'missing':
      return 'bg-warning/20 text-warning';
    case 'warning':
      return 'bg-warning/20 text-warning';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getRecommendationBorder(type: string): string {
  switch (type) {
    case 'success':
      return 'border-secondary bg-secondary/10';
    case 'warning':
      return 'border-warning bg-warning/10';
    case 'error':
      return 'border-error bg-error/10';
    default:
      return 'border-gray-200 bg-gray-50';
  }
}
