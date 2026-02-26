// Daily metrics for last 30 days
export const dailyMetrics = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const base = 45000 + Math.random() * 25000;
  return {
    date: date.toISOString().split("T")[0],
    tokens: Math.round(base),
    responses: Math.round(base / 35),
    cost: +(base * 0.000025).toFixed(2),
    latencyMs: Math.round(180 + Math.random() * 120),
    successRate: +(92 + Math.random() * 6).toFixed(1),
    fallbackRate: +(2 + Math.random() * 4).toFixed(1),
    escalations: Math.round(Math.random() * 15),
  };
});

export const channels = [
  { name: "WhatsApp", responses: 12840, tokens: 1_520_000, cost: 38.0, color: "hsl(var(--chart-3))" },
  { name: "Web", responses: 9620, tokens: 1_180_000, cost: 29.5, color: "hsl(var(--chart-1))" },
  { name: "Slack", responses: 4310, tokens: 490_000, cost: 12.25, color: "hsl(var(--chart-2))" },
  { name: "API", responses: 2780, tokens: 380_000, cost: 9.5, color: "hsl(var(--chart-4))" },
];

export const intents = [
  { name: "check_order_status", count: 3240, successRate: 96.2, avgLatency: 210 },
  { name: "reset_password", count: 2810, successRate: 94.8, avgLatency: 180 },
  { name: "billing_inquiry", count: 2150, successRate: 88.3, avgLatency: 340 },
  { name: "product_recommendation", count: 1890, successRate: 91.5, avgLatency: 420 },
  { name: "schedule_appointment", count: 1420, successRate: 85.1, avgLatency: 290 },
  { name: "complaint_escalation", count: 980, successRate: 72.4, avgLatency: 510 },
  { name: "faq_general", count: 4520, successRate: 98.1, avgLatency: 120 },
  { name: "refund_request", count: 1650, successRate: 82.7, avgLatency: 380 },
];

export const incidents = [
  { time: "2026-02-26 12:45", type: "Rate Limit", severity: "warning" as const, status: "resolved" },
  { time: "2026-02-26 11:20", type: "Timeout", severity: "error" as const, status: "investigating" },
  { time: "2026-02-26 09:15", type: "Tool Failure", severity: "error" as const, status: "resolved" },
  { time: "2026-02-25 22:30", type: "High Latency", severity: "warning" as const, status: "resolved" },
  { time: "2026-02-25 18:05", type: "Rate Limit", severity: "warning" as const, status: "resolved" },
  { time: "2026-02-25 14:12", type: "Model Error", severity: "error" as const, status: "mitigated" },
];

export const conversations = Array.from({ length: 30 }, (_, i) => ({
  id: `CONV-${String(1000 + i).padStart(4, "0")}`,
  user: ["maria.garcia", "john.doe", "ana.lopez", "carlos.ruiz", "emma.wilson", "luis.martinez"][i % 6],
  channel: ["WhatsApp", "Web", "Slack", "API"][i % 4] as string,
  startedAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
  messages: Math.round(3 + Math.random() * 20),
  tokens: Math.round(500 + Math.random() * 5000),
  cost: +(0.01 + Math.random() * 0.15).toFixed(3),
  status: (["resolved", "escalated", "needs-review"] as const)[i % 3],
}));

export const models = [
  { name: "GPT-4o", version: "2026-02", provider: "OpenAI", status: "active", traffic: 45, lastUpdated: "2026-02-20" },
  { name: "Claude 3.5 Sonnet", version: "v2", provider: "Anthropic", status: "active", traffic: 30, lastUpdated: "2026-02-18" },
  { name: "Gemini 2.0 Flash", version: "latest", provider: "Google", status: "active", traffic: 15, lastUpdated: "2026-02-22" },
  { name: "Llama 3.3 70B", version: "instruct", provider: "Meta", status: "standby", traffic: 10, lastUpdated: "2026-02-15" },
  { name: "Mistral Large", version: "2025-01", provider: "Mistral", status: "disabled", traffic: 0, lastUpdated: "2026-01-30" },
];

export const alertRules = [
  { rule: "Latency > 500ms", threshold: "500ms", channel: "Slack", enabled: true },
  { rule: "Error rate > 5%", threshold: "5%", channel: "Email", enabled: true },
  { rule: "Cost > $50/day", threshold: "$50", channel: "Slack + Email", enabled: true },
  { rule: "Escalation rate > 10%", threshold: "10%", channel: "Slack", enabled: false },
  { rule: "CSAT < 3.5", threshold: "3.5", channel: "Email", enabled: true },
];

export const recentAlerts = [
  { time: "2026-02-26 12:45", rule: "Latency > 500ms", value: "620ms", severity: "warning" as const },
  { time: "2026-02-26 11:20", rule: "Error rate > 5%", value: "7.2%", severity: "error" as const },
  { time: "2026-02-25 22:30", rule: "Cost > $50/day", value: "$54.20", severity: "warning" as const },
  { time: "2026-02-25 15:10", rule: "Latency > 500ms", value: "540ms", severity: "warning" as const },
];

export const qualityMetrics = {
  csat: 4.2,
  resolutionRate: 87.5,
  hallucinationReports: 23,
  toolSuccessRate: 94.1,
};

export const csatTrend = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    csat: +(3.8 + Math.random() * 0.8).toFixed(2),
  };
});

export const errorTypes = [
  { type: "Timeout", count: 145 },
  { type: "Rate Limit", count: 89 },
  { type: "Tool Failure", count: 67 },
  { type: "Model Error", count: 34 },
  { type: "Context Overflow", count: 21 },
];
