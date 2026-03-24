import type { SeoAnalysisData, StructuredData, ContentQuality, Recommendation } from "@shared/schema";
import { SCORING_WEIGHTS_V2, SEO_LIMITS } from "@shared/constants";
import { fetchAndParse } from "./fetcher";
import { extractMetaTags, generateScores, generateRecommendations } from "./seoAnalyzer";
import { extractStructuredData, calculateStructuredDataScore } from "./structuredDataAnalyzer";
import { analyzeContentQuality, calculateContentQualityScore } from "./contentQualityAnalyzer";

/**
 * Main SEO analysis function that orchestrates all analyzers
 *
 * This is the primary entry point for SEO analysis, used by both
 * the Express server and Vercel serverless functions.
 *
 * Phase 1 features:
 * - Meta tag extraction (required, social, best practices)
 * - Basic scoring algorithm
 * - Recommendations
 *
 * Phase 2 features:
 * - Structured data (JSON-LD) detection and validation
 * - Content quality analysis (headings, images, word count)
 * - Extended meta tag extraction (OG locale, article tags, PWA)
 * - Enhanced scoring with new categories
 *
 * @param url - URL to analyze
 * @returns Complete SEO analysis data including tags, scores, and recommendations
 * @throws Error if URL cannot be fetched or parsed
 *
 * @example
 * const analysis = await analyzeSeo('https://example.com');
 * console.log(analysis.scores.overall); // 0-100
 */
export async function analyzeSeo(url: string): Promise<SeoAnalysisData> {
  // Fetch and parse the HTML
  const { $, html } = await fetchAndParse(url);

  // Phase 1: Extract meta tags from the page
  const metaTags = extractMetaTags($);

  // Phase 1: Calculate base scores
  const baseScores = generateScores(metaTags);

  // Phase 2: Extract and analyze structured data (JSON-LD)
  const structuredData = extractStructuredData($);
  const structuredDataScore = calculateStructuredDataScore(structuredData);

  // Phase 2: Analyze content quality
  const contentQuality = analyzeContentQuality($);
  const contentQualityScore = calculateContentQualityScore(contentQuality);

  // Phase 2: Calculate overall score with new weights
  const overall = Math.round(
    (baseScores.requiredTags * SCORING_WEIGHTS_V2.REQUIRED_TAGS) +
    (baseScores.socialTags * SCORING_WEIGHTS_V2.SOCIAL_TAGS) +
    (baseScores.bestPractices * SCORING_WEIGHTS_V2.BEST_PRACTICES) +
    (contentQualityScore * SCORING_WEIGHTS_V2.CONTENT_QUALITY) +
    (structuredDataScore * SCORING_WEIGHTS_V2.STRUCTURED_DATA)
  );

  const scores = {
    overall,
    requiredTags: baseScores.requiredTags,
    socialTags: baseScores.socialTags,
    bestPractices: baseScores.bestPractices,
    contentQuality: contentQualityScore,
    structuredData: structuredDataScore,
    createdAt: new Date().toISOString()
  };

  // Generate recommendations (including Phase 2 recommendations)
  const baseRecommendations = generateRecommendations(metaTags, url);
  const phase2Recommendations = generatePhase2Recommendations(structuredData, contentQuality, url);
  const recommendations = [...baseRecommendations, ...phase2Recommendations];

  // Extract raw HTML from head section
  const headHtml = $.html($('head'));

  return {
    url,
    metaTags,
    scores,
    createdAt: new Date().toISOString(),
    recommendations,
    rawHtml: headHtml,
    structuredData,
    contentQuality
  };
}

/**
 * Generates Phase 2 recommendations for structured data and content quality
 *
 * @param structuredData - Extracted structured data
 * @param contentQuality - Content quality metrics
 * @param url - URL being analyzed
 * @returns Array of Phase 2 recommendations
 */
