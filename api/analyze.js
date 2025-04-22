import axios from "axios";
import * as cheerio from "cheerio";
import { z } from "zod";

// Since we can't import TypeScript files directly, we'll redefine the minimal types we need
const urlSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

// Simple in-memory storage for the serverless function
// Note: This won't persist between function invocations
const memoryStorage = {
  analyses: new Map(),
  
  storeAnalysis(url, data) {
    this.analyses.set(url, data);
  },
  
  getAnalysisByUrl(url) {
    return this.analyses.get(url) || null;
  }
};

// Copy of the relevant core analyzer functions
async function analyzeSeo(url) {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'SEO-Tag-Analyzer/1.0'
      },
      timeout: 10000
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    const metaTags = extractMetaTags($);
    
    const scores = {
      ...generateScores(metaTags),
      createdAt: new Date().toISOString()
    };
    
    const recommendations = generateRecommendations(metaTags, url);
    
    const headHtml = $.html($('head'));
    
    return {
      url,
      metaTags,
      scores,
      recommendations,
      createdAt: new Date().toISOString(),
      rawHtml: headHtml
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error(`Could not connect to the website. Please check if the URL is correct.`);
      }
      if (error.response) {
        throw new Error(`Received ${error.response.status} status from website. ${error.response.statusText}`);
      }
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
    throw error;
  }
}

// Other analysis functions - rewritten from the TypeScript version
function extractMetaTags($) {
  const metaTags = [];
  
  // Extract title
  const title = $('title').text();
  metaTags.push({
    name: 'title',
    content: title,
    status: title ? 'present' : 'missing'
  });
  
  // Extract meta description
  const description = $('meta[name="description"]').attr('content');
  metaTags.push({
    name: 'description',
    content: description || '',
    status: description ? 'present' : 'missing'
  });
  
  // Extract viewport
  const viewport = $('meta[name="viewport"]').attr('content');
  metaTags.push({
    name: 'viewport',
    content: viewport || '',
    status: viewport ? 'present' : 'missing'
  });
  
  // Extract other important tags
  const robots = $('meta[name="robots"]').attr('content');
  metaTags.push({
    name: 'robots',
    content: robots || '',
    status: robots ? 'present' : 'warning'
  });
  
  const canonical = $('link[rel="canonical"]').attr('href');
  metaTags.push({
    name: 'canonical',
    content: canonical || '',
    status: canonical ? 'present' : 'warning'
  });
  
  // Add Open Graph tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  metaTags.push({
    name: 'og:title',
    content: ogTitle || '',
    status: ogTitle ? 'present' : 'warning'
  });
  
  const ogDescription = $('meta[property="og:description"]').attr('content');
  metaTags.push({
    name: 'og:description',
    content: ogDescription || '',
    status: ogDescription ? 'present' : 'warning'
  });
  
  const ogImage = $('meta[property="og:image"]').attr('content');
  metaTags.push({
    name: 'og:image',
    content: ogImage || '',
    status: ogImage ? 'present' : 'warning'
  });
  
  // Extract Twitter Card tags
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  metaTags.push({
    name: 'twitter:card',
    content: twitterCard || '',
    status: twitterCard ? 'present' : 'warning'
  });
  
  const twitterTitle = $('meta[name="twitter:title"]').attr('content');
  metaTags.push({
    name: 'twitter:title',
    content: twitterTitle || '',
    status: twitterTitle ? 'present' : 'warning'
  });
  
  const twitterDescription = $('meta[name="twitter:description"]').attr('content');
  metaTags.push({
    name: 'twitter:description',
    content: twitterDescription || '',
    status: twitterDescription ? 'present' : 'warning'
  });
  
  const twitterImage = $('meta[name="twitter:image"]').attr('content');
  metaTags.push({
    name: 'twitter:image',
    content: twitterImage || '',
    status: twitterImage ? 'present' : 'warning'
  });
  
  // Additional OG tags
  const ogUrl = $('meta[property="og:url"]').attr('content');
  metaTags.push({
    name: 'og:url',
    content: ogUrl || '',
    status: ogUrl ? 'present' : 'warning'
  });
  
  const ogType = $('meta[property="og:type"]').attr('content');
  metaTags.push({
    name: 'og:type',
    content: ogType || '',
    status: ogType ? 'present' : 'warning'
  });
  
  // Language tag
  const language = $('html').attr('lang');
  if (language) {
    metaTags.push({
      name: 'language',
      content: language,
      status: 'present'
    });
  }
  
  return metaTags;
}

