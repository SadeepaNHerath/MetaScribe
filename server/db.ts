import type { SeoAnalysis, SeoAnalysisData } from "@shared/schema";

class InMemoryStorage {
  private seoAnalyses: Map<string, SeoAnalysisData> = new Map();

  storeAnalysis(url: string, data: SeoAnalysisData): void {
    this.seoAnalyses.set(url, data);
  }

  getAnalysisByUrl(url: string): SeoAnalysisData | null {
    return this.seoAnalyses.get(url) || null;
  }

  getAllAnalyses(): SeoAnalysisData[] {
    return Array.from(this.seoAnalyses.values());
  }

  clear(): void {
    this.seoAnalyses.clear();
  }
}

export const storage = new InMemoryStorage();