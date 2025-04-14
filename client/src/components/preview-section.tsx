import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Search, AlertTriangle, CheckCircle } from "lucide-react";
import { SiX, SiFacebook, SiLinkedin } from "react-icons/si";
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
  
  return (
    <section className="space-y-8">
      <h3 className="text-xl font-semibold">Platform Previews</h3>
      
      {/* Google Preview */}
      <Card className="preview-card hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Search className="text-primary mr-2 h-5 w-5" />
            <h4 className="font-semibold">Google Search Preview</h4>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="text-primary text-xl font-medium mb-1">
              {title || "No title found"}
            </div>
            <div className="text-green-700 text-sm mb-1">{url}</div>
            <div className="text-gray-700 text-sm">
              {description || "No description found"}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center mb-1">
              {title && title.length > 0 && title.length <= 60 ? (
                <CheckCircle className="text-secondary text-sm mr-1 h-4 w-4" />
              ) : (
                <AlertTriangle className="text-warning text-sm mr-1 h-4 w-4" />
              )}
              Title length: {title ? title.length : 0} characters (Optimal: 50-60)
            </div>
            <div className="flex items-center">
              {description && description.length > 0 && description.length <= 155 ? (
                <CheckCircle className="text-secondary text-sm mr-1 h-4 w-4" />
              ) : (
                <AlertTriangle className="text-warning text-sm mr-1 h-4 w-4" />
              )}
              Description length: {description ? description.length : 0} characters (Optimal: 120-155)
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* X/Twitter Preview */}
      <Card className="preview-card hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <SiX className="text-black mr-2 h-5 w-5" />
            <h4 className="font-semibold">X/Twitter Card Preview</h4>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
              {twitterImage ? (
                <img src={twitterImage} alt="X/Twitter card" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500">No image available</span>
              )}
            </div>
            <div className="p-4">
              <div className="text-gray-500 text-xs mb-1">{displayUrl}</div>
              <div className="font-bold mb-1">{twitterTitle || "No title found"}</div>
              <div className="text-gray-700 text-sm">
                {twitterDescription || "No description found"}
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center mb-1">
              {twitterCard ? (
                <CheckCircle className="text-secondary text-sm mr-1 h-4 w-4" />
              ) : (
                <AlertTriangle className="text-warning text-sm mr-1 h-4 w-4" />
              )}
              {twitterCard ? "X/Twitter card meta tag present" : "Missing twitter:card meta tag"}
            </div>
            <div className="flex items-center">
              {twitterImage ? (
                <CheckCircle className="text-secondary text-sm mr-1 h-4 w-4" />
              ) : (
                <AlertTriangle className="text-warning text-sm mr-1 h-4 w-4" />
              )}
              {twitterImage ? "X/Twitter image meta tag present" : "Missing twitter:image meta tag"}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Facebook Preview */}
      <Card className="preview-card hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <SiFacebook className="text-blue-600 mr-2 h-5 w-5" />
            <h4 className="font-semibold">Facebook Preview</h4>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
              {ogImage ? (
                <img src={ogImage} alt="Facebook preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500">No image available</span>
              )}
            </div>
            <div className="p-4 bg-white">
              <div className="text-gray-500 text-xs uppercase mb-1">{displayUrl}</div>
              <div className="font-bold text-gray-900 mb-1">{ogTitle || "No title found"}</div>
              <div className="text-gray-700 text-sm">
                {ogDescription || "No description found"}
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center mb-1">
              {getMetaTagValue(metaTags, "og:type") ? (
                <CheckCircle className="text-secondary text-sm mr-1 h-4 w-4" />
              ) : (
                <AlertTriangle className="text-warning text-sm mr-1 h-4 w-4" />
              )}
              {getMetaTagValue(metaTags, "og:type") ? "og:type meta tag present" : "Missing og:type meta tag"}
            </div>
            <div className="flex items-center">
              {ogImage ? (
                <CheckCircle className="text-secondary text-sm mr-1 h-4 w-4" />
              ) : (
                <AlertTriangle className="text-warning text-sm mr-1 h-4 w-4" />
              )}
              {ogImage ? "og:image meta tag present" : "Missing og:image meta tag"}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* LinkedIn Preview */}
      <Card className="preview-card hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <SiLinkedin className="text-blue-700 mr-2 h-5 w-5" />
            <h4 className="font-semibold">LinkedIn Preview</h4>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-300 w-full h-48 flex items-center justify-center">
              {ogImage ? (
                <img src={ogImage} alt="LinkedIn preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500">No image available</span>
              )}
            </div>
            <div className="p-4 bg-white">
              <div className="font-bold text-gray-900 mb-1">{ogTitle || "No title found"}</div>
              <div className="text-gray-700 text-sm mb-2">
                {ogDescription || "No description found"}
              </div>
              <div className="text-gray-500 text-xs">{displayUrl}</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Info className="text-gray-500 text-sm mr-1 h-4 w-4" />
              LinkedIn uses Open Graph tags - 
              {ogImage ? " all required tags present" : " consider adding missing og:image"}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