function generateScores(metaTags) {
  const requiredTags = ['title', 'description', 'viewport'];
  const requiredCount = requiredTags.filter(name => 
    metaTags.find(tag => tag.name === name && tag.status === 'present')
  ).length;
  const requiredScore = Math.round((requiredCount / requiredTags.length) * 100);
  
  const socialTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  const socialCount = socialTags.filter(name => 
    metaTags.find(tag => tag.name === name && tag.status === 'present')
  ).length;
  const socialScore = Math.round((socialCount / socialTags.length) * 100);
  
  let bestPracticesScore = 0;
  
  const robotsTag = metaTags.find(tag => tag.name === 'robots');
  if (robotsTag && robotsTag.status === 'present') bestPracticesScore += 20;
  
  const canonicalTag = metaTags.find(tag => tag.name === 'canonical');
  if (canonicalTag && canonicalTag.status === 'present') bestPracticesScore += 20;
  
  const languageTag = metaTags.find(tag => tag.name === 'language');
  if (languageTag && languageTag.status === 'present') bestPracticesScore += 20;
  
  const titleTag = metaTags.find(tag => tag.name === 'title');
  if (titleTag && titleTag.content) {
    const titleLength = titleTag.content.length;
    if (titleLength >= 10 && titleLength <= 60) bestPracticesScore += 20;
    else if (titleLength > 0) bestPracticesScore += 10;
  }
  
  const descriptionTag = metaTags.find(tag => tag.name === 'description');
  if (descriptionTag && descriptionTag.content) {
    const descLength = descriptionTag.content.length;
    if (descLength >= 70 && descLength <= 155) bestPracticesScore += 20;
    else if (descLength > 0) bestPracticesScore += 10;
  }
  
  const overall = Math.round(
    (requiredScore * 0.4) + (socialScore * 0.3) + (bestPracticesScore * 0.3)
  );
  
  return {
    overall,
    requiredTags: requiredScore,
    socialTags: socialScore,
    bestPractices: bestPracticesScore,
    createdAt: new Date().toISOString()
  };
}

function generateRecommendations(metaTags, url) {
  const recommendations = [];
  const domain = new URL(url).hostname;
  
  // Title recommendations
  const titleTag = metaTags.find(tag => tag.name === 'title');
  if (!titleTag || !titleTag.content) {
    recommendations.push({
      title: 'Add a page title',
      description: 'Every page should have a unique, descriptive title tag.',
      code: `<title>Your Page Title</title>`,
      type: 'error'
    });
  }
  
  // Description recommendations
  const descriptionTag = metaTags.find(tag => tag.name === 'description');
  if (!descriptionTag || !descriptionTag.content) {
    recommendations.push({
      title: 'Add a meta description',
      description: 'A meta description provides a summary of the page content.',
      code: `<meta name="description" content="A brief description of your page content.">`,
      type: 'error'
    });
  }
  
  // Open Graph recommendations
  const ogTags = ['og:title', 'og:description', 'og:image'].map(tag => 
    metaTags.find(t => t.name === tag)
  );
  
  if (ogTags.some(tag => !tag || !tag.content)) {
    recommendations.push({
      title: 'Add Open Graph meta tags',
      description: 'Open Graph tags help control how your content appears when shared on social media.',
      code: `<meta property="og:title" content="${titleTag?.content || `Title for ${domain}`}">\n<meta property="og:description" content="${descriptionTag?.content || 'Description of your page'}">\n<meta property="og:image" content="https://${domain}/image.jpg">`,
      type: 'warning'
    });
  }
  
  // Twitter card recommendations
  const twitterCard = metaTags.find(tag => tag.name === 'twitter:card');
  if (!twitterCard || !twitterCard.content) {
    recommendations.push({
      title: 'Add Twitter Card meta tags',
      description: 'Twitter Cards help control how your content appears when shared on Twitter.',
      code: `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${titleTag?.content || `Title for ${domain}`}">\n<meta name="twitter:description" content="${descriptionTag?.content || 'Description of your page'}">\n<meta name="twitter:image" content="https://${domain}/image.jpg">`,
      type: 'warning'
    });
  }
  
  // Canonical tag recommendation
  const canonicalTag = metaTags.find(tag => tag.name === 'canonical');
  if (!canonicalTag || !canonicalTag.content) {
    recommendations.push({
      title: 'Add a canonical URL',
      description: 'A canonical URL helps prevent duplicate content issues by specifying the preferred version of a page.',
      code: `<link rel="canonical" href="${url}">`,
      type: 'warning'
    });
  }
  
  return recommendations;
}

// The actual serverless function handler
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
    
    // In-memory storage won't persist between function invocations on Vercel
    const cachedAnalysis = memoryStorage.getAnalysisByUrl(url);
    
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
    memoryStorage.storeAnalysis(url, analysis);
    
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