function generatePhase2Recommendations(
  structuredData: StructuredData[],
  contentQuality: ContentQuality,
  url: string
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const domain = new URL(url).hostname;

  // Structured Data recommendations
  if (structuredData.length === 0) {
    recommendations.push({
      title: 'Add Structured Data (JSON-LD)',
      description: 'Structured data helps search engines understand your content better and can enable rich snippets in search results. Consider adding Schema.org markup.',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Website Name",
  "url": "${url}"
}
</script>`,
      type: 'warning'
    });
  } else {
    const invalidData = structuredData.filter(sd => !sd.isValid);
    if (invalidData.length > 0) {
      const errorMessages = invalidData
        .flatMap(sd => sd.errors || [])
        .slice(0, 3)
        .join('; ');
      recommendations.push({
        title: 'Fix Structured Data Errors',
        description: `Found ${invalidData.length} structured data block(s) with validation errors: ${errorMessages}. Fix these to ensure proper rich snippet display.`,
        type: 'warning'
      });
    } else {
      recommendations.push({
        title: 'Structured data is properly configured',
        description: `Found ${structuredData.length} valid structured data block(s): ${structuredData.map(sd => sd.type).join(', ')}. This helps search engines display rich results.`,
        type: 'success'
      });
    }
  }

  // H1 heading recommendations
  if (contentQuality.headingStructure.h1Count === 0) {
    recommendations.push({
      title: 'Add an H1 heading',
      description: 'Every page should have exactly one H1 heading that describes the main topic. H1 tags are important for SEO and accessibility.',
      code: `<h1>Your Main Page Title</h1>`,
      type: 'error'
    });
  } else if (contentQuality.headingStructure.hasMultipleH1) {
    recommendations.push({
      title: 'Use only one H1 heading',
      description: `Found ${contentQuality.headingStructure.h1Count} H1 headings. Having multiple H1 tags can confuse search engines about the main topic. Use H2-H6 for subheadings.`,
      type: 'warning'
    });
  } else if (!contentQuality.headingStructure.hierarchyValid) {
    recommendations.push({
      title: 'Fix heading hierarchy',
      description: 'Your heading structure skips levels (e.g., H1 to H3 without H2). Use a proper heading hierarchy for better SEO and accessibility.',
      type: 'warning'
    });
  } else {
    recommendations.push({
      title: 'Heading structure is well organized',
      description: 'Your page has a single H1 and follows proper heading hierarchy. This helps search engines and screen readers understand your content structure.',
      type: 'success'
    });
  }

  // Image alt text recommendations
  if (contentQuality.images.total > 0 && contentQuality.images.withoutAlt > 0) {
    const percentage = Math.round((contentQuality.images.withoutAlt / contentQuality.images.total) * 100);
    recommendations.push({
      title: `Add alt text to ${contentQuality.images.withoutAlt} image(s)`,
      description: `${percentage}% of images are missing alt text. Alt text helps search engines understand images and improves accessibility for screen readers.`,
      code: `<img src="image.jpg" alt="Descriptive text about the image">`,
      type: contentQuality.images.withoutAlt > 3 ? 'warning' : 'warning'
    });
  } else if (contentQuality.images.total > 0) {
    recommendations.push({
      title: 'All images have alt text',
      description: `All ${contentQuality.images.total} images on this page have alt text. Great job with accessibility and SEO!`,
      type: 'success'
    });
  }

  // Word count recommendations
  if (contentQuality.wordCount < SEO_LIMITS.WORD_COUNT.MIN) {
    recommendations.push({
      title: 'Add more content',
      description: `Your page has only ${contentQuality.wordCount} words. For better SEO, aim for at least ${SEO_LIMITS.WORD_COUNT.MIN} words of quality content.`,
      type: 'warning'
    });
  } else if (contentQuality.wordCount >= SEO_LIMITS.WORD_COUNT.EXCELLENT) {
    recommendations.push({
      title: 'Excellent content depth',
      description: `Your page has ${contentQuality.wordCount} words, which indicates comprehensive content. Search engines often favor in-depth content.`,
      type: 'success'
    });
  }

  return recommendations;
}
