import { storage } from '../server/db.js';
import { analyzeSeo } from '../server/utils/seoAnalyzer.js';
import { z } from "zod";

const urlSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { url } = urlSchema.parse({ url: req.query.url });
    
    // Note: In-memory storage won't persist between function invocations on Vercel
    // Consider using a database like Neon, Supabase, or Vercel KV instead
    const cachedAnalysis = await storage.getAnalysisByUrl(url);
    
    if (cachedAnalysis && cachedAnalysis.createdAt) {
      const cacheAge = Date.now() - new Date(cachedAnalysis.createdAt).getTime();
      if (cacheAge < 3600000) { // 1 hour in milliseconds
        return res.status(200).json({
          url: cachedAnalysis.url,
          metaTags: cachedAnalysis.metaTags,
          scores: cachedAnalysis.scores,
          recommendations: cachedAnalysis.recommendations,
        });
      }
    }
    
    const analysis = await analyzeSeo(url);
    
    // Store analysis (note: this won't persist between function invocations)
    storage.storeAnalysis(url, {
      url,
      metaTags: analysis.metaTags,
      scores: analysis.scores,
      recommendations: analysis.recommendations,
      createdAt: new Date().toISOString(),
    });
    
    return res.status(200).json(analysis);
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
}
