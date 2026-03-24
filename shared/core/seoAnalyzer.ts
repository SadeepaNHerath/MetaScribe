import type * as cheerio from "cheerio";
import type { MetaTag, Recommendation } from "@shared/schema";
import {
  SEO_LIMITS,
  SCORING_WEIGHTS,
  SCORE_POINTS,
  REQUIRED_TAGS,
  SOCIAL_TAGS,
} from "@shared/constants";

/**
 * Extracts meta tags from parsed HTML
 *
 * @param $ - Cheerio instance with loaded HTML
 * @returns Array of detected meta tags with their status
 *
 * @example
 * const $ = cheerio.load(html);
 * const tags = extractMetaTags($);
 */
export function extractMetaTags($: cheerio.CheerioAPI): MetaTag[] {
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

  // Extract robots
  const robots = $('meta[name="robots"]').attr('content');
  metaTags.push({
    name: 'robots',
    content: robots || '',
    status: robots ? 'present' : 'warning'
  });

  // Extract canonical
  const canonical = $('link[rel="canonical"]').attr('href');
  metaTags.push({
    name: 'canonical',
    content: canonical || '',
    status: canonical ? 'present' : 'warning'
  });

  // Extract Open Graph tags
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

  // Extended Open Graph tags (Phase 2)
  const ogLocale = $('meta[property="og:locale"]').attr('content');
  if (ogLocale) {
    metaTags.push({
      name: 'og:locale',
      content: ogLocale,
      status: 'present'
    });
  }

  const ogSiteName = $('meta[property="og:site_name"]').attr('content');
  if (ogSiteName) {
    metaTags.push({
      name: 'og:site_name',
      content: ogSiteName,
      status: 'present'
    });
  }

  // Article-specific Open Graph tags
  const articlePublished = $('meta[property="article:published_time"]').attr('content');
  if (articlePublished) {
    metaTags.push({
      name: 'article:published_time',
      content: articlePublished,
      status: 'present'
    });
  }

  const articleModified = $('meta[property="article:modified_time"]').attr('content');
  if (articleModified) {
    metaTags.push({
      name: 'article:modified_time',
      content: articleModified,
      status: 'present'
    });
  }

  const articleAuthor = $('meta[property="article:author"]').attr('content');
  if (articleAuthor) {
    metaTags.push({
      name: 'article:author',
      content: articleAuthor,
      status: 'present'
    });
  }

  const articleSection = $('meta[property="article:section"]').attr('content');
  if (articleSection) {
    metaTags.push({
      name: 'article:section',
      content: articleSection,
      status: 'present'
    });
  }

  const articleTag = $('meta[property="article:tag"]').attr('content');
  if (articleTag) {
    metaTags.push({
      name: 'article:tag',
      content: articleTag,
      status: 'present'
    });
  }

  // Extended Twitter Card tags
  const twitterSite = $('meta[name="twitter:site"]').attr('content');
  if (twitterSite) {
    metaTags.push({
      name: 'twitter:site',
      content: twitterSite,
      status: 'present'
    });
  }

  const twitterCreator = $('meta[name="twitter:creator"]').attr('content');
  if (twitterCreator) {
    metaTags.push({
      name: 'twitter:creator',
      content: twitterCreator,
      status: 'present'
    });
  }

  // PWA and mobile tags
  const themeColor = $('meta[name="theme-color"]').attr('content');
  if (themeColor) {
    metaTags.push({
      name: 'theme-color',
      content: themeColor,
      status: 'present'
    });
  }

  const appleWebAppCapable = $('meta[name="apple-mobile-web-app-capable"]').attr('content');
  if (appleWebAppCapable) {
    metaTags.push({
      name: 'apple-mobile-web-app-capable',
      content: appleWebAppCapable,
      status: 'present'
    });
  }

  const appleWebAppTitle = $('meta[name="apple-mobile-web-app-title"]').attr('content');
  if (appleWebAppTitle) {
    metaTags.push({
      name: 'apple-mobile-web-app-title',
      content: appleWebAppTitle,
      status: 'present'
    });
  }

  // Additional meta tags
  const author = $('meta[name="author"]').attr('content');
  if (author) {
    metaTags.push({
      name: 'author',
      content: author,
      status: 'present'
    });
  }

  // Detect manifest file
  const manifestLink = $('link[rel="manifest"]').attr('href');
  if (manifestLink) {
    metaTags.push({
      name: 'manifest',
      content: manifestLink,
      status: 'present'
    });
  }

  // Detect favicons
  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').first().attr('href');
  if (favicon) {
    metaTags.push({
      name: 'favicon',
      content: favicon,
      status: 'present'
    });
  }

  return metaTags;
}

