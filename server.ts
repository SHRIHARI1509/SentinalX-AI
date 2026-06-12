import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// SentinelX utilizes process.cwd() dynamically to map and serve static production assets.

const app = express();
app.use(express.json());

const PORT = 3000;

// Helper to safely obtain the Gemini AI client only if the key is provided
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Initial Mock Seed Data to keep the War Room filled and exciting right out of the box!
const MOCK_REGULATIONS = [
  {
    id: "reg-001",
    title: "RBI Adaptive Authentication Circular",
    authority: "RBI",
    date: "2026-05-10",
    severity: "HIGH",
    category: "Cybersecurity",
    text: "Banks must implement stronger adaptive authentication for high-risk digital transactions to prevent modern credential-stuffing attacks.",
    parsed: {
      category: "Cybersecurity",
      severity: "HIGH",
      legalIntent: "Prevent unauthorized entry points on digital devices during checkout and ledger steps.",
      extractedObligations: [
        "Enable risk-based adaptive MFA",
        "Introduce browser & mobile fingerprinting",
        "Perform anomaly threshold updates dynamically"
      ],
      actionPoints: [
        { department: "Cybersecurity", actionRequired: "Enable adaptive MFA dynamically based on user risk scoring", jiraTicket: "SEC-4190", owner: "Rohan V.", timelineDays: 14, status: "COMPLETED" },
        { department: "Mobile Banking", actionRequired: "Integrate device fingerprinting context into session tokens", jiraTicket: "MOB-8102", owner: "Ananya S.", timelineDays: 30, status: "IN_PROGRESS" },
        { department: "Fraud Team", actionRequired: "Increase API anomaly detection thresholds & transaction limits", jiraTicket: "FRD-2019", owner: "Vikram K.", timelineDays: 15, status: "IN_PROGRESS" },
        { department: "Compliance", actionRequired: "Maintain complete transaction audit log trails for SEBI preview", jiraTicket: "CMP-3301", owner: "Priya M.", timelineDays: 10, status: "COMPLETED" }
      ],
      twinImpact: [
        { systemName: "Authentication API", reason: "Direct recipient of authentication protocol alterations", riskIncreasePercent: 25 },
        { systemName: "IAM System", reason: "Coordinates user groups, permissions, and exception mappings", riskIncreasePercent: 15 },
        { systemName: "Fraud Detection", reason: "Requires tuning of transaction score vectors", riskIncreasePercent: 30 }
      ],
      driftVulnerabilities: [
        { controlName: "MFA Enforcement", driftPattern: "Temporary exemption of executive keys leading to silent coverage decay", detectionSIEMQuery: "SELECT user_id, event FROM secure_logs WHERE action='mfa_bypass' AND duration > 48" }
      ],
      predictiveRiskIncrease: 22,
      remediationDurationWeeks: 3
    }
  },
  {
    id: "reg-002",
    title: "DPDP Data Localisation and Consent Audit Directive",
    authority: "DPDP Board",
    date: "2026-06-02",
    severity: "CRITICAL",
    category: "Data Privacy",
    text: "Personal data related to critical cross-border transactions must maintain immutable, auditable local ledger logging and user explicit consent before batch indexing.",
    parsed: {
      category: "Data Privacy",
      severity: "CRITICAL",
      legalIntent: "Enforce digital privacy laws by auditing physical data stores and consent ledger compliance.",
      extractedObligations: [
        "Strict consent logging state in core registry",
        "Data isolation audits for high-risk user records",
        "Enforceable right-to-forget data mapping"
      ],
      actionPoints: [
        { department: "Cybersecurity", actionRequired: "Configure boundary firewalls to audit and block off-shore ledger indexing", jiraTicket: "SEC-5102", owner: "Rohan V.", timelineDays: 7, status: "IN_PROGRESS" },
        { department: "Compliance", actionRequired: "Generate automated DPDP consent ledger logs", jiraTicket: "CMP-4409", owner: "Priya M.", timelineDays: 14, status: "OVERDUE" }
      ],
      twinImpact: [
        { systemName: "Audit Logging Service", reason: "Central repository of transactions needs localized storage assertions", riskIncreasePercent: 40 },
        { systemName: "IAM System", reason: "Consent claims must integrate directly into access control bounds", riskIncreasePercent: 10 }
      ],
      driftVulnerabilities: [
        { controlName: "Data Quarantine", driftPattern: "Dev teams creating unsanctioned backups of staging databases with customer logs", detectionSIEMQuery: "grep -rI 'prod_db_dump' /cloud/logging" }
      ],
      predictiveRiskIncrease: 45,
      remediationDurationWeeks: 4
    }
  }
];

