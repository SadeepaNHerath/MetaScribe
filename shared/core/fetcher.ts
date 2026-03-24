import axios from "axios";
import * as cheerio from "cheerio";
import { HTTP_CONFIG } from "@shared/constants";

/**
 * Result from fetching and parsing a URL
 */
export interface FetchResult {
  /** Cheerio instance with loaded HTML for DOM manipulation */
  $: cheerio.CheerioAPI;
  /** Raw HTML string */
  html: string;
}

/**
 * Fetches a URL and parses the HTML content
 *
 * @param url - The URL to fetch (will be prefixed with https:// if protocol missing)
 * @returns Cheerio instance and raw HTML
 * @throws Error with user-friendly message if fetch fails
 *
 * @example
 * const { $, html } = await fetchAndParse('example.com');
 * const title = $('title').text();
 */
export async function fetchAndParse(url: string): Promise<FetchResult> {
  // Normalize URL - add https:// if no protocol specified
  const normalizedUrl = url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;

  try {
    const response = await axios.get(normalizedUrl, {
      headers: {
        'User-Agent': HTTP_CONFIG.USER_AGENT
      },
      timeout: HTTP_CONFIG.TIMEOUT_MS,
      maxRedirects: 5,
      validateStatus: (status) => status < 400, // Only accept 2xx and 3xx
    });

    const html = response.data;
    const $ = cheerio.load(html);

    return { $, html };
  } catch (error) {
    // Provide user-friendly error messages
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Connection refused. The server at ${normalizedUrl} is not accepting connections.`);
      }
      if (error.code === 'ENOTFOUND') {
        throw new Error(`Website not found. Please check if the URL "${url}" is correct.`);
      }
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        throw new Error(`Request timeout. The website took too long to respond (>${HTTP_CONFIG.TIMEOUT_MS}ms).`);
      }
      if (error.response) {
        const status = error.response.status;
        if (status === 403) {
          throw new Error(`Access forbidden (403). The website may be blocking automated requests.`);
        }
        if (status === 404) {
          throw new Error(`Page not found (404). Please check if the URL is correct.`);
        }
        if (status >= 500) {
          throw new Error(`Server error (${status}). The website's server encountered an error.`);
        }
        throw new Error(`Received ${status} status from website. ${error.response.statusText}`);
      }
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }

    // Re-throw unknown errors
    throw error;
  }
}
