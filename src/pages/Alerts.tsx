import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Plus, AlertTriangle, XCircle } from "lucide-react";
import { alertRules, recentAlerts } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Alerts() {
  const [rules, setRules] = useState(alertRules);

  const toggleRule = (idx: number) => {
    setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, enabled: !r.enabled } : r)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Alertas</h1>
          <p className="text-sm text-muted-foreground mt-1">Configura reglas y revisa alertas recientes.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Create Rule</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">Nueva Regla de Alerta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-foreground">Nombre de la regla</Label>
                <Input className="bg-secondary border-border" placeholder="Ej: Latency > 500ms" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Threshold</Label>
                <Input className="bg-secondary border-border" placeholder="Ej: 500ms" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Canal de notificación</Label>
                <Input className="bg-secondary border-border" placeholder="Ej: Slack, Email" />
              </div>
              <Button className="w-full">Crear Regla</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border rounded-2xl">
          <CardHeader><CardTitle className="font-heading">Reglas de Alerta</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {rules.map((r, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.rule}</p>
                    <p className="text-xs text-muted-foreground">{r.channel} · Threshold: {r.threshold}</p>
                  </div>
                  <Switch checked={r.enabled} onCheckedChange={() => toggleRule(idx)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border rounded-2xl">
          <CardHeader><CardTitle className="font-heading">Alertas Recientes</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentAlerts.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4">
                  {a.severity === "error" ? (
                    <XCircle className="w-4 h-4 text-destructive shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{a.rule}</p>
                    <p className="text-xs text-muted-foreground">{a.time} · Valor: {a.value}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs border-0",
                      a.severity === "error" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"
                    )}
                  >
                    {a.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
