import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Heading1,
  Image,
  AlignLeft,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  List,
} from "lucide-react";
import type { ContentQuality } from "@shared/schema";

interface ContentQualitySectionProps {
  contentQuality: ContentQuality;
}

export function ContentQualitySection({
  contentQuality,
}: ContentQualitySectionProps) {
  const [showHeadingOutline, setShowHeadingOutline] = useState(false);
  const [showMissingAltImages, setShowMissingAltImages] = useState(false);

  const { headingStructure, images, wordCount } = contentQuality;

  // Calculate alt text percentage
  const altTextPercentage =
    images.total > 0 ? Math.round((images.withAlt / images.total) * 100) : 100;

  // Determine status colors
  const getH1Status = () => {
    if (headingStructure.h1Count === 1) return "success";
    if (headingStructure.h1Count === 0) return "error";
    return "warning";
  };

  const getHierarchyStatus = () => {
    return headingStructure.hierarchyValid ? "success" : "warning";
  };

  const getAltTextStatus = () => {
    if (altTextPercentage === 100) return "success";
    if (altTextPercentage >= 80) return "warning";
    return "error";
  };

  const getWordCountStatus = () => {
    if (wordCount >= 1000) return "success";
    if (wordCount >= 300) return "warning";
    return "error";
  };

  const statusColors = {
    success: "text-secondary",
    warning: "text-warning",
    error: "text-error",
  };

  const statusBg = {
    success: "bg-secondary/10",
    warning: "bg-warning/10",
    error: "bg-error/10",
  };

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center">
        <FileText className="mr-2 h-5 w-5 text-primary" />
        Content Quality Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Heading Structure Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Heading1 className="mr-2 h-5 w-5 text-primary" />
              Heading Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* H1 Count */}
            <div className={`p-3 rounded-lg ${statusBg[getH1Status()]}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">H1 Headings</span>
                <Badge
                  variant={
                    getH1Status() === "success"
                      ? "secondary"
                      : getH1Status() === "warning"
                        ? "default"
                        : "destructive"
                  }
                >
                  {headingStructure.h1Count} found
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {headingStructure.h1Count === 1 &&
                  "Perfect! Exactly one H1 heading."}
                {headingStructure.h1Count === 0 &&
                  "Missing H1 heading - add one to define the main topic."}
                {headingStructure.h1Count > 1 &&
                  `Multiple H1s detected. Consider using only one.`}
              </p>
            </div>

            {/* Hierarchy Valid */}
            <div className={`p-3 rounded-lg ${statusBg[getHierarchyStatus()]}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Heading Hierarchy</span>
                {headingStructure.hierarchyValid ? (
                  <CheckCircle className="h-5 w-5 text-secondary" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-warning" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {headingStructure.hierarchyValid
                  ? "Proper heading hierarchy maintained."
                  : "Heading levels are skipped. Use proper H1→H2→H3 order."}
              </p>
            </div>

            {/* Heading Outline Toggle */}
            {headingStructure.outline.length > 0 && (
              <div>
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={() => setShowHeadingOutline(!showHeadingOutline)}
                >
                  <List className="mr-1 h-4 w-4" />
                  {showHeadingOutline ? "Hide" : "View"} heading outline (
                  {headingStructure.outline.length})
                  {showHeadingOutline ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>

                {showHeadingOutline && (
                  <div className="mt-3 p-3 bg-muted rounded-lg max-h-48 overflow-y-auto">
                    <ul className="space-y-1 text-sm">
                      {headingStructure.outline.map((heading, index) => (
                        <li
                          key={index}
                          className="flex items-start"
                          style={{
                            paddingLeft: `${(heading.level - 1) * 16}px`,
                          }}
                        >
                          <span className="font-mono text-muted-foreground mr-2">
                            H{heading.level}
                          </span>
                          <span className="truncate">
                            {heading.text || "(empty)"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Image className="mr-2 h-5 w-5 text-primary" />
              Image Alt Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.total === 0 ? (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">
                  No images found on this page.
                </p>
              </div>
            ) : (
              <>
                {/* Alt Text Coverage */}
                <div
                  className={`p-3 rounded-lg ${statusBg[getAltTextStatus()]}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Alt Text Coverage</span>
                    <span
                      className={`font-bold ${statusColors[getAltTextStatus()]}`}
                    >
                      {altTextPercentage}%
                    </span>
                  </div>
                  <Progress value={altTextPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {images.withAlt} of {images.total} images have alt text
                  </p>
                </div>

                {/* Images Summary */}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>{images.withAlt} with alt</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-error" />
                    <span>{images.withoutAlt} missing alt</span>
                  </div>
                </div>

                {/* Missing Alt Images List */}
                {images.missingAltImages.length > 0 && (
                  <div>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary"
                      onClick={() =>
                        setShowMissingAltImages(!showMissingAltImages)
                      }
                    >
                      {showMissingAltImages ? "Hide" : "Show"} images missing
                      alt text
                      {showMissingAltImages ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </Button>

                    {showMissingAltImages && (
                      <div className="mt-3 p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
                        <ul className="space-y-1 text-sm">
                          {images.missingAltImages.map((src, index) => (
                            <li
                              key={index}
                              className="truncate text-muted-foreground"
                            >
                              {src || "(no src attribute)"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Word Count Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlignLeft className="mr-2 h-5 w-5 text-primary" />
              Content Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${statusBg[getWordCountStatus()]}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">
                    {wordCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    words on this page
                  </div>
                </div>
                <div className="text-right">
                  {wordCount >= 1000 && (
                    <Badge variant="secondary" className="mb-1">
                      Comprehensive
                    </Badge>
                  )}
                  {wordCount >= 300 && wordCount < 1000 && (
                    <Badge variant="default" className="mb-1">
                      Adequate
                    </Badge>
                  )}
                  {wordCount < 300 && (
                    <Badge variant="destructive" className="mb-1">
                      Thin Content
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {wordCount >= 1000 && "Excellent content depth for SEO"}
                    {wordCount >= 300 &&
                      wordCount < 1000 &&
                      "Consider adding more content"}
                    {wordCount < 300 && "Add more content (aim for 300+ words)"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
