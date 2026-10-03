/**
 * ResearchLens AI - Canonical Status & Metric Helpers
 * Multi-Agent Research & Evidence Intelligence Platform
 * Developer: Nishant Choudhary
 * 
 * Provides unified, single-source-of-truth status badges, labels, colors,
 * and metric calculations across all UI views (Dashboard, Inspector, Compare, Provenance, Sources, CounterBar).
 */

import { ClaimVerificationStatus, SourceAuthority, DiscoveredEntity, ExtractedClaim, ConflictItem } from '../types/research';

export interface StatusBadgeConfig {
  label: string;
  badgeClass: string;
  dotColor: string;
  description: string;
}

export function getStatusBadgeConfig(status: ClaimVerificationStatus | string): StatusBadgeConfig {
  switch (status) {
    case 'VERIFIED':
      return {
        label: 'Verified',
        badgeClass: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80',
        dotColor: 'bg-emerald-400',
        description: 'Strong, authoritative evidence from official statutory, primary, or verified sources.',
      };
    case 'SUPPORTED':
      return {
        label: 'Supported',
        badgeClass: 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80',
        dotColor: 'bg-cyan-400',
        description: 'Corroborated by credible secondary web evidence; awaiting primary confirmation.',
      };
    case 'CONFLICTING':
      return {
        label: 'Conflicting',
        badgeClass: 'bg-rose-950/80 text-rose-300 border border-rose-800/80',
        dotColor: 'bg-rose-400',
        description: 'Two or more substantive evidence-backed claims directly contradict each other.',
      };
    case 'INSUFFICIENT_EVIDENCE':
    case 'INCOMPLETE':
      return {
        label: 'Insufficient Evidence',
        badgeClass: 'bg-amber-950/80 text-amber-300 border border-amber-800/80',
        dotColor: 'bg-amber-400',
        description: 'Targeted search was performed, but adequate authoritative evidence was not found.',
      };
    case 'MISSING':
      return {
        label: 'Missing Data',
        badgeClass: 'bg-neutral-900 text-neutral-400 border border-neutral-800',
        dotColor: 'bg-neutral-500',
        description: 'Required attribute has not been disclosed in public records.',
      };
    case 'UNVERIFIED':
    default:
      return {
        label: 'Unverified',
        badgeClass: 'bg-neutral-900 text-neutral-400 border border-neutral-700',
        dotColor: 'bg-neutral-500',
        description: 'Observation noted but formal multi-source verification has not completed.',
      };
  }
}

export interface AuthorityBadgeConfig {
  label: string;
  badgeClass: string;
  category: string;
}

export function getAuthorityBadgeConfig(authority: SourceAuthority | string): AuthorityBadgeConfig {
  switch (authority) {
    case 'GOVERNMENT_STATUTORY':
    case 'OFFICIAL_GOV':
      return {
        label: 'Gov / Statutory',
        badgeClass: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-semibold',
        category: 'Official Authority',
      };
    case 'REGULATOR':
      return {
        label: 'Regulator / Accreditation',
        badgeClass: 'bg-teal-950/80 text-teal-300 border border-teal-800/80 font-semibold',
        category: 'Statutory Regulator',
      };
    case 'PRIMARY_ENTITY':
    case 'PRIMARY_COMPANY':
      return {
        label: 'Primary Entity Portal',
        badgeClass: 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-semibold',
        category: 'Primary Source',
      };
    case 'ACADEMIC_PRIMARY':
      return {
        label: 'Academic Primary Paper',
        badgeClass: 'bg-blue-950/80 text-blue-300 border border-blue-800/80 font-semibold',
        category: 'Peer-Reviewed Primary',
      };
    case 'ACADEMIC_SECONDARY':
    case 'ACADEMIC_INDUSTRY':
      return {
        label: 'Academic / Technical',
        badgeClass: 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 font-semibold',
        category: 'Scholarly / Industry Research',
      };
    case 'REPUTABLE_PUBLICATION':
    case 'SECONDARY_MEDIA':
      return {
        label: 'Reputable Publication',
        badgeClass: 'bg-amber-950/80 text-amber-300 border border-amber-800/80 font-semibold',
        category: 'News / Journalistic',
      };
    case 'INDUSTRY_SOURCE':
      return {
        label: 'Industry Source',
        badgeClass: 'bg-sky-950/80 text-sky-300 border border-sky-800/80',
        category: 'Industry Association',
      };
    case 'SECONDARY_DIRECTORY':
      return {
        label: 'Secondary Directory',
        badgeClass: 'bg-purple-950/80 text-purple-300 border border-purple-800/80',
        category: 'Third-Party Directory',
      };
    case 'AGGREGATOR':
      return {
        label: 'Aggregator Portal',
        badgeClass: 'bg-violet-950/80 text-violet-300 border border-violet-800/80',
        category: 'Aggregator Snapshot',
      };
    case 'REFERENCE':
      return {
        label: 'Reference Material',
        badgeClass: 'bg-slate-900 text-slate-300 border border-slate-700',
        category: 'General Reference',
      };
    case 'UNVERIFIED':
    case 'UNKNOWN':
    default:
      return {
        label: 'Unclassified Web',
        badgeClass: 'bg-neutral-900 text-neutral-400 border border-neutral-800',
        category: 'Public Web',
      };
  }
}

export interface MetricSummary {
  verifiedCount: number;
  supportedCount: number;
  conflictingCount: number;
  insufficientCount: number;
  totalFieldsCount: number;
  averageConfidence: number | null; // null if no verified claims exist
  evidenceCoverage: number; // 0 - 100%
  researchCompleteness: number; // 0 - 100%
}

export function computeCanonicalMetrics(entities: DiscoveredEntity[]): MetricSummary {
  let verifiedCount = 0;
  let supportedCount = 0;
  let conflictingCount = 0;
  let insufficientCount = 0;
  let totalFieldsCount = 0;
  let substantiveConfidenceSum = 0;
  let substantiveClaimsCount = 0;

  entities.forEach(ent => {
    Object.values(ent.fields || {}).forEach(f => {
      totalFieldsCount++;
      if (f.verifiedStatus === 'VERIFIED') {
        verifiedCount++;
        if (f.evidenceStrength !== null && f.value !== null) {
          substantiveConfidenceSum += f.evidenceStrength;
          substantiveClaimsCount++;
        }
      } else if (f.verifiedStatus === 'SUPPORTED') {
        supportedCount++;
        if (f.evidenceStrength !== null && f.value !== null) {
          substantiveConfidenceSum += f.evidenceStrength;
          substantiveClaimsCount++;
        }
      } else if (f.verifiedStatus === 'CONFLICTING') {
        conflictingCount++;
      } else {
        insufficientCount++;
      }
    });
  });

  const averageConfidence = substantiveClaimsCount > 0 
    ? Math.round(substantiveConfidenceSum / substantiveClaimsCount) 
    : null;

  const evidenceCoverage = totalFieldsCount > 0
    ? Math.round(((verifiedCount + supportedCount) / totalFieldsCount) * 100)
    : 0;

  const totalEntities = entities.length || 1;
  const avgEntityCoverage = entities.length > 0
    ? Math.round(entities.reduce((acc, e) => acc + (e.evidenceCoverage || 0), 0) / totalEntities)
    : 0;

  return {
    verifiedCount,
    supportedCount,
    conflictingCount,
    insufficientCount,
    totalFieldsCount,
    averageConfidence,
    evidenceCoverage,
    researchCompleteness: avgEntityCoverage,
  };
}
