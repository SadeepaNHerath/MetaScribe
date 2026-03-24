import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  FileCode,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Code,
} from "lucide-react";
import type { StructuredData } from "@shared/schema";

interface StructuredDataSectionProps {
  structuredData: StructuredData[];
}

export function StructuredDataSection({
  structuredData,
}: StructuredDataSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const validCount = structuredData.filter((sd) => sd.isValid).length;
  const invalidCount = structuredData.length - validCount;

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const copyToClipboard = (data: Record<string, any>, index: number) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedIndex(index);
    toast({
      title: "Copied!",
      description: "Structured data JSON copied to clipboard",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (structuredData.length === 0) {
    return (
      <section className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <FileCode className="mr-2 h-5 w-5 text-primary" />
          Structured Data (JSON-LD)
        </h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="font-semibold text-lg mb-2">
                No Structured Data Found
              </h4>
              <p className="text-muted-foreground max-w-md">
                This page doesn't have any JSON-LD structured data. Adding
                Schema.org markup can help search engines understand your
                content and enable rich snippets in search results.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          <FileCode className="mr-2 h-5 w-5 text-primary" />
          Structured Data (JSON-LD)
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {validCount} Valid
          </Badge>
          {invalidCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {invalidCount} Invalid
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {structuredData.map((sd, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden ${
                  sd.isValid ? "border-secondary/50" : "border-warning/50"
                }`}
              >
                {/* Header */}
                <div
                  className={`p-4 flex items-center justify-between cursor-pointer ${
                    sd.isValid ? "bg-secondary/10" : "bg-warning/10"
                  }`}
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center gap-3">
                    <Code
                      className={`h-5 w-5 ${sd.isValid ? "text-secondary" : "text-warning"}`}
                    />
                    <div>
                      <div className="font-semibold">{sd.type}</div>
                      <div className="text-sm text-muted-foreground">
                        Schema.org type
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={sd.isValid ? "secondary" : "destructive"}>
                      {sd.isValid ? "Valid" : "Has Errors"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(sd.data, index);
                      }}
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    {expandedItems.has(index) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>

                {/* Errors */}
                {sd.errors && sd.errors.length > 0 && (
                  <div className="px-4 py-2 bg-warning/5 border-t border-warning/20">
                    <div className="text-sm font-medium text-warning mb-1">
                      Validation Errors:
                    </div>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {sd.errors.map((error, errIndex) => (
                        <li key={errIndex}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expanded JSON view */}
                {expandedItems.has(index) && (
                  <div className="p-4 bg-muted/50 border-t">
                    <pre className="text-sm overflow-x-auto bg-gray-800 text-gray-200 p-4 rounded-lg">
                      <code>{JSON.stringify(sd.data, null, 2)}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary info */}
          <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
            <p>
              Found {structuredData.length} structured data block
              {structuredData.length !== 1 ? "s" : ""}. Types:{" "}
              {Array.from(new Set(structuredData.map((sd) => sd.type))).join(
                ", ",
              )}
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
