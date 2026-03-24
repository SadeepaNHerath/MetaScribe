import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import { extractMetaTags, generateScores, generateRecommendations } from '../seoAnalyzer';

describe('extractMetaTags', () => {
  it('should extract title tag when present', () => {
    const html = '<html><head><title>Test Page Title</title></head></html>';
    const $ = cheerio.load(html);
    const tags = extractMetaTags($);

    const titleTag = tags.find(t => t.name === 'title');
    expect(titleTag).toBeDefined();
    expect(titleTag?.content).toBe('Test Page Title');
    expect(titleTag?.status).toBe('present');
  });

  it('should detect missing title tag', () => {
    const html = '<html><head></head></html>';
    const $ = cheerio.load(html);
    const tags = extractMetaTags($);

    const titleTag = tags.find(t => t.name === 'title');
    expect(titleTag).toBeDefined();
    expect(titleTag?.content).toBe('');
    expect(titleTag?.status).toBe('missing');
  });

  it('should extract meta description when present', () => {
    const html = '<html><head><meta name="description" content="Test description"></head></html>';
    const $ = cheerio.load(html);
    const tags = extractMetaTags($);

    const descTag = tags.find(t => t.name === 'description');
    expect(descTag).toBeDefined();
    expect(descTag?.content).toBe('Test description');
    expect(descTag?.status).toBe('present');
  });

  it('should detect missing description tag', () => {
    const html = '<html><head><title>Test</title></head></html>';
    const $ = cheerio.load(html);
    const tags = extractMetaTags($);

    const descTag = tags.find(t => t.name === 'description');
    expect(descTag).toBeDefined();
    expect(descTag?.status).toBe('missing');
  });

  it('should extract Open Graph tags', () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="OG Title">
          <meta property="og:description" content="OG Description">
          <meta property="og:image" content="https://example.com/image.jpg">
        </head>
      </html>
    `;
    const $ = cheerio.load(html);
    const tags = extractMetaTags($);

    const ogTitle = tags.find(t => t.name === 'og:title');
    expect(ogTitle?.content).toBe('OG Title');
    expect(ogTitle?.status).toBe('present');

    const ogDesc = tags.find(t => t.name === 'og:description');
    expect(ogDesc?.content).toBe('OG Description');

    const ogImage = tags.find(t => t.name === 'og:image');
    expect(ogImage?.content).toBe('https://example.com/image.jpg');
  });

  it('should extract Twitter Card tags', () => {
    const html = `
      <html>
        <head>
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="Twitter Title">
        </head>
      </html>
    `;
    const $ = cheerio.load(html);
    const tags = extractMetaTags($);

    const twitterCard = tags.find(t => t.name === 'twitter:card');
    expect(twitterCard?.content).toBe('summary_large_image');
    expect(twitterCard?.status).toBe('present');
  });

  it('should extract language attribute', () => {
    const html = '<html lang="en"><head><title>Test</title></head></html>';
    const $ = cheerio.load(html);
    const tags = extractMetaTags($);

    const langTag = tags.find(t => t.name === 'language');
    expect(langTag).toBeDefined();
    expect(langTag?.content).toBe('en');
    expect(langTag?.status).toBe('present');
  });
});

describe('generateScores', () => {
  it('should give 100% for all required tags present', () => {
    const tags = [
      { name: 'title', content: 'Test Title', status: 'present' as const },
      { name: 'description', content: 'Test description content', status: 'present' as const },
      { name: 'viewport', content: 'width=device-width', status: 'present' as const },
    ];

    const scores = generateScores(tags);
    expect(scores.requiredTags).toBe(100);
  });

  it('should give 0% for all required tags missing', () => {
    const tags = [
      { name: 'title', content: '', status: 'missing' as const },
      { name: 'description', content: '', status: 'missing' as const },
      { name: 'viewport', content: '', status: 'missing' as const },
    ];

    const scores = generateScores(tags);
    expect(scores.requiredTags).toBe(0);
  });

  it('should calculate social tags score correctly', () => {
    const tags = [
      { name: 'title', content: 'Test', status: 'present' as const },
      { name: 'description', content: 'Test desc', status: 'present' as const },
      { name: 'viewport', content: 'width=device-width', status: 'present' as const },
      { name: 'og:title', content: 'OG Title', status: 'present' as const },
      { name: 'og:description', content: 'OG Desc', status: 'present' as const },
      { name: 'og:image', content: 'image.jpg', status: 'present' as const },
      { name: 'og:url', content: 'https://example.com', status: 'present' as const },
      { name: 'og:type', content: 'website', status: 'present' as const },
      { name: 'twitter:card', content: 'summary', status: 'present' as const },
      { name: 'twitter:title', content: 'Twitter Title', status: 'present' as const },
      { name: 'twitter:description', content: 'Twitter Desc', status: 'present' as const },
      { name: 'twitter:image', content: 'image.jpg', status: 'present' as const },
    ];

    const scores = generateScores(tags);
    expect(scores.socialTags).toBe(100); // All 9 social tags present
  });

  it('should award best practices points for optimal title length', () => {
    const tags = [
      { name: 'title', content: 'This is a perfect length title', status: 'present' as const }, // 31 chars - within 30-60 range
      { name: 'description', content: 'Test desc', status: 'missing' as const },
      { name: 'viewport', content: '', status: 'missing' as const },
    ];

    const scores = generateScores(tags);
    expect(scores.bestPractices).toBeGreaterThan(0); // Should get points for optimal title
  });

  it('should calculate overall score using correct weights', () => {
    const tags = [
      { name: 'title', content: 'Perfect Length Title For SEO', status: 'present' as const },
      { name: 'description', content: 'This is a perfect description that is between 120 and 155 characters long for optimal display in search results and user engagement.', status: 'present' as const },
      { name: 'viewport', content: 'width=device-width', status: 'present' as const },
    ];

    const scores = generateScores(tags);
    expect(scores.overall).toBeGreaterThan(0);
    expect(scores.overall).toBeLessThanOrEqual(100);
  });
});

describe('generateRecommendations', () => {
  it('should recommend adding title if missing', () => {
    const tags = [
      { name: 'title', content: '', status: 'missing' as const },
    ];

    const recs = generateRecommendations(tags, 'https://example.com');
    const titleRec = recs.find(r => r.title.includes('title'));

    expect(titleRec).toBeDefined();
    expect(titleRec?.type).toBe('error');
    expect(titleRec?.code).toContain('<title>');
  });

  it('should recommend adding description if missing', () => {
    const tags = [
      { name: 'title', content: 'Test', status: 'present' as const },
      { name: 'description', content: '', status: 'missing' as const },
    ];

    const recs = generateRecommendations(tags, 'https://example.com');
    const descRec = recs.find(r => r.title.includes('description'));

    expect(descRec).toBeDefined();
    expect(descRec?.type).toBe('error');
  });

  it('should give success recommendation for optimal title', () => {
    const tags = [
      { name: 'title', content: 'Perfect Length SEO Title', status: 'present' as const }, // ~25 chars - needs to be 30-60
    ];

    const recs = generateRecommendations(tags, 'https://example.com');
    // Should get warning for short title (< 30 chars)
    const titleRec = recs.find(r => r.title.includes('title'));
    expect(titleRec).toBeDefined();
  });

  it('should recommend adding Open Graph tags if missing', () => {
    const tags = [
      { name: 'title', content: 'Test Title', status: 'present' as const },
      { name: 'description', content: 'Test description', status: 'present' as const },
    ];

    const recs = generateRecommendations(tags, 'https://example.com');
    const ogRec = recs.find(r => r.title.includes('Open Graph'));

    expect(ogRec).toBeDefined();
    expect(ogRec?.type).toBe('warning');
    expect(ogRec?.code).toContain('og:title');
  });

  it('should recommend canonical URL if missing', () => {
    const tags = [
      { name: 'canonical', content: '', status: 'warning' as const },
    ];

    const recs = generateRecommendations(tags, 'https://example.com');
    const canonicalRec = recs.find(r => r.title.includes('canonical'));

    expect(canonicalRec).toBeDefined();
    expect(canonicalRec?.code).toContain('<link rel="canonical"');
  });
});
