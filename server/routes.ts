import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSeo } from "./utils/seoAnalyzer";
import { insertSeoAnalysisSchema } from "@shared/schema";
import { z } from "zod";
import { CACHE_CONFIG } from "@shared/constants";
import { logger } from "@shared/utils/logger";

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
      
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze the URL" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