const DEFAULT_SYSTEMS_STATE = {
  overallRiskScore: 34, // percentage
  statusSummary: "MODERATE RISK - Active Drift Alert Detected across 2 nodes",
  activeDrifts: [
    {
      id: "drift-01",
      system: "IAM System",
      control: "MFA Enforcement Policy",
      expected: "100% Group-wide MFA enabled",
      actual: "92% (8 VIP records exempted temporarily by Dev Support)",
      severity: "HIGH",
      detectedAt: "2026-06-11T01:14:00Z",
      driftDays: 4,
      remedyAction: "Enforce fallback SMS authentication and revoke temporary exemptions via Azure IAM API"
    },
    {
      id: "drift-02",
      system: "Audit Logging Service",
      control: "SEBI Compliance Archive SLA",
      expected: "Logs uploaded < 5m delay",
      actual: "Log delivery latency currently high (~45m delay)",
      severity: "MEDIUM",
      detectedAt: "2026-06-11T02:00:00Z",
      driftDays: 1,
      remedyAction: "Trigger auto-scale on logging ingestion worker containers"
    }
  ],
  digitalTwin: {
    nodes: [
      { id: "Mobile Banking App", status: "WARNING", type: "CLIENT", owner: "Mobile Banking Team" },
      { id: "Authentication API", status: "HEALTHY", type: "API", owner: "Cybersecurity" },
      { id: "IAM System", status: "CRITICAL", type: "INFRA", owner: "Identity & Core Security" },
      { id: "Fraud Detection", status: "WARNING", type: "SERVICE", owner: "Fraud Detection Team" },
      { id: "Audit Logging Service", status: "WARNING", type: "LOG", owner: "Audit & Compliance Group" }
    ],
    links: [
      { source: "Mobile Banking App", target: "Authentication API" },
      { source: "Authentication API", target: "IAM System" },
      { source: "IAM System", target: "Fraud Detection" },
      { source: "Fraud Detection", target: "Audit Logging Service" }
    ]
  },
  predictiveInsights: {
    failureProbability: 81, // probability percent
    nextAuditTimelineDays: 45,
    riskFactors: [
      "Unresolved MFA policy drift in the IAM infrastructure layer",
      "Overdue DPDP consent action items assigned to the Compliance division",
      "Log syncing delays observed on mobile-ledger transaction pathways"
    ],
    historicalVelocity: "72% Treasury delay likelihood based on standard 8-cycle governance metrics"
  }
};

// API: Systems State
app.get("/api/systems-state", (req, res) => {
  res.json({
    systems: DEFAULT_SYSTEMS_STATE,
    regulations: MOCK_REGULATIONS
  });
});

