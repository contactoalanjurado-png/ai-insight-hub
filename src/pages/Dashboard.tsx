import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Zap, MessageSquare, Clock, DollarSign, TrendingUp, ArrowUpRight, Pause, Square, Activity,
  AlertTriangle, XCircle, CheckCircle2, Rocket,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { dailyMetrics, channels, intents, incidents } from "@/data/mockData";

const subtabs = ["Overview", "Realtime", "Canales", "Usuarios"] as const;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<(typeof subtabs)[number]>("Overview");
  const [dateRange, setDateRange] = useState("14");

  const filteredMetrics = useMemo(
    () => dailyMetrics.slice(-Number(dateRange)),
    [dateRange]
  );

  const totals = useMemo(() => {
    const t = filteredMetrics.reduce(
      (acc, m) => ({
        tokens: acc.tokens + m.tokens,
        responses: acc.responses + m.responses,
        cost: acc.cost + m.cost,
        latency: acc.latency + m.latencyMs,
      }),
      { tokens: 0, responses: 0, cost: 0, latency: 0 }
    );
    return {
      tokens: t.tokens,
      responses: t.responses,
      cost: t.cost,
      avgLatency: Math.round(t.latency / filteredMetrics.length),
    };
  }, [filteredMetrics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitorea y analiza tu infraestructura de IA en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7d</SelectItem>
              <SelectItem value="14">Últimos 14d</SelectItem>
              <SelectItem value="30">Últimos 30d</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Rocket className="w-4 h-4" /> New Deployment
          </Button>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit">
        {subtabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <OverviewTab totals={totals} filteredMetrics={filteredMetrics} />
      )}
      {activeTab === "Realtime" && <RealtimeTab />}
      {activeTab === "Canales" && <ChannelsTab />}
      {activeTab === "Usuarios" && <UsersTab />}
    </div>
  );
}

