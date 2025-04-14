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

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  createSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getRecentAnalyses(limit: number): Promise<SeoAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private seoAnalyses: Map<number, SeoAnalysis>;
  userCurrentId: number;
  analysisCurrentId: number;

  constructor() {
    this.users = new Map();
    this.seoAnalyses = new Map();
    this.userCurrentId = 1;
    this.analysisCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    return this.seoAnalyses.get(id);
  }
  
  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    return Array.from(this.seoAnalyses.values()).find(
      (analysis) => analysis.url === url,
    );
  }
  
  async createSeoAnalysis(insertAnalysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const id = this.analysisCurrentId++;
    const now = new Date();
    const analysis: SeoAnalysis = { 
      ...insertAnalysis, 
      id, 
      createdAt: now 
    };
    this.seoAnalyses.set(id, analysis);
    return analysis;
  }
  
  async getRecentAnalyses(limit: number): Promise<SeoAnalysis[]> {
    return Array.from(this.seoAnalyses.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
