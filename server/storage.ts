import { 
  type User, 
  type InsertUser, 
  type SeoAnalysis, 
  type InsertSeoAnalysis, 
  type SeoAnalysisData 
} from "@shared/schema";
import { storage as memoryStorage } from "./db";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysisData | null>;
  createSeoAnalysis(analysis: SeoAnalysisData): Promise<void>;
  getRecentAnalyses(limit: number): Promise<SeoAnalysisData[]>;
}

export class InMemoryDatabaseStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private userIdCounter = 1;
  private usersByUsername: Map<string, User> = new Map();
  private analysisIdCounter = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.usersByUsername.get(username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    this.usersByUsername.set(insertUser.username, user);
    return user;
  }
  
  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    return undefined;
  }
  
  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysisData | null> {
    return memoryStorage.getAnalysisByUrl(url);
  }
  
  async createSeoAnalysis(analysis: SeoAnalysisData): Promise<void> {
    memoryStorage.storeAnalysis(analysis.url, analysis);
  }
  
  async getRecentAnalyses(limit: number): Promise<SeoAnalysisData[]> {
    const allAnalyses = memoryStorage.getAllAnalyses();
    return allAnalyses.slice(0, limit);
  }
}

export const storage = new InMemoryDatabaseStorage();
