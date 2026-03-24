import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  metaTags: jsonb("meta_tags").notNull(),
  scores: jsonb("scores").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses).pick({
  url: true,
  metaTags: true,
  scores: true,
  recommendations: true,
});

/**
 * Represents a single meta tag found on a webpage
 */
export type MetaTag = {
  /** Tag name (e.g., 'title', 'og:image', 'twitter:card') */
  name: string;
  /** Tag content value */
  content: string;
  /** Detection status indicating presence and importance */
  status: 'present' | 'missing' | 'warning';
};

/**
 * Score category for UI display
 */
export type ScoreCategory = {
  /** Display name of the category */
  name: string;
  /** Score value (0-100) */
  value: number;
  /** Color code for visual representation */
  color: string;
};

/**
 * SEO recommendation for improving website optimization
 */
export type Recommendation = {
  /** Recommendation title/heading */
  title: string;
  /** Detailed explanation of the recommendation */
  description: string;
  /** Optional code snippet to demonstrate implementation */
  code?: string;
  /** Recommendation severity level */
  type: 'success' | 'warning' | 'error';
};

/**
 * Complete SEO analysis result for a webpage
 */
export type SeoAnalysisData = {
  /** ISO 8601 timestamp of when the analysis was performed */
  createdAt: string;
  /** URL that was analyzed */
  url: string;
  /** Array of detected meta tags */
  metaTags: MetaTag[];
  /** SEO health scores across different categories */
  scores: {
    /** Overall SEO health score (0-100) */
    overall: number;
    /** Score for required tags: title, description, viewport */
    requiredTags: number;
    /** Score for social media tags: Open Graph, Twitter Cards */
    socialTags: number;
    /** Score for SEO best practices: canonical, robots, language */
    bestPractices: number;
    /** Score for content quality: headings, images, word count (Phase 2) */
    contentQuality?: number;
    /** Score for structured data: JSON-LD presence and validity (Phase 2) */
    structuredData?: number;
    /** ISO 8601 timestamp of score calculation */
    createdAt: string;
  };
  /** Array of actionable recommendations */
  recommendations: Recommendation[];
  /** Raw HTML from the <head> section */
  rawHtml?: string;
  /** Structured data (JSON-LD) found on the page (Phase 2) */
  structuredData?: StructuredData[];
  /** Content quality metrics (Phase 2) */
  contentQuality?: ContentQuality;
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type User = typeof users.$inferSelect;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;

/**
 * Structured data (JSON-LD) found on a webpage
 */
export type StructuredData = {
  /** Schema.org type (e.g., "Organization", "Article", "Product") */
  type: string;
  /** Whether the structured data passes validation */
  isValid: boolean;
  /** Raw parsed JSON data */
  data: Record<string, any>;
  /** Validation errors, if any */
  errors?: string[];
};

/**
 * Content quality metrics for a webpage
 */
export type ContentQuality = {
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
    /** URLs of images missing alt text */
    missingAltImages: string[];
  };
  /** Total word count in page content */
  wordCount: number;
};

