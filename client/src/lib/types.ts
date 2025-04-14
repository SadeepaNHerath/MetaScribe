export interface SeoScores {
  overall: number;
  requiredTags: number;
  socialTags: number;
  bestPractices: number;
}

export interface AnalysisResult {
  url: string;
  metaTags: {
    name: string;
    content: string;
    status: 'present' | 'missing' | 'warning';
  }[];
  scores: SeoScores;
  recommendations: {
    title: string;
    description: string;
    code?: string;
    type: 'success' | 'warning' | 'error';
  }[];
  rawHtml?: string;
}