/**
 * Calculates SEO scores based on meta tag presence and quality
 *
 * Scoring breakdown:
 * - Required tags (40%): title, description, viewport
 * - Social tags (30%): Open Graph and Twitter Card tags
 * - Best practices (30%): robots, canonical, language, content length
 *
 * @param metaTags - Array of extracted meta tags
 * @returns Scores object with overall and category breakdowns
 */
export function generateScores(metaTags: MetaTag[]): {
  overall: number;
  requiredTags: number;
  socialTags: number;
  bestPractices: number;
} {
  // Calculate required tags score
  const requiredCount = REQUIRED_TAGS.filter(name =>
    metaTags.find(tag => tag.name === name && tag.status === 'present')
  ).length;
  const requiredScore = Math.round((requiredCount / REQUIRED_TAGS.length) * 100);

  // Calculate social tags score
  const socialCount = SOCIAL_TAGS.filter(name =>
    metaTags.find(tag => tag.name === name && tag.status === 'present')
  ).length;
  const socialScore = Math.round((socialCount / SOCIAL_TAGS.length) * 100);

  // Calculate best practices score
  let bestPracticesScore = 0;

  const robotsTag = metaTags.find(tag => tag.name === 'robots');
  if (robotsTag && robotsTag.status === 'present') {
    bestPracticesScore += SCORE_POINTS.ROBOTS_TAG;
  }

  const canonicalTag = metaTags.find(tag => tag.name === 'canonical');
  if (canonicalTag && canonicalTag.status === 'present') {
    bestPracticesScore += SCORE_POINTS.CANONICAL_TAG;
  }

  const languageTag = metaTags.find(tag => tag.name === 'language');
  if (languageTag && languageTag.status === 'present') {
    bestPracticesScore += SCORE_POINTS.LANGUAGE_TAG;
  }

  const titleTag = metaTags.find(tag => tag.name === 'title');
  if (titleTag && titleTag.content) {
    const titleLength = titleTag.content.length;
    if (titleLength >= SEO_LIMITS.TITLE.OPTIMAL_MIN && titleLength <= SEO_LIMITS.TITLE.OPTIMAL_MAX) {
      bestPracticesScore += SCORE_POINTS.OPTIMAL_TITLE;
    } else if (titleLength > 0) {
      bestPracticesScore += SCORE_POINTS.PARTIAL_TITLE;
    }
  }

  const descriptionTag = metaTags.find(tag => tag.name === 'description');
  if (descriptionTag && descriptionTag.content) {
    const descLength = descriptionTag.content.length;
    if (descLength >= SEO_LIMITS.DESCRIPTION.OPTIMAL_MIN && descLength <= SEO_LIMITS.DESCRIPTION.OPTIMAL_MAX) {
      bestPracticesScore += SCORE_POINTS.OPTIMAL_DESCRIPTION;
    } else if (descLength > 0) {
      bestPracticesScore += SCORE_POINTS.PARTIAL_DESCRIPTION;
    }
  }

  // Calculate overall score
  const overall = Math.round(
    (requiredScore * SCORING_WEIGHTS.REQUIRED_TAGS) +
    (socialScore * SCORING_WEIGHTS.SOCIAL_TAGS) +
    (bestPracticesScore * SCORING_WEIGHTS.BEST_PRACTICES)
  );

  return {
    overall,
    requiredTags: requiredScore,
    socialTags: socialScore,
    bestPractices: bestPracticesScore
  };
}

/**
 * Generates actionable SEO recommendations based on meta tag analysis
 *
 * @param metaTags - Array of extracted meta tags
 * @param url - Original URL being analyzed
 * @returns Array of recommendations with type (error/warning/success)
 */
