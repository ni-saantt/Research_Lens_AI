/**
 * ResearchLens AI - Custom React Flow Node Components
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 */
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Bot, 
  Search, 
  ShieldCheck, 
  Scale, 
  AlertTriangle, 
  Globe, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { NodeStatus } from '../../types/research';

export interface AgentNodeData {
  label: string;
  role: 'planner' | 'explorer' | 'investigator' | 'arbiter';
  status: NodeStatus;
  metrics?: {
    searches?: number;
    sources?: number;
    claims?: number;
    scrapes?: number;
  };
  subtitle?: string;
  onSelect?: () => void;
}

export function AgentNode({ data }: { data: AgentNodeData }) {
  const getColors = () => {
    switch (data.role) {
      case 'explorer':
        return {
          border: 'border-cyan-500/50 hover:border-cyan-400',
          bg: 'bg-neutral-900/90',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
          badge: 'bg-cyan-950 text-cyan-400 border border-cyan-800/60',
          icon: <Search className="w-4 h-4 text-cyan-400" />,
        };
      case 'investigator':
        return {
          border: 'border-indigo-500/50 hover:border-indigo-400',
          bg: 'bg-neutral-900/90',
          glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
          badge: 'bg-indigo-950 text-indigo-400 border border-indigo-800/60',
          icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
        };
      case 'arbiter':
        return {
          border: 'border-amber-500/60 hover:border-amber-400',
          bg: 'bg-neutral-900/95',
          glow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
          badge: 'bg-amber-950 text-amber-300 border border-amber-800/60',
          icon: <Scale className="w-4 h-4 text-amber-400" />,
        };
      default:
        return {
          border: 'border-neutral-700 hover:border-neutral-500',
          bg: 'bg-neutral-900/90',
          glow: 'shadow-none',
          badge: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
          icon: <Bot className="w-4 h-4 text-neutral-400" />,
        };
    }
  };

  const style = getColors();

  return (
    <div 
      onClick={data.onSelect}
      className={`px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-200 cursor-pointer min-w-[210px] ${style.bg} ${style.border} ${style.glow}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-neutral-500 !w-2 !h-2" />
      
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-neutral-800/80">
            {style.icon}
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-100">{data.label}</div>
            {data.subtitle && <div className="text-[10px] text-neutral-400">{data.subtitle}</div>}
          </div>
        </div>
        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
          data.status === 'RUNNING' ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' :
          data.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
          data.status === 'CONFLICT' ? 'bg-rose-500/20 text-rose-300' :
          'bg-neutral-800 text-neutral-400'
        }`}>
          {data.status}
        </span>
      </div>

      {data.metrics && (
        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-400">
          <div>
            <span className="text-neutral-500 block text-[9px]">SRCH</span>
            <span className="text-neutral-200">{data.metrics.searches || 0}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px]">SRCS</span>
            <span className="text-neutral-200">{data.metrics.sources || 0}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[9px]">CLMS</span>
            <span className="text-neutral-200">{data.metrics.claims || 0}</span>
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-neutral-500 !w-2 !h-2" />
    </div>
  );
}

export function SourceNode({ data }: { data: any }) {
  return (
    <div 
      onClick={data.onSelect}
      className="px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 transition-all max-w-[200px] cursor-pointer"
    >
      <Handle type="target" position={Position.Top} className="!bg-neutral-600 !w-1.5 !h-1.5" />
      <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
        <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
        <span className="text-[11px] font-mono truncate text-neutral-200">{data.domain || 'Source'}</span>
      </div>
      <div className="text-[10px] text-neutral-400 line-clamp-1">{data.title}</div>
      <div className="flex items-center justify-between mt-1 text-[9px] text-neutral-500 font-mono">
        <span>{data.authority}</span>
        {data.scraped && <span className="text-emerald-400 flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" /> Scraped</span>}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-neutral-600 !w-1.5 !h-1.5" />
    </div>
  );
}

export function ConflictNode({ data }: { data: any }) {
  return (
    <div 
      onClick={data.onSelect}
      className="px-3.5 py-2.5 rounded-xl border border-rose-500/60 bg-rose-950/40 hover:border-rose-400 transition-all max-w-[220px] shadow-[0_0_15px_rgba(244,63,94,0.15)] cursor-pointer"
    >
      <Handle type="target" position={Position.Top} className="!bg-rose-500 !w-2 !h-2" />
      <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs mb-1">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Conflict Detected</span>
      </div>
      <div className="text-[11px] font-medium text-neutral-200 truncate">{data.entityName}</div>
      <div className="text-[10px] text-neutral-400 mb-1.5">{data.fieldName}</div>
      <div className="text-[9px] font-mono text-rose-300/80 bg-rose-950/60 px-2 py-1 rounded border border-rose-900/50">
        Status: {data.status || 'Escalated to Arbiter'}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-rose-500 !w-2 !h-2" />
    </div>
  );
}

export function EscalationNode({ data }: { data: any }) {
  return (
    <div 
      onClick={data.onSelect}
      className="px-3 py-2 rounded-lg border border-amber-500/70 bg-amber-950/30 text-amber-200 text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(245,158,11,0.2)] animate-pulse cursor-pointer"
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-1.5 !h-1.5" />
      <Flame className="w-3.5 h-3.5 text-amber-400" />
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Targeted Web Verification</div>
        <div className="text-[10px] text-neutral-300 truncate max-w-[160px]">{data.query || 'Targeted Search'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-1.5 !h-1.5" />
    </div>
  );
}
