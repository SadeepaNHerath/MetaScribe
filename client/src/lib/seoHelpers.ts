import type { MetaTag } from "@shared/schema";

export function getMetaTagValue(metaTags: MetaTag[], name: string): string | undefined {
  const tag = metaTags.find(tag => tag.name === name);
  return tag?.content;
}

export function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

export function getLengthStatus(text: string | undefined, minLength: number, maxLength: number): 'success' | 'warning' | 'error' {
  if (!text) return 'error';
  if (text.length >= minLength && text.length <= maxLength) return 'success';
  if (text.length < minLength) return 'warning';
  return 'warning';
}

export function getColorForStatus(status: 'success' | 'warning' | 'error'): string {
  switch (status) {
    case 'success':
      return 'text-secondary';
    case 'warning':
      return 'text-warning';
    case 'error':
      return 'text-error';
    default:
      return 'text-gray-700';
  }
}