export function generateRecommendations(metaTags: MetaTag[], url: string): Recommendation[] {
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
  } else if (titleTag.content.length < SEO_LIMITS.TITLE.OPTIMAL_MIN) {
    recommendations.push({
      title: 'Optimize your title tag length',
      description: `Your title is too short (${titleTag.content.length} characters). A good title tag should be ${SEO_LIMITS.TITLE.OPTIMAL_MIN}-${SEO_LIMITS.TITLE.OPTIMAL_MAX} characters for optimal display in search results.`,
      code: `<title>${titleTag.content} | Additional relevant keywords</title>`,
      type: 'warning'
    });
  } else if (titleTag.content.length > SEO_LIMITS.TITLE.OPTIMAL_MAX) {
    recommendations.push({
      title: 'Shorten your title tag',
      description: `Your title is too long (${titleTag.content.length} characters) and might be truncated in search results. Keep it under ${SEO_LIMITS.TITLE.OPTIMAL_MAX} characters.`,
      type: 'warning'
    });
  } else {
    recommendations.push({
      title: 'Your title tag length is optimal',
      description: `Your meta title is ${titleTag.content.length} characters, which is perfect. Title tags should be between ${SEO_LIMITS.TITLE.OPTIMAL_MIN}-${SEO_LIMITS.TITLE.OPTIMAL_MAX} characters for best display in search results.`,
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
  } else if (descriptionTag.content.length < SEO_LIMITS.DESCRIPTION.MIN) {
    recommendations.push({
      title: 'Expand your meta description',
      description: `Your description is too short (${descriptionTag.content.length} characters). Aim for ${SEO_LIMITS.DESCRIPTION.OPTIMAL_MIN}-${SEO_LIMITS.DESCRIPTION.OPTIMAL_MAX} characters to maximize visibility in search results.`,
      type: 'warning'
    });
  } else if (descriptionTag.content.length > SEO_LIMITS.DESCRIPTION.OPTIMAL_MAX) {
    recommendations.push({
      title: 'Shorten your meta description',
      description: `Your description is too long (${descriptionTag.content.length} characters) and might be truncated in search results. Keep it under ${SEO_LIMITS.DESCRIPTION.OPTIMAL_MAX} characters.`,
      type: 'warning'
    });
  } else {
    recommendations.push({
      title: 'Your meta description length is optimal',
      description: `Your meta description is ${descriptionTag.content.length} characters, which is perfect. Descriptions should be between ${SEO_LIMITS.DESCRIPTION.OPTIMAL_MIN}-${SEO_LIMITS.DESCRIPTION.OPTIMAL_MAX} characters.`,
      type: 'success'
    });
  }

  // Open Graph recommendations
  const ogTags = metaTags.filter(tag => tag.name.startsWith('og:') && tag.status === 'present');
  if (ogTags.length < 5) {
    recommendations.push({
      title: 'Add Open Graph Meta Tags',
      description: 'Open Graph meta tags improve how your content appears when shared on social media platforms like Facebook, LinkedIn, and others. Add og:title, og:description, og:image, og:url, and og:type tags.',
      code: `<meta property="og:title" content="${titleTag?.content || `Title for ${domain}`}">
<meta property="og:description" content="${descriptionTag?.content || 'Description of your page'}">
<meta property="og:image" content="https://${domain}/image.jpg">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">`,
      type: 'warning'
    });
  }

  // Twitter Card recommendations
  const twitterTags = metaTags.filter(tag => tag.name.startsWith('twitter:') && tag.status === 'present');
  if (twitterTags.length < 4) {
    recommendations.push({
      title: 'Add Twitter Card Meta Tags',
      description: 'Twitter Card meta tags control how your content appears when shared on Twitter. Add twitter:card, twitter:title, twitter:description, and twitter:image tags.',
      code: `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${titleTag?.content || `Title for ${domain}`}">
<meta name="twitter:description" content="${descriptionTag?.content || 'Description of your page'}">
<meta name="twitter:image" content="https://${domain}/image.jpg">`,
      type: 'warning'
    });
  }

  // Canonical tag recommendation
  const canonicalTag = metaTags.find(tag => tag.name === 'canonical');
  if (!canonicalTag || !canonicalTag.content) {
    recommendations.push({
      title: 'Add a canonical URL',
      description: 'A canonical URL helps prevent duplicate content issues by specifying the preferred version of a page. This is especially important if your content is accessible through multiple URLs.',
      code: `<link rel="canonical" href="${url}">`,
      type: 'warning'
    });
  }

  // Robots meta tag recommendation
  const robotsTag = metaTags.find(tag => tag.name === 'robots');
  if (!robotsTag || !robotsTag.content) {
    recommendations.push({
      title: 'Add a robots meta tag',
      description: 'The robots meta tag tells search engines how to crawl and index your page. Without it, search engines will use their default behavior. Use "index, follow" for normal pages.',
      code: `<meta name="robots" content="index, follow">`,
      type: 'warning'
    });
  }

  // Language attribute recommendation
  const languageTag = metaTags.find(tag => tag.name === 'language');
  if (!languageTag || !languageTag.content) {
    recommendations.push({
      title: 'Add a language attribute to the HTML tag',
      description: 'Specifying the language helps search engines and screen readers determine the language of your content, improving accessibility and international SEO.',
      code: `<html lang="en">`,
      type: 'warning'
    });
  }

  return recommendations;
}
