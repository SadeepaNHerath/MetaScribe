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
      
      const cachedAnalysis = await storage.getSeoAnalysisByUrl(url);
      
      if (cachedAnalysis && cachedAnalysis.createdAt) {
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
      
      const analysis = await analyzeSeo(url);
      
      const seoAnalysis = await storage.createSeoAnalysis({
        url,
        metaTags: analysis.metaTags,
        scores: analysis.scores,
        recommendations: analysis.recommendations,
        createdAt: new Date(),
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
