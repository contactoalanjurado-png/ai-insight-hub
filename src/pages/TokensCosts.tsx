import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, DollarSign, FileText, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { dailyMetrics, conversations } from "@/data/mockData";

export default function TokensCosts() {
  const [model, setModel] = useState("gpt-4o");
  const costMultiplier = model === "gpt-4o" ? 1 : model === "claude-3.5" ? 0.8 : 0.4;

  const totals = useMemo(() => {
    const t = dailyMetrics.reduce((a, m) => ({ tokens: a.tokens + m.tokens, cost: a.cost + m.cost }), { tokens: 0, cost: 0 });
    return { ...t, prompt: Math.round(t.tokens * 0.55), completion: Math.round(t.tokens * 0.45), costPer1k: +((t.cost / t.tokens) * 1000).toFixed(4) };
  }, []);

  const chartData = dailyMetrics.map((m) => ({
    date: m.date.slice(5),
    prompt: Math.round(m.tokens * 0.55),
    completion: Math.round(m.tokens * 0.45),
  }));

  const topConvos = [...conversations].sort((a, b) => b.cost - a.cost).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Tokens & Costos</h1>
          <p className="text-sm text-muted-foreground mt-1">Análisis detallado de consumo y gasto.</p>
        </div>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="w-40 bg-secondary border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="claude-3.5">Claude 3.5</SelectItem>
            <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tokens", value: `${(totals.tokens / 1e6).toFixed(2)}M`, icon: Zap },
          { label: "Prompt Tokens", value: `${(totals.prompt / 1e6).toFixed(2)}M`, icon: FileText },
          { label: "Completion Tokens", value: `${(totals.completion / 1e6).toFixed(2)}M`, icon: FileText },
          { label: "Costo Total", value: `$${(totals.cost * costMultiplier).toFixed(2)}`, icon: DollarSign },
        ].map((k) => (
          <Card key={k.label} className="border-border rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{k.label}</span>
                <k.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-heading font-bold text-foreground">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border rounded-2xl">
        <CardHeader><CardTitle className="font-heading">Prompt vs Completion Tokens</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="promptG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(233,100%,68%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(233,100%,68%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="compG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(271,91%,65%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(271,91%,65%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(219,43%,24%)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "hsl(224,52%,13%)", border: "1px solid hsl(219,43%,24%)", borderRadius: 12, color: "hsl(224,100%,96%)" }} />
                <Area type="monotone" dataKey="prompt" stroke="hsl(233,100%,68%)" fill="url(#promptG)" strokeWidth={2} stackId="1" />
                <Area type="monotone" dataKey="completion" stroke="hsl(271,91%,65%)" fill="url(#compG)" strokeWidth={2} stackId="1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border rounded-2xl">
        <CardHeader><CardTitle className="font-heading">Top 10 Conversaciones más Costosas</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Usuario</th>
                <th className="text-right px-4 py-3 font-medium">Tokens</th>
                <th className="text-right px-4 py-3 font-medium">Costo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topConvos.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3 text-foreground font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3 text-foreground">{c.user}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{c.tokens.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-foreground">${(c.cost * costMultiplier).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
