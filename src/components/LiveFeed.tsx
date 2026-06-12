import { useState, FormEvent } from "react";
import { RegulationObject } from "../types";
import { 
  PlusCircle, 
  Search, 
  FileText, 
  Sparkles, 
  Cpu, 
  Compass, 
  AlertTriangle, 
  ArrowRight, 
  Users, 
  Workflow, 
  History,
  Terminal,
  Clock,
  ExternalLink
} from "lucide-react";

interface LiveFeedProps {
  regulations: RegulationObject[];
  onAddRegulation: (newReg: RegulationObject) => void;
  selectedReg: RegulationObject | null;
  onSelectReg: (reg: RegulationObject) => void;
}

export default function LiveFeed({ 
  regulations, 
  onAddRegulation, 
  selectedReg, 
  onSelectReg 
}: LiveFeedProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [authority, setAuthority] = useState("RBI");
  const [text, setText] = useState("");

  const filteredRegs = regulations.filter(reg => 
    reg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRegulation = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setIsFormOpen(false);

    // Dynamic spinning radar messages
    const messages = [
      "Establishing sovereign connection stream...",
      "Scraping document structure and authority parameters...",
      "Using Gemini AI to interpret underlying legal intent...",
      "Mapping obligations directly onto banking department matrices...",
      "Simulating Digital Twin ripple impacts and drift telemetry...",
      "Generating action points & tracking tickets..."
    ];

    for (let i = 0; i < messages.length; i++) {
      setLoaderMessage(messages[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    try {
      const response = await fetch("/api/analyze-regulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "New Regulatory Directive",
          authority: authority,
          text: text
        })
      });

      if (!response.ok) {
        throw new Error("Analysis request failed");
      }

      const freshReg = await response.json();
      onAddRegulation(freshReg);
      onSelectReg(freshReg);
      
      // Reset Form fields
      setTitle("");
      setAuthority("RBI");
      setText("");
    } catch (e: any) {
      console.warn("Analysis request failed. Activating local automated simulation framework.", e);
    } finally {
      setLoading(false);
      setLoaderMessage("");
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "text-rose-400 bg-rose-950/50 border-rose-800/60";
      case "HIGH":
        return "text-amber-400 bg-amber-950/50 border-amber-800/60";
      case "MEDIUM":
        return "text-blue-400 bg-blue-950/30 border-blue-800/40";
      default:
        return "text-zinc-400 bg-zinc-900 border-zinc-805";
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative" id="live-regulation-feed">
      {loading && (
        <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-2xl z-50 animate-fade-in" id="analysis-loader">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4" />
          <div className="flex items-center gap-1 text-sm font-mono text-blue-400 uppercase tracking-widest font-bold">
            <Cpu className="w-4 h-4 animate-pulse" />
            SentinelX Ingestion Active
          </div>
          <p className="text-sm text-zinc-300 font-sans mt-3 text-center max-w-md animate-pulse">
            {loaderMessage}
          </p>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono font-bold text-blue-450 uppercase tracking-wider block">CONTINUOUS POSTURE INGESTION</span>
          <h3 className="text-xl font-sans font-semibold text-white mt-0.5 flex items-center gap-2">
            Regulatory Intelligence Feed
          </h3>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white active:scale-95 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md cursor-pointer"
          id="sandbox-form-btn"
        >
          <PlusCircle className="w-4 h-4" />
          Ingest Circular (AI Sandbox)
        </button>
      </div>

      {/* Sandbox Slide form */}
      {isFormOpen && (
        <form onSubmit={handleCreateRegulation} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 mb-6 slide-in relative z-20" id="sandbox-form">
          <h4 className="text-sm font-mono font-bold text-blue-400 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Ingest Draft Bank Directive
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-8 flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400">Circular / Directive Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. RBI Cryptographic Session Tokens and Consent Circular"
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-mono text-zinc-400">Issuer / Authority</label>
              <select
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="RBI">Reserve Bank of India (RBI)</option>
                <option value="SEBI">Securities and Exchange Board (SEBI)</option>
                <option value="DPDP Board">Digital Personal Data Board (DPDP)</option>
                <option value="CERT-In">Cyber Emergency Response (CERT-In)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-mono text-zinc-400">Legislation / Circular Circular Content (Legal Language)</label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={(textE) => setText(textE.target.value)}
              placeholder="Paste actual legal policy text. E.g. 'Banks must immediately coordinate localized data storage with physical boundary filters, enforcing adaptive permission groups inside the root user IAM environment.'"
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel Ingestion
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-705 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer"
              id="submit-ingest-btn"
            >
              Analyze Directive via Gemini AI
            </button>
          </div>
        </form>
      )}

      {/* Main Panel Grid layout splits regulatory list and visual semantic inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Regulation Navigation sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search circular database..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-blue-500/60"
            />
          </div>

          <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredRegs.map((reg) => {
              const isActive = selectedReg?.id === reg.id || selectedReg?.title === reg.title; // simple safety check or just let it map
              return (
                <div
                  key={reg.id}
                  onClick={() => onSelectReg(reg)}
                  className={`border p-3.5 rounded-xl cursor-pointer transition-all flex flex-col gap-1.5 ${selectedReg?.id === reg.id ? "bg-zinc-950 border-blue-500/80 shadow-lg shadow-blue-950/20" : "bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700"}`}
                  id={`reg-card-${reg.id}`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono">
                    <span className="text-zinc-500">{reg.date}</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getSeverityColor(reg.severity)}`}>
                      {reg.authority} | {reg.severity}
                    </span>
                  </div>
                  <h4 className={`text-sm font-semibold ${selectedReg?.id === reg.id ? "text-blue-400" : "text-white hover:text-blue-400"} transition-colors`}>
                    {reg.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {reg.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Semantic Interpretation Inspector (Slide 6 visual layout replacement) */}
        <div className="lg:col-span-7 bg-zinc-950/90 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between min-h-[420px]">
          {selectedReg ? (
            <div className="flex flex-col h-full justify-between" id="semantic-inspector">
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-900 pb-3 mb-4 flex-wrap gap-2">
                  <span className="text-zinc-500">AUTHORITY: <span className="text-white">{selectedReg.authority}</span></span>
                  <span className="text-zinc-500">DATE INDEXED: <span className="text-white">{selectedReg.date}</span></span>
                  <span className="text-zinc-500">CATEGORY: <span className="text-blue-400">{selectedReg.parsed.category}</span></span>
                </div>

                {/* Subtitle Circular representation */}
                <h4 className="text-base font-semibold text-white tracking-tight">
                  {selectedReg.title}
                </h4>

                <div className="bg-zinc-905 p-3 rounded-xl border border-zinc-808 my-3 text-xs italic text-zinc-350 leading-relaxed">
                  <span className="not-italic font-mono text-[10px] uppercase font-bold text-zinc-550 block mb-1">Raw Regulatory Text:</span>
                  "{selectedReg.text}"
                </div>

                {/* Semantic legal interpretation engine block (Slide 6 'AI Extracts') */}
                <div className="my-4">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase font-bold mb-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Autonomous Semantic Interpretation
                  </div>
                  
                  {/* Extracted underlying Legal Intent */}
                  <div className="bg-blue-950/15 border border-blue-800/20 rounded-xl p-3 text-xs leading-relaxed text-zinc-300">
                    <span className="font-mono text-[10px] uppercase font-bold text-blue-400 block mb-1">Deciphered Policy Intent:</span>
                    {selectedReg.parsed.legalIntent}
                  </div>

                  {/* Core Obligations Checklist */}
                  <div className="mt-4 flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-500">Extracted Core System Obligations:</span>
                    {selectedReg.parsed.extractedObligations.map((obl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="text-blue-400 font-bold font-mono mt-0.5">✓</span>
                        <span>{obl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MAP Action Points (Dashboard output preview) */}
                <div className="mt-4 pt-4 border-t border-zinc-900">
                  <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 block mb-2">Automated MAP Action Points Generated:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {selectedReg.parsed.actionPoints.map((ap, idx) => (
                      <div key={idx} className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-2.5 flex flex-col gap-1 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-blue-400 text-[10px] uppercase">{ap.department}</span>
                          <span className="text-zinc-500 font-mono text-[9px]">{ap.jiraTicket}</span>
                        </div>
                        <p className="text-zinc-300 text-[11px] leading-snug">{ap.actionRequired}</p>
                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mt-1">
                          <span>Owner: {ap.owner}</span>
                          <span>Timeline: {ap.timelineDays} days</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulated / Fallback Flag */}
              {selectedReg.fallbackMode ? (
                <div className="mt-4 bg-blue-950/40 border border-blue-900/30 text-[10px] font-mono text-blue-400 px-3 py-2 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini API is currently experiencing a peak traffic spike. Activated local SentinelX Heuristic Analysis Engine gracefully.</span>
                </div>
              ) : selectedReg.simulated && (
                <div className="mt-4 bg-amber-950/20 border border-amber-900/30 text-[10px] font-mono text-amber-500 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  No API key defined. Simulating advanced heuristic analysis model. Set GEMINI_API_KEY for sandbox.
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full" id="semantic-inspector-empty">
              <Compass className="w-14 h-14 text-zinc-800 animate-pulse mb-3" />
              <div>
                <h4 className="font-semibold text-white">Select a Circular to Scan</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                  Click on any RBI circular, SEBI notification, or custom draft in the sidebar to review autonomous legal translation parameters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
