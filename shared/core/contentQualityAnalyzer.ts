import * as cheerio from "cheerio";
import { CONTENT_QUALITY_POINTS, SEO_LIMITS } from "@shared/constants";

/**
 * Content quality metrics for a webpage
 */
export interface ContentQuality {
  /** Analysis of heading structure (H1-H6) */
  headingStructure: {
    /** Number of H1 elements found */
    h1Count: number;
    /** Whether multiple H1 elements exist (SEO issue) */
    hasMultipleH1: boolean;
    /** Whether heading hierarchy is valid (no skipped levels) */
    hierarchyValid: boolean;
    /** Outline of all headings */
    outline: Array<{ level: number; text: string }>;
  };
  /** Analysis of images and alt text */
  images: {
    /** Total number of images */
    total: number;
    /** Number of images with alt text */
    withAlt: number;
    /** Number of images without alt text */
    withoutAlt: number;
    /** URLs of images missing alt text (limited to first 10) */
    missingAltImages: string[];
  };
  /** Total word count in page content */
  wordCount: number;
}

/**
 * Analyzes content quality aspects of a webpage
 *
 * @param $ - Cheerio instance with loaded HTML
 * @returns Content quality metrics
 *
 * @example
 * const $ = cheerio.load(html);
 * const quality = analyzeContentQuality($);
 * console.log(`Found ${quality.headingStructure.h1Count} H1 tags`);
 */
export function analyzeContentQuality($: cheerio.CheerioAPI): ContentQuality {
  const headingStructure = analyzeHeadings($);
  const images = analyzeImages($);
  const wordCount = countWords($);

  return {
    headingStructure,
    images,
    wordCount
  };
}

/**
 * Analyzes heading structure (H1-H6) on the page
 *
 * @param $ - Cheerio instance
 * @returns Heading structure analysis
 */
function analyzeHeadings($: cheerio.CheerioAPI) {
  const h1Elements = $('h1');
  const h1Count = h1Elements.length;
  const hasMultipleH1 = h1Count > 1;

  const outline: Array<{ level: number; text: string }> = [];

  // Build heading outline
  $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
    const tagName = elem.tagName.toLowerCase();
    const level = parseInt(tagName.charAt(1));
    const text = $(elem).text().trim().substring(0, 100); // Limit to 100 chars
    outline.push({ level, text });
  });

  // Check hierarchy validity
  const hierarchyValid = checkHeadingHierarchy(outline);

  return {
    h1Count,
    hasMultipleH1,
    hierarchyValid,
    outline: outline.slice(0, 20) // Limit to first 20 headings for response size
  };
}

/**
 * Checks if heading hierarchy is valid (no skipped levels)
 *
 * @param outline - Array of heading levels and text
 * @returns Whether hierarchy is valid
 */
function checkHeadingHierarchy(outline: Array<{ level: number; text: string }>): boolean {
  if (outline.length === 0) return true;

  // Should ideally start with H1
  if (outline[0].level !== 1) return false;

  // Check for no skipping levels (e.g., H1 -> H3 without H2)
  for (let i = 1; i < outline.length; i++) {
    const diff = outline[i].level - outline[i - 1].level;
    // Allow going down any number of levels, but going up should not skip
    if (diff > 1) return false;
  }

  return true;
}

/**
 * Analyzes images and their alt text coverage
 *
 * @param $ - Cheerio instance
 * @returns Image analysis including alt text coverage
 */
function analyzeImages($: cheerio.CheerioAPI) {
  const images = $('img');
  const total = images.length;
  let withAlt = 0;
  const missingAltImages: string[] = [];

  images.each((i, elem) => {
    const alt = $(elem).attr('alt');
    const src = $(elem).attr('src') || '';

    if (alt && alt.trim().length > 0) {
      withAlt++;
    } else {
      // Add to missing list (limit to first 10 to avoid huge arrays)
      if (missingAltImages.length < 10) {
        missingAltImages.push(src);
      }
    }
  });

  return {
    total,
    withAlt,
    withoutAlt: total - withAlt,
    missingAltImages
  };
}

/**
 * Counts words in the main body content
 *
 * @param $ - Cheerio instance
 * @returns Total word count
 */
function countWords($: cheerio.CheerioAPI): number {
  // Clone to avoid modifying the original
  const $clone = cheerio.load($.html());

  // Remove script, style, and noscript content
  $clone('script, style, noscript, nav, header, footer').remove();

  // Get body text
  const text = $clone('body').text();

  // Count words (split by whitespace and filter empty strings)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);

  return words.length;
}

/**
 * Calculates content quality score based on various metrics
 *
 * Scoring breakdown:
 * - Heading structure (40 points): H1 count, no multiple H1s, valid hierarchy
 * - Image alt text (30 points): Percentage of images with alt text
 * - Word count (30 points): Based on content depth
 *
 * @param quality - Content quality metrics
 * @returns Score from 0-100
 */
export function calculateContentQualityScore(quality: ContentQuality): number {
  let score = 0;
  const maxScore = 100;

  // Heading structure scoring (40 points total)
  if (quality.headingStructure.h1Count === 1) {
    // Perfect: exactly one H1
    score += CONTENT_QUALITY_POINTS.SINGLE_H1;
  } else if (quality.headingStructure.h1Count > 0) {
    // Has H1 but not ideal
    score += CONTENT_QUALITY_POINTS.HAS_H1;
  }

  if (!quality.headingStructure.hasMultipleH1) {
    score += CONTENT_QUALITY_POINTS.NO_MULTIPLE_H1;
  }

  if (quality.headingStructure.hierarchyValid) {
    score += CONTENT_QUALITY_POINTS.VALID_HIERARCHY;
  }

  // Image alt text scoring (30 points total)
  if (quality.images.total > 0) {
    const altPercentage = quality.images.withAlt / quality.images.total;
    score += Math.round(altPercentage * CONTENT_QUALITY_POINTS.MAX_ALT_TEXT);
  } else {
    // Neutral score if no images
    score += CONTENT_QUALITY_POINTS.NO_IMAGES_NEUTRAL;
  }

  // Word count scoring (30 points total)
  if (quality.wordCount >= SEO_LIMITS.WORD_COUNT.EXCELLENT) {
    score += CONTENT_QUALITY_POINTS.EXCELLENT_WORD_COUNT;
  } else if (quality.wordCount >= SEO_LIMITS.WORD_COUNT.GOOD) {
    score += CONTENT_QUALITY_POINTS.GOOD_WORD_COUNT;
  } else if (quality.wordCount >= SEO_LIMITS.WORD_COUNT.MIN) {
    score += CONTENT_QUALITY_POINTS.MIN_WORD_COUNT;
  }

  return Math.min(score, maxScore);
}