// API: Analyze Custom Regulation (Uses Gemini AI)
app.post("/api/analyze-regulation", async (req, res) => {
  const { text, title, authority } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Regulation text is required" });
  }

  const userTitle = title || "Custom Parsed Circular";
  const userAuthority = authority || "SEBI/RBI Custom Input";

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant Offline Fallback Mode
    console.log("No valid GEMINI_API_KEY. Using sophisticated heuristic analysis.");
    
    // Simple heuristic parser for simulated responses based on text signals
    let category = "Cybersecurity";
    let severity = "MEDIUM";
    if (text.toLowerCase().includes("privacy") || text.toLowerCase().includes("personal") || text.toLowerCase().includes("consent")) {
      category = "Data Privacy";
      severity = "CRITICAL";
    } else if (text.toLowerCase().includes("fraud") || text.toLowerCase().includes("transaction") || text.toLowerCase().includes("money")) {
      category = "Fraud Prevention";
      severity = "HIGH";
    }

    const mockParsed = {
      category: category,
      severity: severity,
      legalIntent: `Ensure banks comply safely with real-time requirements regarding: "${text.substring(0, 50)}..."`,
      extractedObligations: [
        `Strict monitoring of systems matching input criteria.`,
        `Formal audit report generated on governance state.`,
        `Regular continuous posture assessments.`
      ],
      actionPoints: [
        { department: "Compliance", actionRequired: "Perform deep impact evaluation of incoming circular requirements", jiraTicket: "CMP-9002", owner: "Priya M.", timelineDays: 7, status: "IN_PROGRESS" },
        { department: "Cybersecurity", actionRequired: "Audit current IAM boundary configurations and exception groups", jiraTicket: "SEC-1120", owner: "Rohan V.", timelineDays: 14, status: "IN_PROGRESS" }
      ],
      twinImpact: [
        { systemName: "IAM System", reason: "Credential authorization standards are impacted directly", riskIncreasePercent: 12 },
        { systemName: "Audit Logging Service", reason: "Auditable verification reports require state aggregation", riskIncreasePercent: 20 }
      ],
      driftVulnerabilities: [
        { controlName: "Compliance Thresholds", driftPattern: "Lack of routine SIEM logging review leading to silent exceptions", detectionSIEMQuery: "SELECT timestamp, user, action FROM system_audit WHERE level='CRITICAL'" }
      ],
      predictiveRiskIncrease: 15,
      remediationDurationWeeks: 2
    };

    const simulatedRegulation = {
      id: `reg-${Date.now()}`,
      title: userTitle,
      authority: userAuthority,
      date: new Date().toISOString().split("T")[0],
      severity: severity,
      category: category,
      text: text,
      parsed: mockParsed,
      simulated: true // tells client it was offline evaluation
    };

    return res.json(simulatedRegulation);
  }

  try {
    const prompt = `
      You are an expert Enterprise Compliance and Regulatory Intelligence AI Engine designed for tier-1 bank structures.
      Analyze the following regulatory text or circular instructions:

      TITLE: "${userTitle}"
      AUTHORITY: "${userAuthority}"
      CONTENT: "${text}"

      Identify:
      1. Domain classification ("Cybersecurity", "Data Privacy", "Fraud Prevention", "Operations", "Treasury").
      2. Severity level ("CRITICAL", "HIGH", "MEDIUM", "LOW").
      3. Legal Intent: Interpret the core sovereign target of this legal policy into direct systems-facing logic.
      4. Extracted core legal obligations (up to 3 distinct items).
      5. Action Points (MAP) with assigned departments:
         - Match each action point to one of these valid departments: "Cybersecurity", "Mobile Banking", "Fraud Team", "Compliance", "Treasury", "IT Infrastructure".
         - Draft actionable technical steps for each action point.
         - Generate a realistic simulated Jira ticket ID (formatted e.g. "SEC-XXXX" or "CMP-XXXX").
         - Pick an owner name (e.g. "Rohan V.", "Ananya S.", "Vikram K.", "Priya M.").
         - Specify timeline duration in days to implement completely.
      6. Digital Twin Impact: Map downstream impact to one or more of these specific nodes:
         - "Mobile Banking App"
         - "Authentication API"
         - "IAM System"
         - "Fraud Detection"
         - "Audit Logging Service"
         For each, explain the reason and state a simulated percentage risk increase if not implemented properly.
      7. Drift vulnerabilities: Describe standard compliance decay points where implementations fade, and write a high-value simulated SQL or SIEM log query to detect this drift dynamically.
      8. Estimated predictive risk percentage increase to systemic bank posture if unresolved, and remediation timeline in weeks.

      Ensure the JSON fits the structure perfectly. Return NOTHING but the JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "category",
            "severity",
            "legalIntent",
            "extractedObligations",
            "actionPoints",
            "twinImpact",
            "driftVulnerabilities",
            "predictiveRiskIncrease",
            "remediationDurationWeeks"
          ],
          properties: {
            category: { type: Type.STRING, description: "Regulatory department category" },
            severity: { type: Type.STRING, description: "CRITICAL, HIGH, MEDIUM, or LOW" },
            legalIntent: { type: Type.STRING, description: "Summarized underlying policy intent of the regulation" },
            extractedObligations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Extracted legal obligations"
            },
            actionPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["department", "actionRequired", "jiraTicket", "owner", "timelineDays"],
                properties: {
                  department: { type: Type.STRING },
                  actionRequired: { type: Type.STRING, description: "Concrete implementation action required" },
                  jiraTicket: { type: Type.STRING },
                  owner: { type: Type.STRING },
                  timelineDays: { type: Type.INTEGER }
                }
              }
            },
            twinImpact: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["systemName", "reason", "riskIncreasePercent"],
                properties: {
                  systemName: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  riskIncreasePercent: { type: Type.INTEGER }
                }
              }
            },
            driftVulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["controlName", "driftPattern", "detectionSIEMQuery"],
                properties: {
                  controlName: { type: Type.STRING },
                  driftPattern: { type: Type.STRING },
                  detectionSIEMQuery: { type: Type.STRING }
                }
              }
            },
            predictiveRiskIncrease: { type: Type.INTEGER, description: "Percentage of predictive systemic risk boost from 0 to 100" },
            remediationDurationWeeks: { type: Type.INTEGER, description: "Nominal weeks required to close this completely" }
          }
        }
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    // Append standard statuses to action points
    if (parsedJson.actionPoints) {
      parsedJson.actionPoints = parsedJson.actionPoints.map((ap: any, idx: number) => ({
        ...ap,
        status: idx % 2 === 0 ? "IN_PROGRESS" : "PENDING"
      }));
    }

    const parsedRegulation = {
      id: `reg-${Date.now()}`,
      title: userTitle,
      authority: userAuthority,
      date: new Date().toISOString().split("T")[0],
      severity: parsedJson.severity || "MEDIUM",
      category: parsedJson.category || "Cybersecurity",
      text: text,
      parsed: parsedJson,
      simulated: false
    };

    res.json(parsedRegulation);
  } catch (error: any) {
    console.warn("Active Gemini API failed or returned 503. Executing high-fidelity heuristic fallback:", error);
    
    // Heuristic parser for simulated responses based on text signals
    let category = "Cybersecurity";
    let severity = "MEDIUM";
    const lowerText = text.toLowerCase();
    if (lowerText.includes("privacy") || lowerText.includes("personal") || lowerText.includes("consent") || lowerText.includes("dpdp")) {
      category = "Data Privacy";
      severity = "CRITICAL";
    } else if (lowerText.includes("fraud") || lowerText.includes("transaction") || lowerText.includes("money") || lowerText.includes("auth") || lowerText.includes("mfa") || lowerText.includes("token")) {
      category = "Fraud Prevention";
      severity = "HIGH";
    }

    const mockParsed = {
      category: category,
      severity: severity as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      legalIntent: `Ensure banking divisions properly align localized infrastructure configurations regarding: "${text.substring(0, 75)}..."`,
      extractedObligations: [
        `Strict monitoring of systems matching incoming authority constraints.`,
        `Configure boundaries and exceptions to avoid structural policy drift.`,
        `Conduct routine continuous posture updates inside our administrative controls.`
      ],
      actionPoints: [
        { department: "Compliance", actionRequired: "Perform rapid evaluation of incoming circular requirements and map parameters", jiraTicket: "CMP-9201", owner: "Priya M.", timelineDays: 7, status: "IN_PROGRESS" as const },
        { department: "Cybersecurity", actionRequired: "Validate IAM boundary filters, authentication session tokens, and exception list definitions", jiraTicket: "SEC-1422", owner: "Rohan V.", timelineDays: 14, status: "IN_PROGRESS" as const }
      ],
      twinImpact: [
        { systemName: "IAM System", reason: "Exemptions matching the newly specified credentials are systematically cataloged", riskIncreasePercent: 15 },
        { systemName: "Audit Logging Service", reason: "Logging and archive procedures must assert compliance indicators", riskIncreasePercent: 25 }
      ],
      driftVulnerabilities: [
        { controlName: "Systemic Boundaries", driftPattern: "Temporary exemption profiles configured for staging or developer testing are left active", detectionSIEMQuery: "SELECT timestamp, user, action FROM system_audit WHERE level='CRITICAL'" }
      ],
      predictiveRiskIncrease: 18,
      remediationDurationWeeks: 3
    };

    const simulatedRegulation = {
      id: `reg-${Date.now()}`,
      title: userTitle,
      authority: userAuthority,
      date: new Date().toISOString().split("T")[0],
      severity: severity as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      category: category,
      text: text,
      parsed: mockParsed,
      simulated: true,
      fallbackMode: true // indicates it fell back due to API error/congestion
    };

    res.json(simulatedRegulation);
  }
});

// API: Executive Summaries (Generates custom speech narrative from SentinelX memory)
app.post("/api/executive-narrative", async (req, res) => {
  const { currentScore, activeDrifts, riskFactors } = req.body;

  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      brief: "Continuous compliance tracking aggregates SEBI and RBI compliance vectors accurately.",
      paragraphs: [
        `SentinelX analysis asserts that the enterprise risk posture is currently sitting at ${currentScore || 34}% risk limit. This is driven principally by the IAM system drift where privileged administrator tokens have temporary bypass permissions active on several accounts.`,
        "The remediation vectors indicate an estimated failure probability of 81% for upcoming cycle sweeps if the key IAM and localized logs storage delays are not mitigated or patched within the nominal 45-day cycle window.",
        "Mobile banking App interactions are stable, but downstream transaction risk assessment anomalies need recalibrated thresholds consistent with the most recent adaptive authentication circular requirements."
      ]
    });
  }

  try {
    const prompt = `
      You are the Chief AI Risk Officer inside the bank's SentinelX Executive Governance War Room.
      Generate an executive brief on the state of banking compliance based on these indicators:
      Current Risk Profile: ${currentScore || 34}% risk limit.
      Active System Drifts: ${JSON.stringify(activeDrifts || [])}
      Core Risk Factors and Delayed MAPs: ${JSON.stringify(riskFactors || [])}

      Provide your analysis formatted in clean JSON with two fields:
      - "brief": a powerful single-sentence overview summarizing the status.
      - "paragraphs": an array of 2 to 3 concise professional, authoritative paragraphs containing expert insight, risk assessment, and precise mitigation recommendations. Speak directly as an autonomous intelligence nervous system reporting to the Board of Directors.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["brief", "paragraphs"],
          properties: {
            brief: { type: Type.STRING },
            paragraphs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);

  } catch (e: any) {
    console.warn("Active Gemini API narrative failed or returned 503. Executing high-fidelity heuristic template fallback:", e);
    res.json({
      brief: "Continuous alignment metrics register high critical drift patterns on centralized identity nodes.",
      paragraphs: [
        `SentinelX has compiled the executive brief for the Security Committee. Systemic risk sits at ${currentScore || 34}% limit, with overall cyclical failures trending upwards due to the lingering MFA bypass exceptions in our Active Directory / IAM clusters.`,
        "Remediation timelines assert that overdue actions on database local auditing must resolve within the next 45 operational cycles to avoid high technical audit non-compliance scores.",
        "Mobile banking App interactions are stable, but downstream transaction risk assessment anomalies need recalibrated thresholds consistent with the most recent adaptive authentication circular requirements."
      ],
      fallbackMode: true
    });
  }
});

// Serve static assets in production, or mount Vite dev server in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SentinelX Autonomous Governance Server running on port ${PORT}`);
  });
}

startServer();
