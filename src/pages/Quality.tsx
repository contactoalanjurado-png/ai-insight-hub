import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import { LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { csatTrend, errorTypes, intents, qualityMetrics } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Quality() {
  const lowSuccess = [...intents].sort((a, b) => a.successRate - b.successRate).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Calidad</h1>
        <p className="text-sm text-muted-foreground mt-1">Métricas de satisfacción y rendimiento del asistente.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CSAT", value: qualityMetrics.csat.toFixed(1), icon: Star },
          { label: "Tasa Resolución", value: `${qualityMetrics.resolutionRate}%`, icon: CheckCircle2 },
          { label: "Reportes Alucinación", value: String(qualityMetrics.hallucinationReports), icon: AlertTriangle },
          { label: "Tool Success", value: `${qualityMetrics.toolSuccessRate}%`, icon: Wrench },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border rounded-2xl">
          <CardHeader><CardTitle className="font-heading">CSAT Trend (30d)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={csatTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(219,43%,24%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis domain={[3, 5]} tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} />
                  <Tooltip contentStyle={{ background: "hsl(224,52%,13%)", border: "1px solid hsl(219,43%,24%)", borderRadius: 12, color: "hsl(224,100%,96%)" }} />
                  <Line type="monotone" dataKey="csat" stroke="hsl(155,77%,54%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border rounded-2xl">
          <CardHeader><CardTitle className="font-heading">Errores por Tipo</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorTypes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(219,43%,24%)" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} />
                  <YAxis dataKey="type" type="category" width={100} tick={{ fontSize: 11, fill: "hsl(222,30%,69%)" }} />
                  <Tooltip contentStyle={{ background: "hsl(224,52%,13%)", border: "1px solid hsl(219,43%,24%)", borderRadius: 12, color: "hsl(224,100%,96%)" }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="hsl(349,100%,65%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border rounded-2xl">
        <CardHeader><CardTitle className="font-heading">Intents con Menor Tasa de Éxito</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">Intent</th>
                <th className="text-right px-4 py-3 font-medium">Éxito</th>
                <th className="text-right px-4 py-3 font-medium">Latencia</th>
                <th className="text-left px-4 py-3 font-medium">Acción Sugerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lowSuccess.map((i) => (
                <tr key={i.name}>
                  <td className="px-4 py-3 text-foreground">{i.name}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge variant="secondary" className={cn("text-xs border-0", i.successRate < 80 ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning")}>
                      {i.successRate}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{i.avgLatency}ms</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">Revisar prompts y tools asociados</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
