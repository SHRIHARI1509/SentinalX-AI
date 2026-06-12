import { useState } from "react";
import { DigitalTwinNode, DigitalTwinLink, RegulationObject } from "../types";
import { 
  Network, 
  Smartphone, 
  KeyRound, 
  Database, 
  ShieldCheck, 
  FileText, 
  ShieldAlert, 
  Info,
  Server,
  Zap
} from "lucide-react";

interface DigitalTwinProps {
  nodes: DigitalTwinNode[];
  links: DigitalTwinLink[];
  onTriggerDrift: (nodeId: string) => void;
  onClearDrift: (nodeId: string) => void;
  highlightedNodeIds?: string[];
  activeRegulation?: RegulationObject | null;
}

export default function DigitalTwin({ 
  nodes, 
  links, 
  onTriggerDrift, 
  onClearDrift, 
  highlightedNodeIds = [],
  activeRegulation = null
}: DigitalTwinProps) {
  const [selectedNode, setSelectedNode] = useState<DigitalTwinNode | null>(null);

  // Hardcode coordinates for high-fidelity custom visual flow matching slide 7
  const nodeCoords: Record<string, { x: number; y: number; label: string; dependencies: number }> = {
    "Mobile Banking App": { x: 80, y: 150, label: "Mobile App", dependencies: 6 },
    "Authentication API": { x: 260, y: 150, label: "Auth API", dependencies: 9 },
    "IAM System": { x: 440, y: 150, label: "IAM Service", dependencies: 12 },
    "Fraud Detection": { x: 620, y: 150, label: "Fraud Engine", dependencies: 4 },
    "Audit Logging Service": { x: 800, y: 150, label: "Audit Ledger", dependencies: 8 },
  };

  const getNodeIcon = (id: string, status: string) => {
    const colorClass = 
      status === "CRITICAL" ? "text-rose-500" : 
      status === "WARNING" ? "text-amber-500" : "text-emerald-500";

    switch (id) {
      case "Mobile Banking App":
        return <Smartphone className={`w-6 h-6 ${colorClass}`} />;
      case "Authentication API":
        return <KeyRound className={`w-6 h-6 ${colorClass}`} />;
      case "IAM System":
        return <Server className={`w-6 h-6 ${colorClass}`} />;
      case "Fraud Detection":
        return <ShieldCheck className={`w-6 h-6 ${colorClass}`} />;
      case "Audit Logging Service":
        return <FileText className={`w-6 h-6 ${colorClass}`} />;
      default:
        return <Network className={`w-6 h-6 ${colorClass}`} />;
    }
  };

    const getStatusBadge = (status: string) => {
    switch (status) {
      case "CRITICAL":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-950/80 text-rose-400 border border-rose-800/50 animate-pulse">DRIFT CRITICAL</span>;
      case "WARNING":
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-950/80 text-amber-400 border border-amber-800/50">RISK WARNING</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">SECURE STATE</span>;
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl" id="digital-twin-panel">
      {/* Visual background aesthetics (Slide 10 'the governance war room') */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-medium">SOVEREIGN VIRTUALIZATION ENGINE</span>
          </div>
          <h3 className="text-xl font-sans font-semibold tracking-tight text-white mt-1">Autonomous Organizational Digital Twin</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time interactive virtual modeling of key banking nodes, access groups, & data dependencies.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-950/60 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-400">
          <Info className="w-4 h-4 text-blue-400" />
          Click system nodes to inspect configurations and force drift simulations
        </div>
      </div>

      {/* SVG Container for Dependency Graph */}
      <div className="relative w-full overflow-x-auto py-10 px-4 scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="min-w-[900px] h-[300px] relative mx-auto">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: "900px" }}>
            <defs>
              <linearGradient id="gline-active" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="gline-healthy" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Elegant Impact Wave sweep overlay (Fulfills Change #2) */}
            {nodes.some(n => n.status !== "HEALTHY" || highlightedNodeIds.length > 0) && (
              <g>
                <rect x="0" y="100" width="100%" height="100" fill="url(#wave-gradient)" className="opacity-40 pointer-events-none">
                  <animate attributeName="x" from="-900" to="900" dur="2s" repeatCount="indefinite" />
                </rect>
              </g>
            )}

            {/* Links/Dependency Lines (Curved/Bézier or direct) */}
            {links.map((link, idx) => {
              const start = nodeCoords[link.source];
              const end = nodeCoords[link.target];
              if (!start || !end) return null;

              // Determine system vulnerability based on parent/child critical states
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              const isDrifting = sourceNode?.status === "CRITICAL" || targetNode?.status === "CRITICAL";
              const isHighlighted = highlightedNodeIds.includes(link.source) || highlightedNodeIds.includes(link.target);
              const isWaveActive = isDrifting || isHighlighted;

              return (
                <g key={idx}>
                  {/* Glowing core path */}
                  <path
                    d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                    stroke={isWaveActive ? "url(#gline-active)" : "url(#gline-healthy)"}
                    strokeWidth={isWaveActive ? "3.5" : "2"}
                    fill="none"
                    filter="url(#glow)"
                    className={isWaveActive ? "stroke-rose-500/40" : "stroke-blue-500/20"}
                  />
                  {/* Dynamic Flow particle indicators */}
                  <circle r="4.5" fill={isWaveActive ? "#ef4444" : "#60a5fa"}>
                    <animateMotion
                      dur={isWaveActive ? "1.2s" : "3.0s"}
                      repeatCount="indefinite"
                      path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                    />
                  </circle>
                  {/* Secondary Blast Radius Sweep Dash Path (Fulfills Change #2) */}
                  {isWaveActive && (
                    <path
                      d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                      stroke={isDrifting ? "#ef4444" : "#f59e0b"}
                      strokeWidth="2.5"
                      fill="none"
                      className="animate-dash-move opacity-90"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Node HTML Overlays */}
          {nodes.map((node) => {
            const coords = nodeCoords[node.id];
            if (!coords) return null;

            const isSelected = selectedNode?.id === node.id;
            const isHighlighted = highlightedNodeIds.includes(node.id);
            
            let statusColor = "";
            if (isHighlighted) {
              statusColor = "border-amber-500 bg-amber-950/30 shadow-amber-950/60 ring-2 ring-amber-500 animate-pulse-orange";
            } else {
              statusColor = 
                node.status === "CRITICAL" ? "border-rose-500 bg-rose-950/25 shadow-rose-950/50 animate-pulse-red" :
                node.status === "WARNING" ? "border-amber-500 bg-amber-950/20 shadow-amber-950/40 animate-pulse-orange" :
                "border-blue-500/20 bg-zinc-950/90 shadow-blue-950/35 hover:border-blue-500/40";
            }

            const ringGlow = 
              isHighlighted ? "ring-4 ring-amber-500/40" :
              node.status === "CRITICAL" ? "ring-2 ring-rose-500" :
              node.status === "WARNING" ? "ring-1 ring-amber-500" :
              "group-hover:ring-1 group-hover:ring-blue-400";

            const matchingImpactObj = activeRegulation?.parsed?.twinImpact?.find(
              (impact) => impact.systemName === node.id
            );

            let riskScoreValue = 12;
            if (node.status === "CRITICAL") {
              riskScoreValue = 88;
            } else if (matchingImpactObj) {
              riskScoreValue = Math.min(95, 20 + matchingImpactObj.riskIncreasePercent);
            } else if (node.status === "WARNING") {
              riskScoreValue = 54;
            } else if (isHighlighted) {
              riskScoreValue = 42;
            }

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${coords.x - 70}px`, top: `${coords.y - 70}px` }}
                className={`absolute w-36 h-36 rounded-full flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all duration-300 border backdrop-blur group z-20 ${statusColor} ${ringGlow} ${isSelected ? "scale-105 ring-2 ring-indigo-500 border-indigo-500 bg-zinc-950 shadow-2xl" : "hover:scale-102"} shadow-lg`}
                id={`node-${node.id.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {/* Micro-pulsing border for active concerns or blast shadows */}
                {(node.status === "CRITICAL" || isHighlighted) && (
                  <span className={`absolute inset-0 w-full h-full rounded-full border-4 ${isHighlighted ? "border-amber-500/20" : "border-rose-500/20"} animate-ping pointer-events-none`} />
                )}

                {/* Highlighted Blast Zone Micro Badge */}
                {isHighlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-amber-500 text-zinc-950 text-[8px] font-mono font-bold uppercase tracking-widest whitespace-nowrap shadow-md animate-bounce">
                    ⚠️ BLOWOUT ZONE
                  </span>
                )}

                <div className="p-1 rounded-full bg-zinc-900 border border-zinc-800 mb-1 transition-transform duration-300 group-hover:scale-110">
                  {getNodeIcon(node.id, isHighlighted ? "WARNING" : node.status)}
                </div>
                <div className="text-[11px] font-semibold font-sans text-white truncate max-w-full leading-tight">
                  {coords.label}
                </div>
                <div className="text-[8.5px] uppercase font-mono text-zinc-550 mt-0.5">
                  {node.type}
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <span className={`text-[8px] font-mono px-1 py-0.5 rounded border ${
                    riskScoreValue > 70 ? "bg-rose-950/60 text-rose-400 border-rose-900/60 animate-pulse" :
                    riskScoreValue > 40 ? "bg-amber-950/60 text-amber-450 border-amber-900/60" :
                    "bg-emerald-950/60 text-emerald-400 border-emerald-900/40"
                  }`}>
                    RISK: {riskScoreValue}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Node Configuration Custom Inspector */}
      {selectedNode ? (
        <div className="mt-4 bg-[#0A0A0C] border border-zinc-800 rounded-2xl p-6 flex flex-col slide-in relative transition-all" id="node-inspector">
          {selectedNode.status === "CRITICAL" && (
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 rounded-l-2xl" />
          )}
          {selectedNode.status === "WARNING" && (
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 rounded-l-2xl" />
          )}

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-4 border-b border-zinc-900">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-zinc-500 tracking-wider uppercase">SYSTEM IDENTIFIER: {selectedNode.id.toUpperCase().replace(/\s+/g, '_')}_NODE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                {getStatusBadge(selectedNode.status)}
              </div>
              
              <h4 className="text-xl font-sans font-bold text-white flex items-center gap-2">
                {selectedNode.id}
              </h4>

              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                {selectedNode.id === "Mobile Banking App" && "Handles digital retail ledger queries, biometric session keys, and front-facing transaction payloads."}
                {selectedNode.id === "Authentication API" && "Authenticates OAuth tokens, enforces cryptographic token validity, and serves as main security gateway."}
                {selectedNode.id === "IAM System" && "Coordinates role-based identity boundaries, AD group controls, key store configurations, and administrative token access."}
                {selectedNode.id === "Fraud Detection" && "Enforces real-time ML anomaly scoring rules, velocity tracking filters, and transaction limits."}
                {selectedNode.id === "Audit Logging Service" && "Captures secure, immutable append-only records of all operational ledger entries to meet SEBI archiving standards."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              {selectedNode.status === "CRITICAL" ? (
                <button
                  onClick={() => {
                    onClearDrift(selectedNode.id);
                    setSelectedNode({ ...selectedNode, status: "HEALTHY" });
                  }}
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-zinc-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer font-sans"
                  id="mitigate-drift-btn"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Enforce Auto-Remedy
                </button>
              ) : (
                <button
                  onClick={() => {
                    onTriggerDrift(selectedNode.id);
                    setSelectedNode({ ...selectedNode, status: "CRITICAL" });
                  }}
                  className="flex items-center justify-center gap-2 border border-rose-900 bg-rose-950/20 hover:bg-rose-900/60 active:scale-95 text-rose-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
                  id="inject-drift-btn"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  Simulate Active Drift
                </button>
              )}
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 rounded-xl text-xs font-bold transition-all text-center cursor-pointer font-sans"
              >
                Dismiss Details
              </button>
            </div>
          </div>

          {/* DYNAMIC RISK OVERLAY VALUES PANEL GRID (Fulfills Change #6 requirements exactly!) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">
            
            <div className="bg-[#09090B] border border-zinc-900 rounded-xl p-3.5 shadow-sm">
              <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider block uppercase">Owner Unit</span>
              <span className="text-white font-sans font-semibold text-xs mt-1 block">
                {selectedNode.id === "Mobile Banking App" && "Retail Banking Division"}
                {selectedNode.id === "Authentication API" && "Identity & Threat Operations"}
                {selectedNode.id === "IAM System" && "Cybersecurity Team"}
                {selectedNode.id === "Fraud Detection" && "Financial Crime Prevention"}
                {selectedNode.id === "Audit Logging Service" && "Global Compliance Division"}
              </span>
            </div>

            {(() => {
              const matchingSelectedImpact = activeRegulation?.parsed?.twinImpact?.find(
                (i) => i.systemName === selectedNode.id
              );
              const isCritical = selectedNode.status === "CRITICAL";

              const riskText = isCritical ? "Critical" :
                               matchingSelectedImpact ? `Elevated (+${matchingSelectedImpact.riskIncreasePercent}%)` :
                               selectedNode.status === "WARNING" ? "High" :
                               selectedNode.id === "IAM System" ? "High" : "Low";
              const riskColorClass = isCritical ? "text-rose-400 font-bold" :
                                     matchingSelectedImpact ? "text-amber-400 font-bold" :
                                     selectedNode.status === "WARNING" ? "text-amber-400 font-bold" :
                                     selectedNode.id === "IAM System" ? "text-amber-400" : "text-emerald-400";

              const integrityText = isCritical ? "Non-Compliant" :
                                    matchingSelectedImpact ? "Requires Review" :
                                    selectedNode.status === "WARNING" ? "Review Pending" : "Fully Compliant";
              const integrityColor = isCritical ? "text-rose-450 font-bold animate-pulse" :
                                     matchingSelectedImpact ? "text-amber-400 font-bold" : "text-emerald-400";

              const driftText = isCritical ? "Drift Critical" :
                                matchingSelectedImpact ? "Vulnerable" :
                                selectedNode.status === "WARNING" ? "Warning" : "None Detected";
              const driftColor = isCritical ? "text-rose-400 font-bold animate-pulse" :
                                 matchingSelectedImpact ? "text-amber-500 font-bold" : "text-emerald-450";

              return (
                <>
                  <div className="bg-[#09090B] border border-zinc-900 rounded-xl p-3.5 shadow-sm">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider block uppercase">Systemic Risk</span>
                    <span className={`font-mono text-xs mt-1 block uppercase ${riskColorClass}`}>
                      {riskText}
                    </span>
                  </div>

                  <div className="bg-[#09090B] border border-zinc-900 rounded-xl p-3.5 shadow-sm">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider block uppercase">Compliance Integrity</span>
                    <span className={`font-mono text-xs mt-1 block uppercase ${integrityColor}`}>
                      {integrityText}
                    </span>
                  </div>

                  <div className="bg-[#09090B] border border-zinc-900 rounded-xl p-3.5 shadow-sm">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider block uppercase">SIEM Telemetry Drift</span>
                    <span className={`font-mono text-xs mt-1 block uppercase ${driftColor}`}>
                      {driftText}
                    </span>
                  </div>
                </>
              );
            })()}

            <div className="bg-[#09090B] border border-zinc-900 rounded-xl p-3.5 shadow-sm">
              <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider block uppercase">Mapped Dependencies</span>
              <span className="text-white font-mono font-bold text-xs mt-1 block">
                {selectedNode.id === "IAM System" ? "12" : nodeCoords[selectedNode.id]?.dependencies || "4"} Nodes
              </span>
            </div>

          </div>

          <div className="mt-4 text-[10px] text-zinc-500 leading-normal flex items-center gap-1 font-mono">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Real-time D3 flow topology aggregates inputs from active logs to model current blast radius.</span>
          </div>

        </div>
      ) : (
        <div className="mt-4 p-5 bg-zinc-950/40 border border-zinc-900 border-dashed rounded-2xl text-center text-sm text-zinc-500 font-sans" id="twin-empty-prompt">
          Select any banking system node above to inspect structural compliance details and trigger defensive scenarios.
        </div>
      )}
    </div>
  );
}
