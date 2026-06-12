export interface ActionPoint {
  department: string;
  actionRequired: string;
  jiraTicket: string;
  owner: string;
  timelineDays: number;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "OVERDUE";
}

export interface TwinImpact {
  systemName: string;
  reason: string;
  riskIncreasePercent: number;
}

export interface DriftVulnerability {
  controlName: string;
  driftPattern: string;
  detectionSIEMQuery: string;
}

export interface ParsedRegulation {
  category: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  legalIntent: string;
  extractedObligations: string[];
  actionPoints: ActionPoint[];
  twinImpact: TwinImpact[];
  driftVulnerabilities: DriftVulnerability[];
  predictiveRiskIncrease: number;
  remediationDurationWeeks: number;
}

export interface RegulationObject {
  id: string;
  title: string;
  authority: string;
  date: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string;
  text: string;
  parsed: ParsedRegulation;
  simulated?: boolean;
  fallbackMode?: boolean;
}

export interface DriftAlert {
  id: string;
  system: string;
  control: string;
  expected: string;
  actual: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  detectedAt: string;
  driftDays: number;
  remedyAction: string;
}

export interface DigitalTwinNode {
  id: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  type: string;
  owner: string;
}

export interface DigitalTwinLink {
  source: string;
  target: string;
}

export interface DigitalTwinData {
  nodes: DigitalTwinNode[];
  links: DigitalTwinLink[];
}

export interface PredictiveInsights {
  failureProbability: number;
  nextAuditTimelineDays: number;
  riskFactors: string[];
  historicalVelocity: string;
}

export interface WarRoomState {
  overallRiskScore: number;
  statusSummary: string;
  activeDrifts: DriftAlert[];
  digitalTwin: DigitalTwinData;
  predictiveInsights: PredictiveInsights;
}

export interface ExecutiveReport {
  brief: string;
  paragraphs: string[];
}
