import { 
  users, 
  seoAnalyses, 
  type User, 
  type InsertUser, 
  type SeoAnalysis, 
  type InsertSeoAnalysis, 
  type MetaTag, 
  type Recommendation 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  createSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getRecentAnalyses(limit: number): Promise<SeoAnalysis[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    const [analysis] = await db.select().from(seoAnalyses).where(eq(seoAnalyses.id, id));
    return analysis || undefined;
  }
  
  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    const [analysis] = await db.select().from(seoAnalyses).where(eq(seoAnalyses.url, url));
    return analysis || undefined;
  }
  
  async createSeoAnalysis(insertAnalysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const [analysis] = await db
      .insert(seoAnalyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }
  
  async getRecentAnalyses(limit: number): Promise<SeoAnalysis[]> {
    return await db
      .select()
      .from(seoAnalyses)
      .orderBy(desc(seoAnalyses.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
