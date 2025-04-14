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

export type MetaTag = {
  name: string;
  content: string;
  status: 'present' | 'missing' | 'warning';
};

export type ScoreCategory = {
  name: string;
  value: number;
  color: string;
};

export type Recommendation = {
  title: string;
  description: string;
  code?: string;
  type: 'success' | 'warning' | 'error';
};

export type SeoAnalysisData = {
  createdAt: any;
  url: string;
  metaTags: MetaTag[];
  scores: {
    overall: number;
    requiredTags: number;
    socialTags: number;
    bestPractices: number;
    createdAt: string;
  };
  recommendations: Recommendation[];
  rawHtml?: string;
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type User = typeof users.$inferSelect;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;
