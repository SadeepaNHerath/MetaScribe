import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Code, Lightbulb, Copy, Check, ChevronDown, ChevronUp, Info, Tag, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  
  // Group meta tags by status for summary
  const presentTags = metaTags.filter(tag => tag.status === 'present').length;
  const missingTags = metaTags.filter(tag => tag.status === 'missing').length;
  const warningTags = metaTags.filter(tag => tag.status === 'warning').length;
  
  // Group recommendations by type for summary
  const successRecs = recommendations.filter(rec => rec.type === 'success').length;
  const warningRecs = recommendations.filter(rec => rec.type === 'warning').length;
  const errorRecs = recommendations.filter(rec => rec.type === 'error').length;
  
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
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Meta Tags Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Tag className="text-primary mr-2 h-5 w-5" />
              Meta Tags Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-8 w-8 text-secondary mb-1" />
                  <span className="text-xl font-bold">{presentTags}</span>
                  <span className="text-xs text-muted-foreground">Present</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-8 w-8 text-warning mb-1" />
                  <span className="text-xl font-bold">{warningTags}</span>
                  <span className="text-xs text-muted-foreground">Warnings</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <Info className="h-8 w-8 text-error mb-1" />
                  <span className="text-xl font-bold">{missingTags}</span>
                  <span className="text-xs text-muted-foreground">Missing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recommendations Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="text-primary mr-2 h-5 w-5" />
              Recommendations Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-8 w-8 text-secondary mb-1" />
                  <span className="text-xl font-bold">{successRecs}</span>
                  <span className="text-xs text-muted-foreground">Good</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <AlertTriangle className="h-8 w-8 text-warning mb-1" />
                  <span className="text-xl font-bold">{warningRecs}</span>
                  <span className="text-xs text-muted-foreground">Improvements</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <Info className="h-8 w-8 text-error mb-1" />
                  <span className="text-xl font-bold">{errorRecs}</span>
                  <span className="text-xs text-muted-foreground">Critical</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="meta-tags" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meta-tags">Meta Tags</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meta-tags" className="mt-6">
          {/* Meta Tags Analysis */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Code className="text-primary mr-2 h-5 w-5" />
                <h4 className="font-semibold">Detected Meta Tags</h4>
              </div>
              
              <div className="space-y-4">
                {visibleTags.map((tag, index) => (
                  <div key={index} className="border rounded-lg p-4 dark:border-border">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-primary">{tag.name}</div>
                      <Badge variant={getBadgeVariant(tag.status)}>
                        {tag.status === 'present' ? 'Present' : tag.status === 'missing' ? 'Missing' : 'Warning'}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm bg-muted p-2 rounded">
                      {tag.content ? (
                        <code className="text-foreground">{tag.content}</code>
                      ) : (
                        <span className="text-muted-foreground italic">
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
          
          {/* Raw Meta Tags */}
          {rawHtml && (
            <Card className="mt-6">
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
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-6">
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
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    {rec.code && (
                      <div className="bg-muted p-3 rounded text-sm">
                        <code className="text-foreground whitespace-pre-wrap">{rec.code}</code>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="text-sm text-muted-foreground border-t pt-4 mt-6">
                  <div className="flex items-start">
                    <Info className="text-muted-foreground mr-2 text-sm h-4 w-4" />
                    <p>These recommendations are based on SEO best practices and may vary based on your specific goals and target platforms.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function getBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'present':
      return 'secondary';
    case 'missing':
      return 'destructive';
    case 'warning':
      return 'default';
    default:
      return 'outline';
  }
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
      return 'border-border bg-muted';
  }
}
