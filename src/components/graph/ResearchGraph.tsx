/**
 * ResearchLens AI - Dynamic Research Arena Graph (React Flow)
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * Dynamically builds nodes and edges based on real execution events, sources, conflicts, and arbiter decisions.
 */
import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge, 
  BackgroundVariant 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AgentNode, SourceNode, ConflictNode, EscalationNode } from './CustomNodes';
import { ResearchState, NodeStatus } from '../../types/research';

interface ResearchGraphProps {
  state: ResearchState;
  onSelectItem: (item: any) => void;
}

const nodeTypes = {
  agentNode: AgentNode,
  sourceNode: SourceNode,
  conflictNode: ConflictNode,
  escalationNode: EscalationNode,
};

export function ResearchGraph({ state, onSelectItem }: ResearchGraphProps) {
  const { nodes, edges } = useMemo(() => {
    const calculatedNodes: Node[] = [];
    const calculatedEdges: Edge[] = [];

    // 1. Root: User Query Node
    calculatedNodes.push({
      id: 'node-query',
      type: 'agentNode',
      position: { x: 380, y: 20 },
      data: {
        label: 'RESEARCH REQUEST',
        subtitle: state.query ? (state.query.length > 40 ? state.query.slice(0, 38) + '...' : state.query) : 'Awaiting prompt...',
        role: 'planner',
        status: state.status === 'idle' ? 'QUEUED' : 'COMPLETED',
        onSelect: () => onSelectItem({ type: 'query', value: state.query }),
      },
    });

    // 2. Planner Node
    let plannerStatus: NodeStatus = 'QUEUED';
    if (state.status === 'planning') plannerStatus = 'RUNNING';
    else if (state.plan) plannerStatus = 'COMPLETED';

    calculatedNodes.push({
      id: 'node-planner',
      type: 'agentNode',
      position: { x: 380, y: 130 },
      data: {
        label: 'RESEARCH PLANNER',
        subtitle: state.plan ? `Scope: ${state.plan.geographyScope}` : 'Synthesizing strategy...',
        role: 'planner',
        status: plannerStatus,
        onSelect: () => state.plan && onSelectItem({ type: 'plan', plan: state.plan }),
      },
    });

    calculatedEdges.push({
      id: 'edge-query-planner',
      source: 'node-query',
      target: 'node-planner',
      animated: state.status === 'planning',
      style: { stroke: '#64748b', strokeWidth: 1.5 },
    });

    // 3. Explorer Agent Node
    const explorerSources = state.sources.filter(s => s.discoveredBy === 'explorer');
    const explorerClaims = state.claims.filter(c => c.discoveredBy === 'explorer');
    let explorerStatus: NodeStatus = 'QUEUED';
    if (state.status === 'investigating') explorerStatus = 'RUNNING';
    else if (['arbitrating', 'visualizing', 'completed'].includes(state.status)) explorerStatus = 'COMPLETED';

    calculatedNodes.push({
      id: 'node-explorer',
      type: 'agentNode',
      position: { x: 120, y: 260 },
      data: {
        label: 'EXPLORER AGENT',
        subtitle: 'Breadth & Discovery Vector',
        role: 'explorer',
        status: explorerStatus,
        metrics: {
          searches: Math.max(1, explorerSources.length),
          sources: explorerSources.length,
          claims: explorerClaims.length,
        },
        onSelect: () => onSelectItem({ type: 'agent', role: 'explorer', sources: explorerSources, claims: explorerClaims }),
      },
    });

    calculatedEdges.push({
      id: 'edge-planner-explorer',
      source: 'node-planner',
      target: 'node-explorer',
      animated: state.status === 'investigating',
      style: { stroke: '#06b6d4', strokeWidth: 2 },
    });

    // 4. Investigator Agent Node
    const investigatorSources = state.sources.filter(s => s.discoveredBy === 'investigator');
    const investigatorClaims = state.claims.filter(c => c.discoveredBy === 'investigator');
    let investigatorStatus: NodeStatus = 'QUEUED';
    if (state.status === 'investigating') investigatorStatus = 'RUNNING';
    else if (['arbitrating', 'visualizing', 'completed'].includes(state.status)) investigatorStatus = 'COMPLETED';

    calculatedNodes.push({
      id: 'node-investigator',
      type: 'agentNode',
      position: { x: 640, y: 260 },
      data: {
        label: 'INVESTIGATOR AGENT',
        subtitle: 'Adversarial & Verification Vector',
        role: 'investigator',
        status: investigatorStatus,
        metrics: {
          searches: Math.max(1, investigatorSources.length),
          sources: investigatorSources.length,
          claims: investigatorClaims.length,
        },
        onSelect: () => onSelectItem({ type: 'agent', role: 'investigator', sources: investigatorSources, claims: investigatorClaims }),
      },
    });

    calculatedEdges.push({
      id: 'edge-planner-investigator',
      source: 'node-planner',
      target: 'node-investigator',
      animated: state.status === 'investigating',
      style: { stroke: '#6366f1', strokeWidth: 2 },
    });

    // 5. Dynamic Source Nodes for Explorer
    explorerSources.slice(0, 3).forEach((src, idx) => {
      const srcId = `src-node-exp-${idx}`;
      calculatedNodes.push({
        id: srcId,
        type: 'sourceNode',
        position: { x: 20 + idx * 110, y: 400 + (idx % 2) * 50 },
        data: {
          domain: src.domain,
          title: src.title,
          authority: src.authority,
          scraped: src.scrapedSuccessfully,
          onSelect: () => onSelectItem({ type: 'source', source: src }),
        },
      });
      calculatedEdges.push({
        id: `edge-exp-${srcId}`,
        source: 'node-explorer',
        target: srcId,
        style: { stroke: '#0891b2', strokeWidth: 1.2 },
      });
    });

    // 6. Dynamic Source Nodes for Investigator
    investigatorSources.slice(0, 3).forEach((src, idx) => {
      const srcId = `src-node-inv-${idx}`;
      calculatedNodes.push({
        id: srcId,
        type: 'sourceNode',
        position: { x: 620 + idx * 110, y: 400 + (idx % 2) * 50 },
        data: {
          domain: src.domain,
          title: src.title,
          authority: src.authority,
          scraped: src.scrapedSuccessfully,
          onSelect: () => onSelectItem({ type: 'source', source: src }),
        },
      });
      calculatedEdges.push({
        id: `edge-inv-${srcId}`,
        source: 'node-investigator',
        target: srcId,
        style: { stroke: '#4f46e5', strokeWidth: 1.2 },
      });
    });

    // 7. Research Arbiter / Judge Node
    let arbiterStatus: NodeStatus = 'QUEUED';
    if (state.status === 'arbitrating') arbiterStatus = 'RUNNING';
    else if (state.conflicts.length > 0 && state.conflicts.some(c => c.resolutionStatus === 'PENDING')) arbiterStatus = 'CONFLICT';
    else if (['visualizing', 'completed'].includes(state.status)) arbiterStatus = 'COMPLETED';

    calculatedNodes.push({
      id: 'node-arbiter',
      type: 'agentNode',
      position: { x: 380, y: 550 },
      data: {
        label: 'RESEARCH ARBITER / JUDGE',
        subtitle: 'Multi-Source Evidence Reconciliation',
        role: 'arbiter',
        status: arbiterStatus,
        metrics: {
          searches: state.conflicts.filter(c => c.escalatedToWebSearch).length,
          sources: state.sources.length,
          claims: state.claims.length,
        },
        onSelect: () => onSelectItem({ type: 'arbiter', conflicts: state.conflicts, stats: state.stats }),
      },
    });

    calculatedEdges.push({
      id: 'edge-explorer-arbiter',
      source: 'node-explorer',
      target: 'node-arbiter',
      animated: state.status === 'arbitrating',
      style: { stroke: '#06b6d4', strokeWidth: 1.8 },
    });

    calculatedEdges.push({
      id: 'edge-investigator-arbiter',
      source: 'node-investigator',
      target: 'node-arbiter',
      animated: state.status === 'arbitrating',
      style: { stroke: '#6366f1', strokeWidth: 1.8 },
    });

    // 8. Dynamic Conflict & Escalation Nodes
    state.conflicts.slice(0, 2).forEach((cfl, idx) => {
      const cflId = `cfl-node-${idx}`;
      calculatedNodes.push({
        id: cflId,
        type: 'conflictNode',
        position: { x: 190 + idx * 360, y: 690 },
        data: {
          entityName: cfl.entityName,
          fieldName: cfl.fieldName,
          status: cfl.resolutionStatus === 'RESOLVED' ? 'RESOLVED' : 'UNRESOLVED',
          onSelect: () => onSelectItem({ type: 'conflict', conflict: cfl }),
        },
      });

      calculatedEdges.push({
        id: `edge-arbiter-${cflId}`,
        source: 'node-arbiter',
        target: cflId,
        style: { stroke: '#f43f5e', strokeWidth: 1.8, strokeDasharray: '4 4' },
      });

      if (cfl.escalatedToWebSearch) {
        const escId = `esc-node-${idx}`;
        calculatedNodes.push({
          id: escId,
          type: 'escalationNode',
          position: { x: 190 + idx * 360, y: 810 },
          data: {
            query: cfl.targetedQuery,
            onSelect: () => onSelectItem({ type: 'escalation', conflict: cfl }),
          },
        });

        calculatedEdges.push({
          id: `edge-cfl-${escId}`,
          source: cflId,
          target: escId,
          animated: true,
          style: { stroke: '#f59e0b', strokeWidth: 1.5 },
        });

        // Route back to Arbiter resolved
        calculatedEdges.push({
          id: `edge-${escId}-resolved`,
          source: escId,
          target: 'node-arbiter',
          style: { stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '2 2' },
        });
      }
    });

    // 9. Final Verified Dataset Node
    if (['visualizing', 'completed'].includes(state.status)) {
      calculatedNodes.push({
        id: 'node-dataset',
        type: 'agentNode',
        position: { x: 380, y: 920 },
        data: {
          label: 'VERIFIED DATASET',
          subtitle: `${state.entities.length} Entities Audited`,
          role: 'planner',
          status: 'COMPLETED',
          metrics: {
            sources: state.sources.length,
            claims: state.claims.length,
          },
          onSelect: () => onSelectItem({ type: 'dataset', entities: state.entities }),
        },
      });

      calculatedEdges.push({
        id: 'edge-arbiter-dataset',
        source: 'node-arbiter',
        target: 'node-dataset',
        style: { stroke: '#10b981', strokeWidth: 2 },
      });
    }

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [state, onSelectItem]);

  return (
    <div className="w-full h-full min-h-[560px] bg-neutral-950/70 relative rounded-xl border border-neutral-800/80 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#262626" />
        <Controls 
          className="!bg-neutral-900 !border !border-neutral-800 !rounded-lg !fill-neutral-300" 
          showInteractive={false} 
        />
      </ReactFlow>

      {/* Floating Canvas Watermark/Status */}
      <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-800 text-[11px] font-mono text-neutral-400">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
        <span>Live Agent Arena Graph</span>
      </div>
    </div>
  );
}
