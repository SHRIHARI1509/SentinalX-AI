import { useState } from "react";
import { DigitalTwinNode, DigitalTwinLink } from "../types";
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
}

export default function DigitalTwin({ nodes, links, onTriggerDrift, onClearDrift }: DigitalTwinProps) {
  const [selectedNode, setSelectedNode] = useState<DigitalTwinNode | null>(null);

  // Hardcode coordinates for high-fidelity custom visual flow matching slide 7
  const nodeCoords: Record<string, { x: number; y: number; label: string }> = {
    "Mobile Banking App": { x: 80, y: 150, label: "Mobile App" },
    "Authentication API": { x: 260, y: 150, label: "Auth API" },
    "IAM System": { x: 440, y: 150, label: "IAM System" },
    "Fraud Detection": { x: 620, y: 150, label: "Fraud Engine" },
    "Audit Logging Service": { x: 800, y: 150, label: "Audit Ledger" },
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
        <div className="flex items-center gap-2 bg-zinc-950/60 px-3 py-1.5 rounded-lg border border-zinc-805 text-xs text-zinc-400">
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
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Links/Dependency Lines (Curved/Bézier or direct) */}
            {links.map((link, idx) => {
              const start = nodeCoords[link.source];
              const end = nodeCoords[link.target];
              if (!start || !end) return null;

              // Determine system vulnerability based on parent/child critical states
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              const isDrifting = sourceNode?.status === "CRITICAL" || targetNode?.status === "CRITICAL";

              return (
                <g key={idx}>
                  {/* Glowing core path */}
                  <path
                    d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                    stroke={isDrifting ? "url(#gline-active)" : "url(#gline-healthy)"}
                    strokeWidth={isDrifting ? "3" : "2"}
                    fill="none"
                    filter="url(#glow)"
                    className={isDrifting ? "stroke-amber-500/40" : "stroke-blue-500/20"}
                  />
                  {/* Dynamic Flow particle indicators */}
                  <circle r="4" fill={isDrifting ? "#f59e0b" : "#60a5fa"}>
                    <animateMotion
                      dur={isDrifting ? "1.5s" : "3s"}
                      repeatCount="indefinite"
                      path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Node HTML Overlays */}
          {nodes.map((node) => {
            const coords = nodeCoords[node.id];
            if (!coords) return null;

            const isSelected = selectedNode?.id === node.id;
            const statusColor = 
              node.status === "CRITICAL" ? "border-rose-500 bg-rose-950/20 shadow-rose-950/50" :
              node.status === "WARNING" ? "border-amber-500 bg-amber-950/25 shadow-amber-950/40" :
              "border-blue-500/40 bg-zinc-950 shadow-blue-950/35";

            const ringGlow = 
              node.status === "CRITICAL" ? "ring-2 ring-rose-500 animate-pulse" :
              node.status === "WARNING" ? "ring-1 ring-amber-500" :
              "group-hover:ring-1 group-hover:ring-blue-400";

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${coords.x - 70}px`, top: `${coords.y - 70}px` }}
                className={`absolute w-36 h-36 rounded-full flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all duration-300 border backdrop-blur group z-20 ${statusColor} ${ringGlow} ${isSelected ? "scale-105 ring-2 ring-blue-500 border-blue-500 bg-zinc-950 shadow-2xl" : "hover:scale-102"} shadow-lg`}
                id={`node-${node.id.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {/* Micro-pulsing border for active concerns */}
                {node.status === "CRITICAL" && (
                  <span className="absolute inset-0 w-full h-full rounded-full border-4 border-rose-500/20 animate-ping pointer-events-none" />
                )}

                <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800 mb-1.5 transition-transform duration-300 group-hover:scale-110">
                  {getNodeIcon(node.id, node.status)}
                </div>
                <div className="text-xs font-semibold font-sans text-white truncate max-w-full leading-tight">
                  {coords.label}
                </div>
                <div className="text-[10px] uppercase font-mono text-zinc-500 mt-1">
                  {node.type}
                </div>
                <div className="mt-1">
                  {node.status === "CRITICAL" ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                  ) : node.status === "WARNING" ? (
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Node Configuration Custom Inspector */}
      {selectedNode ? (
        <div className="mt-4 bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 slide-in relative transition-all" id="node-inspector">
          {selectedNode.status === "CRITICAL" && (
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l-2xl" />
          )}
          {selectedNode.status === "WARNING" && (
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-2xl" />
          )}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase">SYSTEM INSPECTION PROTOCOL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              {getStatusBadge(selectedNode.status)}
            </div>
            
            <h4 className="text-lg font-medium text-white flex items-center gap-2">
              {selectedNode.id}
              <span className="text-sm font-normal text-zinc-500">({selectedNode.owner})</span>
            </h4>

            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              {selectedNode.id === "Mobile Banking App" && "Handles digital retail ledger queries, biometric session keys, and front-facing transaction payloads."}
              {selectedNode.id === "Authentication API" && "Authenticates OAuth tokens, enforces cryptographic token validity, and serves as main security gateway."}
              {selectedNode.id === "IAM System" && "Coordinates role-based identity boundaries, AD group controls, key store configurations, and administrative token access."}
              {selectedNode.id === "Fraud Detection" && "Enforces real-time ML anomaly scoring rules, velocity tracking filters, and transaction limits."}
              {selectedNode.id === "Audit Logging Service" && "Captures secure, immutable append-only records of all operational ledger entries to meet SEBI archiving standards."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-zinc-900 text-xs font-mono text-zinc-500">
              <div>
                <span className="text-zinc-650">Node Token:</span> {selectedNode.id.toUpperCase().replace(/\s+/g, '_')}_SEC_V1
              </div>
              <div>
                <span className="text-zinc-650">Compliance Category:</span> {selectedNode.id === "IAM System" || selectedNode.id === "Authentication API" ? "Access Control" : selectedNode.id === "Mobile Banking App" ? "Application Security" : "Operational Logging"}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
            {selectedNode.status === "CRITICAL" ? (
              <button
                onClick={() => {
                  onClearDrift(selectedNode.id);
                  setSelectedNode({ ...selectedNode, status: "HEALTHY" });
                }}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-zinc-950 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg cursor-pointer"
                id="mitigate-drift-btn"
              >
                <Zap className="w-4 h-4 fill-current" />
                Trigger Auto-Remedy
              </button>
            ) : (
              <button
                onClick={() => {
                  onTriggerDrift(selectedNode.id);
                  setSelectedNode({ ...selectedNode, status: "CRITICAL" });
                }}
                className="flex items-center justify-center gap-2 border border-rose-500/30 bg-rose-950/40 hover:bg-rose-900/60 active:scale-95 text-rose-300 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer animate-fade-in"
                id="inject-drift-btn"
              >
                <ShieldAlert className="w-4 h-4" />
                Simulate System Drift
              </button>
            )}
            <button
              onClick={() => setSelectedNode(null)}
              className="px-4 py-2.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 rounded-lg text-sm font-semibold transition-all text-center cursor-pointer"
            >
              Close Inspector
            </button>
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
