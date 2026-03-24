/**
 * Server-side SEO analyzer
 *
 * This module now serves as a thin wrapper around the shared core analyzer.
 * All core analysis logic has been moved to @shared/core for code reuse.
 */

import type { SeoAnalysisData } from "@shared/schema";
import { analyzeSeo as coreAnalyzeSeo } from "@shared/core/analyzeSeoWrapper";

/**
 * Analyzes SEO aspects of a given URL
 *
 * @param url - URL to analyze (will be normalized with https:// if needed)
 * @returns Complete SEO analysis data including meta tags, scores, and recommendations
 * @throws Error if URL cannot be fetched or parsed
 *
 * @example
 * const analysis = await analyzeSeo('example.com');
 * console.log(`Overall score: ${analysis.scores.overall}/100`);
 */
export async function analyzeSeo(url: string): Promise<SeoAnalysisData> {
  return coreAnalyzeSeo(url);
}
