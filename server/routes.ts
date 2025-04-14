import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSeo } from "./utils/seoAnalyzer";
import { insertSeoAnalysisSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const urlSchema = z.object({
    url: z.string().url("Invalid URL format"),
  });

  app.get("/api/analyze", async (req, res) => {
    try {
      const { url } = urlSchema.parse({ url: req.query.url });
      
      // First check if we have a recent analysis for this URL
      const cachedAnalysis = await storage.getSeoAnalysisByUrl(url);
      
      if (cachedAnalysis) {
        // Return the cached analysis if it exists and is recent (less than 1 hour old)
        const cacheAge = Date.now() - cachedAnalysis.createdAt.getTime();
        if (cacheAge < 3600000) { // 1 hour in milliseconds
          return res.json({
            url: cachedAnalysis.url,
            metaTags: cachedAnalysis.metaTags,
            scores: cachedAnalysis.scores,
            recommendations: cachedAnalysis.recommendations,
          });
        }
      }
      
      // If no recent cache, perform a new analysis
      const analysis = await analyzeSeo(url);
      
      // Store the analysis results
      const seoAnalysis = await storage.createSeoAnalysis({
        url,
        metaTags: analysis.metaTags,
        scores: analysis.scores,
        recommendations: analysis.recommendations,
      });
      
      return res.json(analysis);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      
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
