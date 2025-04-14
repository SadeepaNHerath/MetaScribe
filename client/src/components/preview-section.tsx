import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, Search, AlertTriangle, CheckCircle, Share2 } from "lucide-react";
import { SiX, SiFacebook, SiLinkedin } from "react-icons/si";
import { Progress } from "@/components/ui/progress";
import type { MetaTag } from "@shared/schema";
import { getMetaTagValue } from "@/lib/seoHelpers";

interface PreviewSectionProps {
  metaTags: MetaTag[];
  url: string;
}

export function PreviewSection({ metaTags, url }: PreviewSectionProps) {
  const title = getMetaTagValue(metaTags, "title");
  const description = getMetaTagValue(metaTags, "description");
  const ogTitle = getMetaTagValue(metaTags, "og:title") || title;
  const ogDescription = getMetaTagValue(metaTags, "og:description") || description;
  const ogImage = getMetaTagValue(metaTags, "og:image");
  const twitterTitle = getMetaTagValue(metaTags, "twitter:title") || ogTitle || title;
  const twitterDescription = getMetaTagValue(metaTags, "twitter:description") || ogDescription || description;
  const twitterImage = getMetaTagValue(metaTags, "twitter:image") || ogImage;
  const twitterCard = getMetaTagValue(metaTags, "twitter:card");
  
  const displayUrl = url.replace(/^https?:\/\//, "");
  
  const titleLength = title ? title.length : 0;
  const descriptionLength = description ? description.length : 0;
  const titleScore = calculateScoreByLength(titleLength, 50, 60);
  const descriptionScore = calculateScoreByLength(descriptionLength, 120, 155);
  
  return (
    <section className="space-y-8">
      <h3 className="text-xl font-semibold">Platform Previews</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Search className="text-primary mr-2 h-5 w-5" />
              Title Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Title Length: {titleLength} characters</span>
                  <span className={`text-xs font-medium ${getTitleLengthColor(titleLength)}`}>
                    {getLengthStatus(titleLength, 50, 60)}
                  </span>
                </div>
                <Progress value={titleScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Optimal length: 50-60 characters for search engines
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Description Length: {descriptionLength} characters</span>
                  <span className={`text-xs font-medium ${getDescriptionLengthColor(descriptionLength)}`}>
                    {getLengthStatus(descriptionLength, 120, 155)}
                  </span>
                </div>
                <Progress value={descriptionScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Optimal length: 120-155 characters for search engines
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Share2 className="text-primary mr-2 h-5 w-5" />
              Social Media Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-2 border rounded-md">
                <SiX className="text-foreground dark:text-white h-6 w-6 mb-2" />
                <div className="text-center mt-1">
                  {twitterCard && twitterImage ? (
                    <CheckCircle className="h-5 w-5 mx-auto text-secondary" />
                  ) : twitterCard || twitterImage ? (
                    <AlertTriangle className="h-5 w-5 mx-auto text-warning" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mx-auto text-error" />
                  )}
                </div>
                <div className="text-xs text-center mt-1 text-muted-foreground">
                  {twitterCard && twitterImage ? "Ready" : "Missing tags"}
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-2 border rounded-md">
                <SiFacebook className="text-blue-600 h-6 w-6 mb-2" />
                <div className="text-center mt-1">
                  {getMetaTagValue(metaTags, "og:type") && ogImage ? (
                    <CheckCircle className="h-5 w-5 mx-auto text-secondary" />
                  ) : (getMetaTagValue(metaTags, "og:type") || ogImage) ? (
                    <AlertTriangle className="h-5 w-5 mx-auto text-warning" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mx-auto text-error" />
                  )}
                </div>
                <div className="text-xs text-center mt-1 text-muted-foreground">
                  {getMetaTagValue(metaTags, "og:type") && ogImage ? "Ready" : "Missing tags"}
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-2 border rounded-md">
                <SiLinkedin className="text-blue-700 h-6 w-6 mb-2" />
                <div className="text-center mt-1">
                  {ogTitle && ogDescription && ogImage ? (
                    <CheckCircle className="h-5 w-5 mx-auto text-secondary" />
                  ) : (ogTitle && ogDescription) || ogImage ? (
                    <AlertTriangle className="h-5 w-5 mx-auto text-warning" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mx-auto text-error" />
                  )}
                </div>
                <div className="text-xs text-center mt-1 text-muted-foreground">
                  {ogTitle && ogDescription && ogImage ? "Ready" : "Missing tags"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="google" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="google">
            <Search className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Google</span>
          </TabsTrigger>
          <TabsTrigger value="twitter">
            <SiX className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">X/Twitter</span>
          </TabsTrigger>
          <TabsTrigger value="facebook">
            <SiFacebook className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Facebook</span>
          </TabsTrigger>
          <TabsTrigger value="linkedin">
            <SiLinkedin className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">LinkedIn</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="google" className="mt-6">
          <Card className="preview-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="border rounded-lg p-4 bg-card">
                <div className="text-primary text-xl font-medium mb-1">
                  {title || "No title found"}
                </div>
                <div className="text-green-700 dark:text-green-500 text-sm mb-1">{url}</div>
                <div className="text-muted-foreground text-sm">
                  {description || "No description found"}
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-start">
                  <Info className="text-muted-foreground h-4 w-4 mr-2 mt-0.5" />
                  <p>Google typically displays the first 50-60 characters of a title and 120-155 characters of a description.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="twitter" className="mt-6">
          <Card className="preview-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted w-full h-48 flex items-center justify-center">
                  {twitterImage ? (
                    <img src={twitterImage} alt="X/Twitter card" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-muted-foreground">No image available</span>
                  )}
                </div>
                <div className="p-4 bg-card">
                  <div className="text-muted-foreground text-xs mb-1">{displayUrl}</div>
                  <div className="font-bold mb-1">{twitterTitle || "No title found"}</div>
                  <div className="text-muted-foreground text-sm">
                    {twitterDescription || "No description found"}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-start">
                  <Info className="text-muted-foreground h-4 w-4 mr-2 mt-0.5" />
                  <p>X/Twitter requires <code className="text-xs bg-muted px-1 py-0.5 rounded">twitter:card</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">twitter:title</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">twitter:description</code> and <code className="text-xs bg-muted px-1 py-0.5 rounded">twitter:image</code> meta tags for optimal display.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facebook" className="mt-6">
          <Card className="preview-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted w-full h-48 flex items-center justify-center">
                  {ogImage ? (
                    <img src={ogImage} alt="Facebook preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-muted-foreground">No image available</span>
                  )}
                </div>
                <div className="p-4 bg-card">
                  <div className="text-muted-foreground text-xs uppercase mb-1">{displayUrl}</div>
                  <div className="font-bold mb-1">{ogTitle || "No title found"}</div>
                  <div className="text-muted-foreground text-sm">
                    {ogDescription || "No description found"}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-start">
                  <Info className="text-muted-foreground h-4 w-4 mr-2 mt-0.5" />
                  <p>Facebook uses Open Graph protocol and requires <code className="text-xs bg-muted px-1 py-0.5 rounded">og:title</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">og:description</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">og:image</code> and <code className="text-xs bg-muted px-1 py-0.5 rounded">og:type</code> meta tags.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="linkedin" className="mt-6">
          <Card className="preview-card shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted w-full h-48 flex items-center justify-center">
                  {ogImage ? (
                    <img src={ogImage} alt="LinkedIn preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-muted-foreground">No image available</span>
                  )}
                </div>
                <div className="p-4 bg-card">
                  <div className="font-bold mb-1">{ogTitle || "No title found"}</div>
                  <div className="text-muted-foreground text-sm mb-2">
                    {ogDescription || "No description found"}
                  </div>
                  <div className="text-muted-foreground text-xs">{displayUrl}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-start">
                  <Info className="text-muted-foreground h-4 w-4 mr-2 mt-0.5" />
                  <p>LinkedIn primarily uses Open Graph tags, particularly <code className="text-xs bg-muted px-1 py-0.5 rounded">og:title</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">og:description</code> and <code className="text-xs bg-muted px-1 py-0.5 rounded">og:image</code> for rich previews.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function calculateScoreByLength(length: number, minOptimal: number, maxOptimal: number): number {
  if (length === 0) return 0;
  if (length >= minOptimal && length <= maxOptimal) return 100;
  
  if (length < minOptimal) {
    // Scale from 0 to 90% as we approach minOptimal
    return Math.floor((length / minOptimal) * 90);
  } else {
    // Scale from 90% down to 50% as we exceed maxOptimal
    const overage = length - maxOptimal;
    const maxOverage = 50; // After 50 chars over, we floor at 50%
    const reduction = Math.min(overage, maxOverage) / maxOverage * 40;
    return Math.max(50, Math.floor(90 - reduction));
  }
}

function getTitleLengthColor(length: number): string {
  if (length === 0) return "text-error";
  if (length >= 50 && length <= 60) return "text-secondary";
  if (length > 0 && length < 50) return "text-warning";
  if (length > 60 && length <= 80) return "text-warning";
  return "text-error";
}

function getDescriptionLengthColor(length: number): string {
  if (length === 0) return "text-error";
  if (length >= 120 && length <= 155) return "text-secondary";
  if (length > 0 && length < 120) return "text-warning";
  if (length > 155 && length <= 200) return "text-warning";
  return "text-error";
}

function getLengthStatus(length: number, minOptimal: number, maxOptimal: number): string {
  if (length === 0) return "Missing";
  if (length >= minOptimal && length <= maxOptimal) return "Optimal";
  if (length < minOptimal) return "Too Short";
  return "Too Long";
}
