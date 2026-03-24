import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSeo } from "./utils/seoAnalyzer";
import { insertSeoAnalysisSchema } from "@shared/schema";
import { z } from "zod";
import { CACHE_CONFIG } from "@shared/constants";
import { logger } from "@shared/utils/logger";

function isUpstreamFetchError(message: string): boolean {
  return (
    message.includes("Access forbidden (403)") ||
    message.includes("Page not found (404)") ||
    message.includes("Website not found") ||
    message.includes("Connection refused") ||
    message.includes("Server error (") ||
    message.includes("Received ") ||
    message.includes("Request timeout") ||
    message.includes("ECONNABORTED") ||
    message.includes("ETIMEDOUT")
  );
}

function buildUnavailableAnalysis(url: string, message: string) {
  return {
    url,
    metaTags: [],
    scores: {
      overall: 0,
      requiredTags: 0,
      socialTags: 0,
      bestPractices: 0,
      contentQuality: 0,
      structuredData: 0,
      createdAt: new Date().toISOString(),
    },
    recommendations: [
      {
        title: "Website blocked automated analysis",
        description: `${message} This usually means the site is protected by bot/challenge security. Try another URL or analyze your own domain where crawling is allowed.`,
        type: "warning",
      },
    ],
    createdAt: new Date().toISOString(),
    rawHtml: "",
    structuredData: [],
    contentQuality: {
      headingStructure: {
        h1Count: 0,
        hasMultipleH1: false,
        hierarchyValid: true,
        outline: [],
      },
      images: {
        total: 0,
        withAlt: 0,
        withoutAlt: 0,
        missingAltImages: [],
      },
      wordCount: 0,
    },
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const urlSchema = z.object({
    url: z.string().url("Invalid URL format"),
  });

  app.get("/api/analyze", async (req, res) => {
    try {
      const { url } = urlSchema.parse({ url: req.query.url });
      
      const cachedAnalysis = await storage.getSeoAnalysisByUrl(url);

      if (cachedAnalysis && cachedAnalysis.createdAt) {
        // createdAt is an ISO string, parse it to get timestamp
        const createdAtTime = new Date(cachedAnalysis.createdAt).getTime();
        const cacheAge = Date.now() - createdAtTime;
        if (cacheAge < CACHE_CONFIG.TTL_MS) {
          logger.info('Returning cached analysis', { url, cacheAge });
          return res.json({
            url: cachedAnalysis.url,
            metaTags: cachedAnalysis.metaTags,
            scores: cachedAnalysis.scores,
            recommendations: cachedAnalysis.recommendations,
          });
        }
      }

      logger.info('Performing fresh analysis', { url });
      const analysis = await analyzeSeo(url);

      // Store in cache
      await storage.createSeoAnalysis(analysis);
      
      return res.json(analysis);
    } catch (error) {
      logger.error("Error analyzing URL", error as Error, { url: req.query.url as string });
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid URL format. Please provide a valid URL." 
        });
      }

      if (error instanceof Error) {
        const message = error.message;

        if (isUpstreamFetchError(message)) {
          const fallbackUrl = typeof req.query.url === "string" ? req.query.url : "";
          return res.status(200).json(buildUnavailableAnalysis(fallbackUrl, message));
        }

        return res.status(400).json({ message });
      }
      
      return res.status(500).json({ 
        message: "Failed to analyze the URL" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
