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

export function classifyAuthority(url: string, targetEntityName?: string): SourceAuthority {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    // 1. Regulatory Authorities
    const regulators = [
      'nirfindia.org', 'aicte-india.org', 'ugc.ac.in', 'nba-india.org',
      'beeindia.gov.in', 'rbi.org.in', 'sec.gov', 'sebi.gov.in',
      'trai.gov.in', 'fcc.gov', 'fda.gov', 'who.int'
    ];
    if (regulators.some(r => host === r || host.endsWith('.' + r))) {
      return 'REGULATOR';
    }

    // 2. Government & Statutory Portals
    if (
      host.endsWith('.gov') || 
      host.endsWith('.gov.in') || 
      host.endsWith('.nic.in') ||
      host.includes('rajasthan.gov.in') ||
      host.includes('india.gov.in')
    ) {
      return 'GOVERNMENT_STATUTORY';
    }

    // 3. Primary Academic & Scholarly Journals
    const academicPrimaryHosts = [
      'arxiv.org', 'ieee.org', 'acm.org', 'nature.com', 
      'science.org', 'sciencedirect.com', 'springer.com', 'biorxiv.org'
    ];
    if (
      host.endsWith('.edu') || 
      host.endsWith('.ac.in') ||
      academicPrimaryHosts.some(a => host === a || host.endsWith('.' + a))
    ) {
      return 'ACADEMIC_PRIMARY';
    }

    // 4. Secondary Education / Product Comparison Directories
    const secondaryDirectories = [
      'collegedunia.com', 'collegedekho.com', 'shiksha.com', 'careers360.com',
      'getmyuni.com', 'universitykart.com', 'jagranjosh.com', 'sarvgyan.com',
      'g2.com', 'capterra.com', 'trustradius.com', 'glassdoor.com', 'ambitionbox.com'
    ];
    if (secondaryDirectories.some(d => host.includes(d))) {
      return 'SECONDARY_DIRECTORY';
    }

    // 5. Reference & Standard Documentation
    if (
      host.includes('wikipedia.org') || 
      host.includes('wikimedia.org') ||
      host.includes('developer.mozilla.org') ||
      host.includes('w3.org') ||
      host.includes('ecma-international.org')
    ) {
      return 'REFERENCE';
    }

    // 6. Primary Official Technology / Organization Platforms
    const primaryTechPlatforms = [
      'python.org', 'nodejs.org', 'typescriptlang.org', 'react.dev',
      'angular.io', 'vuejs.org', 'golang.org', 'rust-lang.org',
      'cursor.com', 'openai.com', 'anthropic.com', 'codeium.com',
      'cognition.ai', 'github.com'
    ];
    if (primaryTechPlatforms.some(p => host === p || host.endsWith('.' + p))) {
      return 'PRIMARY_ENTITY';
    }

    // Check if domain matches target entity name
    if (targetEntityName) {
      const cleanEntity = targetEntityName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanHost = host.replace(/[^a-z0-9]/g, '');
      if (cleanEntity.length >= 3 && cleanHost.includes(cleanEntity)) {
        return 'PRIMARY_ENTITY';
      }
    }

    // 7. Reputable News & Publications
    const reputablePubs = [
      'reuters.com', 'bloomberg.com', 'thehindu.com', 'indianexpress.com',
      'livemint.com', 'economictimes.indiatimes.com', 'techcrunch.com',
      'wired.com', 'wsj.com', 'ft.com', 'bbc.com', 'apnews.com', 'hindustantimes.com'
    ];
    if (reputablePubs.some(p => host.includes(p))) {
      return 'REPUTABLE_PUBLICATION';
    }

    // 8. Aggregators
    const aggregators = [
      'crunchbase.com', 'pitchbook.com', 'tracxn.com', 'justdial.com',
      'indiamart.com', 'yellowpages', 'sulekha.com', 'meraev.com', 'ecogears.in', 'greenpages.co.in'
    ];
    if (aggregators.some(ag => host.includes(ag))) {
      return 'AGGREGATOR';
    }

    // 9. Industry Sources
    if (host.includes('blog') || host.includes('stackshare.io') || host.includes('infoq.com') || host.includes('medium.com')) {
      return 'INDUSTRY_SOURCE';
    }

    return 'UNKNOWN';
  } catch {
    return 'UNKNOWN';
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
