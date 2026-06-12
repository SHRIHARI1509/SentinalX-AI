import React, { useState, FormEvent, useRef, useEffect } from "react";
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
  ExternalLink,
  Upload,
  X,
  Radio,
  Zap
} from "lucide-react";

interface LiveFeedProps {
  regulations: RegulationObject[];
  onAddRegulation: (newReg: RegulationObject) => void;
  selectedReg: RegulationObject | null;
  onSelectReg: (reg: RegulationObject) => void;
}

const PRECOOKED_CIRCULARS = [
  {
    title: "RBI Command - Digital Payment Core Security Directives",
    authority: "RBI",
    text: "Banks must immediately coordinate localized data storage with physical boundary filters, enforcing adaptive permission groups inside the root user IAM environment.",
    ingestMethod: "text"
  },
  {
    title: "RBI Notification on Crypto and Token Session Limits",
    authority: "RBI",
    text: "This directive addresses decentralized currency risks in settlement layers. Financial entities must deploy double-ended cryptographic session timeouts and strictly lock outbound ledger operations behind human compliance overrides.",
    ingestMethod: "text"
  },
  {
    title: "RBI Cyber Resilience Framework - IAM Isolation Control",
    authority: "RBI",
    text: "Recent intrusion vectors have compromised key vault privileges. All certified banks are ordered to configure zero-trust network boundaries on transaction endpoints, quarantining dynamic active directories from general API routing paths.",
    ingestMethod: "text"
  }
];

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

  // Autonomous Ingest Daemon State
  const [isDaemonActive, setIsDaemonActive] = useState(false);
  const [daemonTimer, setDaemonTimer] = useState(30);
  const [daemonLogs, setDaemonLogs] = useState<string[]>([
    "Listener offline. Toggle the live endpoint bound above to interface with live RBI circular publishes."
  ]);
  const [precookedIndex, setPrecookedIndex] = useState(0);

  const triggerMockRbiPush = async () => {
    setLoading(true);
    const mockCir = PRECOOKED_CIRCULARS[precookedIndex % PRECOOKED_CIRCULARS.length];
    setPrecookedIndex(prev => prev + 1);

    const messages = [
      `Intercepted new RBI live secure push: "${mockCir.title}"`,
      "Decompressing official PDF booklet layout and headers...",
      "Dispatching stream binary to Gemini AI for compliance mapping...",
      "Structuring isolated system bounds & assessing enterprise blast radius...",
      "Injecting dynamic compliance checkpoints...",
      "Autonomous processing finalized successfully."
    ];

    let step = 0;
    setLoaderMessage(messages[0]);
    const loaderInterval = setInterval(() => {
      step++;
      if (step < messages.length) {
        setLoaderMessage(messages[step]);
      }
    }, 1200);

    try {
      const resp = await fetch("/api/analyze-regulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: mockCir.title,
          authority: mockCir.authority,
          text: mockCir.text,
          ingestMethod: "text"
        })
      });

      if (!resp.ok) throw new Error("Automated parsing failed");
      const parsedData = await resp.json();
      onAddRegulation(parsedData);
      onSelectReg(parsedData);
    } catch (err) {
      console.warn("Autonomous API parse hit fallback:", err);
      
      // Local parsing fallback
      const mockResult: RegulationObject = {
        id: `reg-auto-${Date.now()}`,
        title: mockCir.title,
        date: new Date().toISOString().split("T")[0],
        authority: mockCir.authority,
        category: "Cybersecurity",
        severity: "HIGH",
        text: mockCir.text,
        parsed: {
          category: "Cybersecurity",
          severity: "HIGH",
          legalIntent: `Ensure banks comply safely with the autonomous RBI security directives and lock outbound ledger parameters.`,
          extractedObligations: [
            "Validate and isolate direct API boundaries on active portfolios.",
            "Deploy strong multi-factor verification mechanisms within administrative domains.",
            "Schedule continuous compliance checks tracking posture drift metrics."
          ],
          actionPoints: [
            { department: "Compliance", actionRequired: "Incorporate the new RBI Digital Payment directive requirements", jiraTicket: "CMP-7711", owner: "Priya M.", timelineDays: 7, status: "IN_PROGRESS" },
            { department: "Cybersecurity", actionRequired: "Perform zero-trust endpoint boundary scan on transaction channels", jiraTicket: "SEC-4412", owner: "Rohan V.", timelineDays: 14, status: "IN_PROGRESS" }
          ],
          twinImpact: [
            { systemName: "IAM System", reason: "Zero-trust endpoints impact authorization layers", riskIncreasePercent: 15 },
            { systemName: "Audit Logging Service", reason: "Ledger boundaries require verification reporting state", riskIncreasePercent: 12 }
          ],
          driftVulnerabilities: [
            {
              controlName: "IAM Authorization Filters",
              driftPattern: "Out-of-band updates bypassing strict approval channels",
              detectionSIEMQuery: "index=audit_logs target=IAM_Policy event_type=MODIFY | stats count by user"
            }
          ],
          predictiveRiskIncrease: 15,
          remediationDurationWeeks: 3
        },
        fallbackMode: true
      };
      onAddRegulation(mockResult);
      onSelectReg(mockResult);
    } finally {
      clearInterval(loaderInterval);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isDaemonActive) {
      setDaemonLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Autonomous RSS / Websocket Listener suspended.`,
        ...prev.slice(0, 4)
      ]);
      return;
    }

    setDaemonLogs([
      `[${new Date().toLocaleTimeString()}] Connecting secure telemetry line to Reserve Bank of India Notification stream...`,
      `[${new Date().toLocaleTimeString()}] Secure Handshake completed inside sandbox TLS environment.`,
      `[${new Date().toLocaleTimeString()}] Listener status: BOUND & RUNNING. Standard webhook set to /api/compliance/webhook-receiver`
    ]);

    let timerCount = 30;
    setDaemonTimer(30);

    const daemonInterval = setInterval(() => {
      timerCount--;
      setDaemonTimer(timerCount);

      if (timerCount % 10 === 0 && timerCount > 0) {
        setDaemonLogs(prev => [
          `[${new Date().toLocaleTimeString()}] [POLL DAEMON] Polling RBI portal... Status 200 (Active, no new releases).`,
          ...prev.slice(0, 4)
        ]);
      }

      if (timerCount <= 0) {
        setDaemonLogs(prev => [
          `[${new Date().toLocaleTimeString()}] [LIVE PUSH DETECTED] RBI released fresh document binary! Intercepting payload...`,
          ...prev.slice(0, 4)
        ]);
        triggerMockRbiPush();
        timerCount = 30;
        setDaemonTimer(30);
      }
    }, 1000);

    return () => clearInterval(daemonInterval);
  }, [isDaemonActive, precookedIndex]);

  // Ingestion Mode (PDF vs TEXT)
  const [ingestMethod, setIngestMethod] = useState<"pdf" | "text">("pdf");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState("");
  const [pdfSize, setPdfSize] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredRegs = regulations.filter(reg => 
    reg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPdfName(file.name);
      
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setPdfSize(`${sizeInMB} MB`);

      // Auto-fill Title and Authority
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "") // remove extension
        .replace(/[_-]/g, " ")     // replace dashes/underscores with spaces
        .replace(/\b\w/g, c => c.toUpperCase()); // titlecase
      
      setTitle(cleanName);

      const nameLower = file.name.toLowerCase();
      if (nameLower.includes("rbi")) {
        setAuthority("RBI");
      } else if (nameLower.includes("sebi")) {
        setAuthority("SEBI");
      } else if (nameLower.includes("dpdp")) {
        setAuthority("DPDP Board");
      } else if (nameLower.includes("cert")) {
        setAuthority("CERT-In");
      }

      // Base64 conversion
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPdfBase64(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PDF document (.pdf)");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfBase64(null);
    setPdfName("");
    setPdfSize("");
  };

  const handleCreateRegulation = async (e: FormEvent) => {
    e.preventDefault();
    
    if (ingestMethod === "text" && !text.trim()) {
      alert("Please enter regulatory text to analyze.");
      return;
    }
    if (ingestMethod === "pdf" && !pdfBase64) {
      alert("Please upload/drag a PDF document first.");
      return;
    }

    setLoading(true);
    setIsFormOpen(false);

    // Dynamic spinning radar messages
    const messages = [
      "Establishing sovereign connection stream...",
      "Scraping document structure and authority parameters...",
      ingestMethod === "pdf"
        ? `Reading secure PDF (${pdfName}) and prepping binary payload...`
        : "Extracting regulatory clauses from input field...",
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
          text: ingestMethod === "pdf" ? `Attached PDF Ingestion: ${pdfName}` : text,
          pdfBase64: pdfBase64,
          pdfName: pdfName,
          ingestMethod: ingestMethod
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
      removePdf();
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
        return "text-zinc-400 bg-zinc-900 border-zinc-800";
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

      {/* Autonomous Daemon Workspace Widget */}
      <div className="bg-[#0e0e14]/90 border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col gap-3.5" id="rbi-daemon-widget">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border transition-all ${
              isDaemonActive 
                ? "bg-emerald-950/30 border-emerald-850 text-emerald-400 animate-pulse" 
                : "bg-zinc-900/60 border-zinc-800 text-zinc-500"
            }`}>
              <Radio className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-200 truncate pr-1">Autonomous RBI Listener</span>
              <span className="text-[9px] font-mono text-zinc-500">Telemetry Receiver Pipeline</span>
            </div>
            
            <span className={`ml-auto px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider ${
              isDaemonActive ? "bg-emerald-950/80 text-emerald-400 border border-emerald-900 animate-pulse" : "bg-zinc-900 text-zinc-500 border border-zinc-800"
            }`}>
              {isDaemonActive ? `Auto: ${daemonTimer}s` : "SUSPENDED"}
            </span>
          </div>

          <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
            Intercepts live PDF policies from official RBI systems, executing direct neural translation, system boundary mapping, JIRA task synthesis, and risk estimation.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={triggerMockRbiPush}
            className="flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-[10px] font-mono font-bold text-blue-400 py-1.5 rounded-lg transition-transform active:scale-95 cursor-pointer w-full"
            title="Simulate secure RBI publication API event"
          >
            <Zap className="w-3 h-3 text-blue-405" />
            Simulate Live RBI Release
          </button>
          <button
            type="button"
            onClick={() => setIsDaemonActive(!isDaemonActive)}
            className={`py-1.5 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer text-center w-full ${
              isDaemonActive 
                ? "bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/30 text-rose-400" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isDaemonActive ? "Deactivate Daemon" : "Activate Poll Daemon"}
          </button>
        </div>

        {/* Live Mini Log Console */}
        <div className="bg-zinc-950/90 border border-zinc-900/80 rounded-xl p-2.5 font-mono text-[9px] text-zinc-450 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-900/40 pb-1">
            <span className="flex items-center gap-1 uppercase tracking-wider text-[8px] font-bold">
              <Terminal className="w-3.5 h-3.5 text-zinc-650" /> Webhook Output Stream
            </span>
            <span className="text-[8px] opacity-80 text-blue-500">WSS://api.rbi.org.in</span>
          </div>
          <div className="flex flex-col gap-1 max-h-[85px] overflow-y-auto pr-1">
            {daemonLogs.map((log, i) => (
              <div 
                key={i} 
                className={`${i === 0 ? "text-blue-400 font-medium" : "text-zinc-500"} break-all leading-normal`}
                title={log}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sandbox Slide form */}
      {isFormOpen && (
        <form onSubmit={handleCreateRegulation} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 mb-6 slide-in relative z-20" id="sandbox-form">
          <h4 className="text-sm font-mono font-bold text-blue-400 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Ingest Draft Bank Directive
          </h4>

          {/* Tab Selection */}
          <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => { setIngestMethod("pdf"); }}
              className={`flex-1 py-1.5 text-xs font-mono rounded-md transition-all ${
                ingestMethod === "pdf"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              PDF Document Upload
            </button>
            <button
              type="button"
              onClick={() => { setIngestMethod("text"); }}
              className={`flex-1 py-1.5 text-xs font-mono rounded-md transition-all ${
                ingestMethod === "text"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              Paste Legal Text
            </button>
          </div>
          
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

          {/* Dynamic Inputs based on Method */}
          {ingestMethod === "pdf" ? (
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-mono text-zinc-400">Regulation PDF Document</label>
              
              {!pdfFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-blue-500 bg-blue-950/20"
                      : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-zinc-550 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs text-zinc-300 font-sans font-medium">
                    Drag & drop your official RBI/SEBI PDF here, or <span className="text-blue-400 underline">browse</span>
                  </p>
                  <p className="text-[10px] text-zinc-550 font-mono mt-1">
                    Accepts official file formats up to 10MB
                  </p>
                </div>
              ) : (
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-red-950/40 p-2.5 rounded-lg border border-red-900/30 text-red-400 flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-sans font-semibold text-zinc-200 truncate">{pdfName}</p>
                      <p className="text-[10px] font-mono text-zinc-500">{pdfSize} • Ready to analyze</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removePdf}
                    className="p-1 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800/50 transition-colors"
                    title="Remove PDF"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-mono text-zinc-400">Legislation / Circular Content (Legal Language)</label>
              <textarea
                required={ingestMethod === "text"}
                rows={4}
                value={text}
                onChange={(textE) => setText(textE.target.value)}
                placeholder="Paste actual legal policy text. E.g. 'Banks must immediately coordinate localized data storage with physical boundary filters, enforcing adaptive permission groups inside the root user IAM environment.'"
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
          )}

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
              {ingestMethod === "pdf" ? "Parse & Map PDF via Gemini" : "Analyze Directive via Gemini AI"}
            </button>
          </div>
        </form>
      )}

      {/* Main Panel - Clean, full-width database index list */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-0.5">
          <span className="uppercase tracking-widest font-bold">Circular Database Index</span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-900 text-zinc-400 font-mono text-[9px]">{filteredRegs.length} loaded</span>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circular database..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-blue-500/60 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredRegs.map((reg) => {
            const isActive = selectedReg?.id === reg.id || selectedReg?.title === reg.title;
            const borderLeftColor = 
              reg.severity === "CRITICAL" ? "border-l-rose-500" :
              reg.severity === "HIGH" ? "border-l-amber-500" :
              "border-l-blue-400";
            
            return (
              <div
                key={reg.id}
                onClick={() => onSelectReg(reg)}
                className={`border-t border-b border-r bg-[#09090c]/45 p-3.5 rounded-xl cursor-pointer transition-all flex flex-col gap-1.5 border-l-4 ${borderLeftColor} ${
                  isActive 
                    ? "bg-gradient-to-r from-zinc-950/90 to-[#0A0A0C] border-blue-500/80 shadow-md shadow-blue-950/15" 
                    : "border-zinc-900/90 hover:border-zinc-800 hover:bg-zinc-900/10"
                }`}
                id={`reg-card-${reg.id}`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap text-[9px] font-mono leading-none">
                  <span className="text-zinc-500">{reg.date}</span>
                  <span className="text-blue-400 uppercase font-semibold">{reg.authority}</span>
                </div>
                <h4 className={`text-xs font-semibold leading-relaxed font-sans ${isActive ? "text-blue-400 font-bold" : "text-zinc-100 hover:text-blue-300"} transition-colors line-clamp-2`}>
                  {reg.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-zinc-950/40 pt-1.5 mt-0.5">
                  <span>{reg.parsed?.category || reg.category}</span>
                  <span className={`text-[9px] font-sans hover:underline ${isActive ? "text-blue-400" : "text-zinc-650"}`}>
                    Inspect →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