/* ── KPI Card ──────────────────────────────────────── */
function KpiCard({
  title, value, change, icon: Icon, variant = "default",
}: {
  title: string; value: string; change: string;
  icon: React.ElementType; variant?: "default" | "primary" | "accent" | "success";
}) {
  const variantClasses = {
    default: "bg-card border-border",
    primary: "bg-primary/10 border-primary/20 glow-primary",
    accent: "bg-accent/10 border-accent/20 glow-accent",
    success: "bg-success/10 border-success/20 glow-success",
  };
  return (
    <Card className={cn("border rounded-2xl", variantClasses[variant])}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="p-2 rounded-lg bg-secondary">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        </div>
        <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="w-3 h-3 text-success" />
          <span className="text-xs text-success">{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Overview Tab ──────────────────────────────────── */
function OverviewTab({
  totals, filteredMetrics,
}: {
  totals: { tokens: number; responses: number; cost: number; avgLatency: number };
  filteredMetrics: typeof dailyMetrics;
}) {
  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Tokens Generados" value={`${(totals.tokens / 1000).toFixed(0)}K`} change="+12.5% vs periodo anterior" icon={Zap} variant="primary" />
        <KpiCard title="Respuestas Servidas" value={totals.responses.toLocaleString()} change="+8.3% vs periodo anterior" icon={MessageSquare} variant="accent" />
        <KpiCard title="Latencia Promedio" value={`${totals.avgLatency}ms`} change="-5.2% vs periodo anterior" icon={Clock} variant="success" />
        <KpiCard title="Costo Estimado" value={`$${totals.cost.toFixed(2)}`} change="+3.1% vs periodo anterior" icon={DollarSign} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tokens per day */}
        <Card className="lg:col-span-2 border-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Tokens por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredMetrics}>
                  <defs>
                    <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(233,100%,68%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(233,100%,68%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(219,43%,24%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ background: "hsl(224,52%,13%)", border: "1px solid hsl(219,43%,24%)", borderRadius: 12, color: "hsl(224,100%,96%)" }} />
                  <Area type="monotone" dataKey="tokens" stroke="hsl(233,100%,68%)" fill="url(#tokenGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Success donut */}
        <Card className="border-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Distribución de Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Éxito", value: 82 },
                      { name: "Fallback", value: 12 },
                      { name: "Escalado", value: 6 },
                    ]}
                    cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                    paddingAngle={4} dataKey="value" strokeWidth={0}
                  >
                    <Cell fill="hsl(155,77%,54%)" />
                    <Cell fill="hsl(40,100%,67%)" />
                    <Cell fill="hsl(271,91%,65%)" />
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(224,52%,13%)", border: "1px solid hsl(219,43%,24%)", borderRadius: 12, color: "hsl(224,100%,96%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success" /> Éxito</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Fallback</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Escalado</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Intents */}
        <Card className="lg:col-span-1 border-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Top Intents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {intents.slice(0, 6).map((intent) => (
                <div key={intent.name} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{intent.name}</p>
                    <p className="text-xs text-muted-foreground">{intent.count} llamadas</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs border-0",
                      intent.successRate >= 90
                        ? "bg-success/15 text-success"
                        : intent.successRate >= 80
                        ? "bg-warning/15 text-warning"
                        : "bg-destructive/15 text-destructive"
                    )}
                  >
                    {intent.successRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Token Meter */}
        <LiveTokenMeter />

        {/* Recent Incidents */}
        <Card className="border-border rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-heading">Incidentes Recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {incidents.slice(0, 5).map((inc, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  {inc.severity === "error" ? (
                    <XCircle className="w-4 h-4 text-destructive shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{inc.type}</p>
                    <p className="text-xs text-muted-foreground">{inc.time}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs border-0",
                      inc.status === "resolved" && "bg-success/15 text-success",
                      inc.status === "investigating" && "bg-warning/15 text-warning",
                      inc.status === "mitigated" && "bg-primary/15 text-primary"
                    )}
                  >
                    {inc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

/* ── Live Token Meter ──────────────────────────────── */
function LiveTokenMeter() {
  const [count, setCount] = useState(1_847_293);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.round(15 + Math.random() * 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = count.toLocaleString();

  return (
    <Card className="border-primary/30 rounded-2xl glow-primary bg-gradient-to-br from-primary/10 to-accent/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary animate-pulse-glow" />
          Live Token Meter
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <p className="text-4xl font-heading font-bold text-foreground tabular-nums tracking-tight">
          {formatted}
        </p>
        <p className="text-sm text-muted-foreground mt-2">tokens generados hoy</p>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="gap-1 border-border text-muted-foreground">
            <Pause className="w-3 h-3" /> Pausar
          </Button>
          <Button size="sm" variant="outline" className="gap-1 border-border text-muted-foreground">
            <Square className="w-3 h-3" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Realtime Tab ──────────────────────────────────── */
function RealtimeTab() {
  const [data, setData] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({ time: i, tokens: Math.round(400 + Math.random() * 300) }))
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const next = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, tokens: Math.round(400 + Math.random() * 300) }];
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <Card className="border-border rounded-2xl">
        <CardHeader><CardTitle className="font-heading">Tokens en Tiempo Real</CardTitle></CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(219,43%,24%)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} />
                <Line type="monotone" dataKey="tokens" stroke="hsl(233,100%,68%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Channels Tab ──────────────────────────────────── */
function ChannelsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-border rounded-2xl">
        <CardHeader><CardTitle className="font-heading">Respuestas por Canal</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channels}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(219,43%,24%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} />
                <Tooltip contentStyle={{ background: "hsl(224,52%,13%)", border: "1px solid hsl(219,43%,24%)", borderRadius: 12, color: "hsl(224,100%,96%)" }} />
                <Bar dataKey="responses" radius={[6, 6, 0, 0]}>
                  {channels.map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border rounded-2xl">
        <CardHeader><CardTitle className="font-heading">Detalle por Canal</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {channels.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{ch.name}</p>
                  <p className="text-xs text-muted-foreground">{ch.tokens.toLocaleString()} tokens</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{ch.responses.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">${ch.cost.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Users Tab ─────────────────────────────────────── */
function UsersTab() {
  const topUsers = [
    { name: "maria.garcia", conversations: 124, tokens: 52400, cost: 1.31 },
    { name: "john.doe", conversations: 98, tokens: 41200, cost: 1.03 },
    { name: "ana.lopez", conversations: 87, tokens: 38900, cost: 0.97 },
    { name: "carlos.ruiz", conversations: 76, tokens: 34100, cost: 0.85 },
    { name: "emma.wilson", conversations: 65, tokens: 28700, cost: 0.72 },
  ];

  return (
    <Card className="border-border rounded-2xl">
      <CardHeader><CardTitle className="font-heading">Top Usuarios</CardTitle></CardHeader>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">Usuario</th>
              <th className="text-right px-5 py-3 font-medium">Conversaciones</th>
              <th className="text-right px-5 py-3 font-medium">Tokens</th>
              <th className="text-right px-5 py-3 font-medium">Costo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {topUsers.map((u) => (
              <tr key={u.name}>
                <td className="px-5 py-3 text-sm text-foreground">{u.name}</td>
                <td className="px-5 py-3 text-sm text-right text-foreground">{u.conversations}</td>
                <td className="px-5 py-3 text-sm text-right text-muted-foreground">{u.tokens.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm text-right text-muted-foreground">${u.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
