/**
 * ResearchLens AI - Live Web Scraper Engine
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * Uses server-side fetch with Cheerio HTML extraction, timeouts, and safe error handling.
 */
import * as cheerio from 'cheerio';
import { SourceAuthority } from '../types/research';

export interface ScrapedPageResult {
  url: string;
  domain: string;
  title: string;
  headings: string[];
  snippet: string;
  cleanText: string;
  wordCount: number;
  authority: SourceAuthority;
  retrievedAt: string;
  scrapedSuccessfully: boolean;
  httpStatus?: number;
  errorMessage?: string;
}

export function classifyAuthority(url: string): SourceAuthority {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    
    if (host.endsWith('.gov') || host.endsWith('.gov.in') || host.endsWith('.nic.in') || host.endsWith('.edu') || host.endsWith('.ac.in')) {
      return 'OFFICIAL_GOV';
    }
    if (host.includes('wikipedia.org') || host.includes('arxiv.org') || host.includes('researchgate.net') || host.includes('ieee.org')) {
      return 'ACADEMIC_INDUSTRY';
    }
    if (host.includes('reuters.com') || host.includes('bloomberg.com') || host.includes('techcrunch.com') || host.includes('thehindu.com') || host.includes('livemint.com') || host.includes('economictimes.')) {
      return 'SECONDARY_MEDIA';
    }
    if (host.includes('crunchbase.com') || host.includes('pitchbook.com') || host.includes('tracxn.com') || host.includes('yellowpages') || host.includes('justdial')) {
      return 'AGGREGATOR';
    }
    return 'PRIMARY_COMPANY';
  } catch {
    return 'UNVERIFIED';
  }
}

export async function scrapeUrl(targetUrl: string, timeoutMs = 6000): Promise<ScrapedPageResult> {
  const normalizedUrl = targetUrl.trim();
  let domain = '';
  try {
    domain = new URL(normalizedUrl).hostname;
  } catch {
    domain = 'unknown';
  }

  const resultTemplate: ScrapedPageResult = {
    url: normalizedUrl,
    domain,
    title: domain,
    headings: [],
    snippet: '',
    cleanText: '',
    wordCount: 0,
    authority: classifyAuthority(normalizedUrl),
    retrievedAt: new Date().toISOString(),
    scrapedSuccessfully: false,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ResearchLens-AIBot/1.0; +https://github.com/researchlens-ai)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    resultTemplate.httpStatus = response.status;

    if (!response.ok) {
      resultTemplate.errorMessage = `HTTP error ${response.status} ${response.statusText}`;
      return resultTemplate;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml') && !contentType.includes('text/plain')) {
      resultTemplate.errorMessage = `Unsupported MIME type: ${contentType}`;
      return resultTemplate;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Strip noise: scripts, styles, iframes, ads, SVGs
    $('script, style, noscript, iframe, svg, nav, footer, header, form, [role="banner"], [role="navigation"]').remove();

    const title = ($('title').first().text() || $('h1').first().text() || domain).trim();
    resultTemplate.title = title || domain;

    const headings: string[] = [];
    $('h1, h2, h3').slice(0, 10).each((_, el) => {
      const txt = $(el).text().trim().replace(/\s+/g, ' ');
      if (txt && txt.length > 3 && txt.length < 120 && !headings.includes(txt)) {
        headings.push(txt);
      }
    });
    resultTemplate.headings = headings;

    // Extract text blocks
    const paragraphs: string[] = [];
    $('p, li, td, th').slice(0, 40).each((_, el) => {
      const txt = $(el).text().trim().replace(/\s+/g, ' ');
      if (txt.length > 25 && !paragraphs.includes(txt)) {
        paragraphs.push(txt);
      }
    });

    const bodyText = paragraphs.join(' \n');
    resultTemplate.cleanText = bodyText.slice(0, 3000);
    resultTemplate.wordCount = bodyText.split(/\s+/).filter(Boolean).length;
    resultTemplate.snippet = (paragraphs.slice(0, 3).join(' ') || bodyText.slice(0, 350)).trim();
    resultTemplate.scrapedSuccessfully = resultTemplate.cleanText.length > 40;

    return resultTemplate;
  } catch (err: any) {
    resultTemplate.errorMessage = err.name === 'AbortError' ? 'Scrape timeout (exceeded 6s)' : (err.message || 'Scrape failed');
    return resultTemplate;
  }
}
