/**
 * Configuration constants for SEO analysis
 * Centralizes all magic numbers and configuration values
 */

// HTTP Request Configuration
export const HTTP_CONFIG = {
  /** Timeout for HTTP requests in milliseconds */
  TIMEOUT_MS: 10000,
  /** User agent string for web scraping */
  USER_AGENT: 'SEO-Tag-Analyzer/1.0',
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  /** Cache time-to-live in milliseconds (1 hour) */
  TTL_MS: 3600000,
} as const;

// SEO Content Length Limits
export const SEO_LIMITS = {
  TITLE: {
    /** Minimum length for title tag */
    MIN: 10,
    /** Optimal minimum length for title tag */
    OPTIMAL_MIN: 30,
    /** Optimal maximum length for title tag (before truncation in SERPs) */
    OPTIMAL_MAX: 60,
    /** Maximum reasonable length for title tag */
    MAX: 70,
  },
  DESCRIPTION: {
    /** Minimum length for meta description */
    MIN: 70,
    /** Optimal minimum length for meta description */
    OPTIMAL_MIN: 120,
    /** Optimal maximum length for meta description (before truncation in SERPs) */
    OPTIMAL_MAX: 155,
    /** Maximum reasonable length for meta description */
    MAX: 320,
  },
  WORD_COUNT: {
    /** Minimum word count for quality content */
    MIN: 300,
    /** Good word count threshold */
    GOOD: 500,
    /** Excellent word count threshold */
    EXCELLENT: 1000,
  },
} as const;

// Phase 1: Original Scoring Weights
export const SCORING_WEIGHTS = {
  /** Weight for required tags (title, description, viewport) */
  REQUIRED_TAGS: 0.4,
  /** Weight for social media tags (Open Graph, Twitter Cards) */
  SOCIAL_TAGS: 0.3,
  /** Weight for SEO best practices (canonical, robots, etc.) */
  BEST_PRACTICES: 0.3,
} as const;

// Phase 2: Enhanced Scoring Weights
export const SCORING_WEIGHTS_V2 = {
  /** Weight for required tags */
  REQUIRED_TAGS: 0.25,
  /** Weight for social media tags */
  SOCIAL_TAGS: 0.20,
  /** Weight for SEO best practices */
  BEST_PRACTICES: 0.20,
  /** Weight for content quality analysis */
  CONTENT_QUALITY: 0.20,
  /** Weight for structured data (JSON-LD) */
  STRUCTURED_DATA: 0.15,
} as const;

// Best Practices Score Points
export const SCORE_POINTS = {
  /** Points for having robots meta tag */
  ROBOTS_TAG: 20,
  /** Points for having canonical URL */
  CANONICAL_TAG: 20,
  /** Points for having language attribute */
  LANGUAGE_TAG: 20,
  /** Points for optimal title length */
  OPTIMAL_TITLE: 20,
  /** Points for having any title */
  PARTIAL_TITLE: 10,
  /** Points for optimal description length */
  OPTIMAL_DESCRIPTION: 20,
  /** Points for having any description */
  PARTIAL_DESCRIPTION: 10,
} as const;

// Required Meta Tags List
export const REQUIRED_TAGS = ['title', 'description', 'viewport'] as const;

// Social Media Tags List
export const SOCIAL_TAGS = [
  'og:title',
  'og:description',
  'og:image',
  'og:url',
  'og:type',
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
] as const;

// Extended Social Media Tags (Phase 2)
export const EXTENDED_SOCIAL_TAGS = [
  'og:locale',
  'og:site_name',
  'article:published_time',
  'article:modified_time',
  'article:author',
  'article:section',
  'article:tag',
  'twitter:site',
  'twitter:creator',
] as const;

// PWA/Mobile Tags (Phase 2)
export const PWA_MOBILE_TAGS = [
  'theme-color',
  'apple-mobile-web-app-capable',
  'apple-mobile-web-app-title',
  'apple-mobile-web-app-status-bar-style',
] as const;

// Content Quality Score Points (Phase 2)
export const CONTENT_QUALITY_POINTS = {
  /** Points for having exactly one H1 */
  SINGLE_H1: 15,
  /** Points for having at least one H1 */
  HAS_H1: 5,
  /** Points for not having multiple H1s */
  NO_MULTIPLE_H1: 10,
  /** Points for valid heading hierarchy */
  VALID_HIERARCHY: 15,
  /** Maximum points for image alt text coverage */
  MAX_ALT_TEXT: 30,
  /** Points if no images present */
  NO_IMAGES_NEUTRAL: 15,
  /** Points for excellent word count (1000+) */
  EXCELLENT_WORD_COUNT: 30,
  /** Points for good word count (500+) */
  GOOD_WORD_COUNT: 20,
  /** Points for minimum word count (300+) */
  MIN_WORD_COUNT: 10,
} as const;

// Structured Data Score Points (Phase 2)
export const STRUCTURED_DATA_POINTS = {
  /** Points for having any structured data */
  HAS_STRUCTURED_DATA: 40,
  /** Maximum points for valid structured data */
  MAX_VALID_DATA: 40,
  /** Points for having multiple schema types */
  MULTIPLE_TYPES: 20,
  /** Points for having one schema type */
  SINGLE_TYPE: 10,
} as const;
