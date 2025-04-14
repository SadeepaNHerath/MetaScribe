import axios from "axios";
import * as cheerio from "cheerio";
import type { MetaTag, Recommendation, SeoAnalysisData } from "@shared/schema";

export async function analyzeSeo(url: string): Promise<SeoAnalysisData> {
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
      createdAt: new Date().toISOString(),
      recommendations,
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

function extractMetaTags($: cheerio.CheerioAPI): MetaTag[] {
  const metaTags: MetaTag[] = [];
  
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
  
  // Extract other useful meta tags
  const charset = $('meta[charset]').attr('charset');
  if (charset) {
    metaTags.push({
      name: 'charset',
      content: charset,
      status: 'present'
    });
  }
  
  const language = $('html').attr('lang');
  if (language) {
    metaTags.push({
      name: 'language',
      content: language,
      status: 'present'
    });
  }
  
  const keywords = $('meta[name="keywords"]').attr('content');
  if (keywords) {
    metaTags.push({
      name: 'keywords',
      content: keywords,
      status: 'present'
    });
  }
  
  return metaTags;
}

function generateScores(metaTags: MetaTag[]): {
  overall: number;
  requiredTags: number;
  socialTags: number;
  bestPractices: number;
} {
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
    bestPractices: bestPracticesScore
  };
}

function generateRecommendations(metaTags: MetaTag[], url: string): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const domain = new URL(url).hostname;
  
  // Title tag recommendations
  const titleTag = metaTags.find(tag => tag.name === 'title');
  if (!titleTag || !titleTag.content) {
    recommendations.push({
      title: 'Add a title tag',
      description: 'The title tag is one of the most important elements for SEO. It appears in search results, browser tabs, and when shared on social media.',
      code: `<title>Your Page Title | ${domain}</title>`,
      type: 'error'
    });
  } else if (titleTag.content.length < 30) {
    recommendations.push({
      title: 'Optimize your title tag length',
      description: 'Your title is too short. A good title tag should be 50-60 characters for optimal display in search results.',
      code: `<title>${titleTag.content} | Additional relevant keywords</title>`,
      type: 'warning'
    });
  } else if (titleTag.content.length > 60) {
    recommendations.push({
      title: 'Shorten your title tag',
      description: 'Your title is too long and might be truncated in search results. Keep it under 60 characters.',
      type: 'warning'
    });
  } else {
    recommendations.push({
      title: 'Your title tag length is good',
      description: `Your meta title is ${titleTag.content.length} characters which is optimal. Title tags should be between 50-60 characters for best display in search results.`,
      type: 'success'
    });
  }
  
  // Description tag recommendations
  const descriptionTag = metaTags.find(tag => tag.name === 'description');
  if (!descriptionTag || !descriptionTag.content) {
    recommendations.push({
      title: 'Add a meta description',
      description: 'Meta descriptions provide a brief summary of the page content and appear in search results. They should be compelling and include relevant keywords.',
      code: `<meta name="description" content="A compelling description of your page that will entice users to click through from search results.">`,
      type: 'error'
    });
  } else if (descriptionTag.content.length < 70) {
    recommendations.push({
      title: 'Expand your meta description',
      description: 'Your description is too short. Aim for 120-155 characters to maximize visibility in search results.',
      type: 'warning'
    });
  } else if (descriptionTag.content.length > 155) {
    recommendations.push({
      title: 'Shorten your meta description',
      description: 'Your description is too long and might be truncated in search results. Keep it under 155 characters.',
      type: 'warning'
    });
  } else {
    recommendations.push({
      title: 'Your meta description length is good',
      description: `Your meta description is ${descriptionTag.content.length} characters which is optimal. Descriptions should be between 120-155 characters.`,
      type: 'success'
    });
  }
  
  // Open Graph recommendations
  const ogTags = metaTags.filter(tag => tag.name.startsWith('og:') && tag.status === 'present');
  if (ogTags.length < 5) {
    recommendations.push({
      title: 'Add Open Graph Meta Tags',
      description: 'Open Graph meta tags improve how your content appears when shared on social media. Add og:title, og:description, og:image, og:url, and og:type tags.',
      code: `<meta property="og:title" content="${titleTag?.content || `Title for ${domain}`}">\n<meta property="og:description" content="${descriptionTag?.content || 'Description of your page'}">\n<meta property="og:image" content="https://${domain}/image.jpg">\n<meta property="og:url" content="${url}">\n<meta property="og:type" content="website">`,
      type: 'warning'
    });
  }
  
  // Twitter Card recommendations
  const twitterTags = metaTags.filter(tag => tag.name.startsWith('twitter:') && tag.status === 'present');
  if (twitterTags.length < 4) {
    recommendations.push({
      title: 'Add Twitter Card Meta Tags',
      description: 'Twitter Card meta tags control how your content appears when shared on Twitter. Add twitter:card, twitter:title, twitter:description, and twitter:image tags.',
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
  
  // Robots meta tag recommendation
  const robotsTag = metaTags.find(tag => tag.name === 'robots');
  if (!robotsTag || !robotsTag.content) {
    recommendations.push({
      title: 'Add a robots meta tag',
      description: 'The robots meta tag tells search engines how to crawl and index your page. Without it, search engines will use their default behavior.',
      code: `<meta name="robots" content="index, follow">`,
      type: 'warning'
    });
  }
  
  // Language attribute recommendation
  const languageTag = metaTags.find(tag => tag.name === 'language');
  if (!languageTag || !languageTag.content) {
    recommendations.push({
      title: 'Add a language attribute to the HTML tag',
      description: 'Specifying the language helps search engines and screen readers determine the language of your content.',
      code: `<html lang="en">`,
      type: 'warning'
    });
  }
  
  return recommendations;
}
