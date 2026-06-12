import { useState } from "react";
import { DriftAlert } from "../types";
import { 
  ShieldAlert, 
  Terminal, 
  Play, 
  CheckCircle2, 
  Flame, 
  RefreshCw, 
  ArrowRight
} from "lucide-react";

interface DriftMonitoringProps {
  alerts: DriftAlert[];
  onRemediate: (alertId: string) => void;
}

export default function DriftMonitoring({ alerts, onRemediate }: DriftMonitoringProps) {
  const [remediatingId, setRemediatingId] = useState<string | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  // Playbook execution terminal stimulation
  const executePlaybook = async (alert: DriftAlert) => {
    setRemediatingId(alert.id);
    setLogMessages([]);
    setIsDone(false);

    const logs = [
      `[SENTINELX-INIT]: Triggering Sovereign Auto-Remedy Playbook for ${alert.system}`,
      `[RESOLVER]: Connecting credentials via Secure API Broker to root endpoint / SUCCESS`,
      `[FETCHER]: Comparing Design-Time Policy against Operational Reality...`,
      `[ANALYST]: POLICY DIFFERENCES DETECTED: expected "${alert.expected}" vs actual "${alert.actual}"`,
      `[REMEDIATOR]: Revoking unapproved temporary exclusions and clearing AD exemptions...`,
      `[SIEM-PROVISION]: Appending strict compliance query constraints to firewalls...`,
      `[VALIDATOR]: Performing cryptographic audit validation pass / VERIFIED`,
      `[SENTINELX-SUCCESS]: Control aligned completely. Closing Drift ID ${alert.id}.`
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setLogMessages((prev) => [...prev, logs[i]]);
    }

    setIsDone(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onRemediate(alert.id);
    setRemediatingId(null);
    setLogMessages([]);
    setIsDone(false);
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative" id="drift-monitoring-panel">
      {/* Title & Banner */}
      <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="bg-blue-950/40 text-blue-400 border border-blue-900/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            Sovereign Innovation Matrix
          </span>
          <h3 className="text-xl font-sans font-semibold text-white tracking-tight mt-1">
            Regulatory & Control Drift Engine
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Detects silent decay of security controls and policy compromises over time before audits fail.
          </p>
        </div>
        <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-right">
          <div className="text-[10px] text-zinc-500 font-mono uppercase">ACTIVE DRIFTS TRIPPED</div>
          <div className="text-xl font-mono font-bold text-rose-500 animate-pulse">{alerts.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Side: Active Drift Alerts & Terminal */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="text-xs font-mono font-bold text-zinc-500 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Live Drift Exceptions & System Disalignment Log
          </div>

          {alerts.length === 0 ? (
            <div className="bg-zinc-950/50 border border-zinc-800 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-white">All Governance Controls Aligned</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Continuous comparison matches expected designs to actual logging telemetry. No drift incidents discovered.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="bg-zinc-950 border border-zinc-800/70 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 transition-all shadow-inner relative overflow-hidden"
                  id={`drift-alert-${alert.id}`}
                >
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-rose-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold font-sans text-rose-400 uppercase bg-rose-950/40 border border-rose-900/40 px-1.5 py-0.5 rounded">
                        {alert.severity} Concern
                      </span>
                      <span className="text-xs font-mono text-zinc-500">Node: {alert.system}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white mt-1.5">{alert.control}</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs font-mono border-t border-zinc-900/80 pt-2 text-zinc-400">
                      <div>
                        <span className="text-zinc-600 block sm:inline">Design-Time Target:</span> {alert.expected}
                      </div>
                      <div>
                        <span className="text-zinc-600 block sm:inline">Operational Status:</span> <span className="text-amber-400">{alert.actual}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 justify-end">
                    <button
                      disabled={remediatingId !== null}
                      onClick={() => executePlaybook(alert)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-450 border border-emerald-500/20 bg-emerald-950/25 hover:bg-emerald-900/50 disabled:opacity-50 px-3 py-2 rounded-lg transition-all cursor-pointer"
                      id={`remediate-btn-${alert.id}`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      Remediate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Remediation Live Term Container */}
          {remediatingId && (
            <div className="bg-black/95 rounded-2xl border border-zinc-800 p-4 font-mono text-xs flex flex-col gap-1.5 shadow-2xl relative" id="auto-remedy-terminal">
              <div className="flex items-center justify-between text-zinc-500 uppercase font-bold text-[10px] tracking-wide border-b border-zinc-900 pb-2 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Auto-Remedy Playbook Terminal
                </span>
                <span>Active thread</span>
              </div>
              <div className="flex flex-col gap-1 text-zinc-300 max-h-[140px] overflow-y-auto">
                {logMessages.map((msg, idx) => (
                  <div key={idx} className="leading-relaxed font-mono">
                    <span className="text-blue-500 font-bold">&gt;</span> {msg}
                  </div>
                ))}
                {!isDone && (
                  <div className="flex items-center gap-1.5 text-zinc-500 mt-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Executing alignment scripts...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: The Classic Drift Pattern step timeline */}
        <div className="xl:col-span-5 bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-500 mb-2">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">The Classic Drift Pattern</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Governance vectors decay silently because banks only test controls during periodic annual audits. Exception layers bypass policy parameters without security board sign-off.
            </p>

            <div className="flex flex-col gap-3 font-sans relative">
              {/* Connector line for steps */}
              <div className="absolute left-3.5 top-4 bottom-4 w-0.5 bg-zinc-800" />

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7.5 h-7.5 rounded-full bg-zinc-800 border border-zinc-700 font-mono text-xs font-bold text-blue-400 flex items-center justify-center">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">MFA Enforced at Deployment</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Perfect compliance profile measured on initial validation sweep.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7.5 h-7.5 rounded-full bg-zinc-800 border border-zinc-700 font-mono text-xs font-bold text-amber-500 flex items-center justify-center">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Exemptions Accumulate</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">VIPs or devs bypass requirements "temporarily" to bypass blockers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7.5 h-7.5 rounded-full bg-zinc-800 border border-zinc-700 font-mono text-xs font-bold text-rose-500 flex items-center justify-center">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">Posture Decay</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Exceptions run indefinitely. Telemetry becomes inconsistent and blind.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7.5 h-7.5 rounded-full bg-rose-950 border border-rose-800 font-mono text-xs font-bold text-rose-300 flex items-center justify-center animate-pulse">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">Audit & Security Failure</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">A security breach or formal annual compliance examination fails.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-900 text-xs text-zinc-500 leading-relaxed font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            SentinelX solves this by continuously comparing design-time goals via SIEM streams.
          </div>
        </div>
      </div>
    </div>
  );
}
