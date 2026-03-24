import type * as cheerio from "cheerio";

/**
 * Represents structured data (JSON-LD) found on a webpage
 */
export interface StructuredData {
  /** Schema.org type (e.g., "Organization", "Article", "Product") */
  type: string;
  /** Whether the structured data passes validation */
  isValid: boolean;
  /** Raw parsed JSON data */
  data: Record<string, any>;
  /** Validation errors, if any */
  errors?: string[];
}

/**
 * Extracts and validates JSON-LD structured data from a webpage
 *
 * @param $ - Cheerio instance with loaded HTML
 * @returns Array of structured data objects found on the page
 *
 * @example
 * const $ = cheerio.load(html);
 * const structuredData = extractStructuredData($);
 * console.log(`Found ${structuredData.length} structured data blocks`);
 */
export function extractStructuredData($: cheerio.CheerioAPI): StructuredData[] {
  const results: StructuredData[] = [];

  $('script[type="application/ld+json"]').each((i, elem) => {
    try {
      const content = $(elem).html();
      if (!content) return;

      const data = JSON.parse(content);

      // Handle arrays of structured data
      if (Array.isArray(data)) {
        data.forEach(item => {
          const structuredData = validateStructuredData(item);
          results.push(structuredData);
        });
      } else {
        const structuredData = validateStructuredData(data);
        results.push(structuredData);
      }
    } catch (error) {
      results.push({
        type: 'Unknown',
        isValid: false,
        data: {},
        errors: ['Failed to parse JSON-LD: Invalid JSON syntax']
      });
    }
  });

  return results;
}

/**
 * Validates structured data against common Schema.org types
 *
 * @param data - Parsed JSON-LD data
 * @returns Validated structured data with errors if invalid
 */
function validateStructuredData(data: any): StructuredData {
  const errors: string[] = [];
  const type = data['@type'] || 'Unknown';

  // Basic validation - all schema.org types require @context and @type
  if (!data['@context']) {
    errors.push('Missing required "@context" property');
  }

  if (!data['@type']) {
    errors.push('Missing required "@type" property');
  }

  // Type-specific validation for common schema types
  switch (type) {
    case 'Organization':
    case 'LocalBusiness':
      if (!data.name) errors.push('Organization/LocalBusiness missing required "name" field');
      break;

    case 'Article':
    case 'NewsArticle':
    case 'BlogPosting':
      if (!data.headline) errors.push('Article missing required "headline" field');
      if (!data.author) errors.push('Article missing required "author" field');
      if (!data.datePublished) errors.push('Article missing required "datePublished" field');
      break;

    case 'Product':
      if (!data.name) errors.push('Product missing required "name" field');
      if (!data.description) errors.push('Product missing required "description" field');
      break;

    case 'WebSite':
      if (!data.name && !data.url) {
        errors.push('WebSite should have at least "name" or "url" field');
      }
      break;

    case 'Person':
      if (!data.name) errors.push('Person missing required "name" field');
      break;

    case 'Event':
      if (!data.name) errors.push('Event missing required "name" field');
      if (!data.startDate) errors.push('Event missing required "startDate" field');
      if (!data.location) errors.push('Event missing required "location" field');
      break;

    case 'Recipe':
      if (!data.name) errors.push('Recipe missing required "name" field');
      if (!data.recipeIngredient) errors.push('Recipe missing required "recipeIngredient" field');
      if (!data.recipeInstructions) errors.push('Recipe missing required "recipeInstructions" field');
      break;

    case 'FAQPage':
      if (!data.mainEntity || !Array.isArray(data.mainEntity)) {
        errors.push('FAQPage missing required "mainEntity" array');
      }
      break;

    case 'VideoObject':
      if (!data.name) errors.push('VideoObject missing required "name" field');
      if (!data.description) errors.push('VideoObject missing required "description" field');
      if (!data.uploadDate) errors.push('VideoObject missing required "uploadDate" field');
      break;

    case 'BreadcrumbList':
      if (!data.itemListElement || !Array.isArray(data.itemListElement)) {
        errors.push('BreadcrumbList missing required "itemListElement" array');
      }
      break;
  }

  return {
    type,
    isValid: errors.length === 0,
    data,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Calculates structured data score based on presence and validity
 *
 * @param structuredData - Array of structured data objects
 * @returns Score from 0-100
 */
export function calculateStructuredDataScore(structuredData: StructuredData[]): number {
  if (structuredData.length === 0) return 0;

  let score = 0;
  const maxScore = 100;

  // Has any structured data (40 points)
  score += 40;

  // Valid structured data (40 points based on percentage)
  const validCount = structuredData.filter(sd => sd.isValid).length;
  const validPercentage = validCount / structuredData.length;
  score += Math.round(validPercentage * 40);

  // Multiple schema types (20 points)
  if (structuredData.length >= 2) {
    score += 20;
  } else if (structuredData.length === 1) {
    score += 10;
  }

  return Math.min(score, maxScore);
}
