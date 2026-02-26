import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Bot, ExternalLink } from "lucide-react";
import { models } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Models() {
  const [modelData, setModelData] = useState(models);

  const toggleStatus = (idx: number) => {
    setModelData((prev) =>
      prev.map((m, i) =>
        i === idx ? { ...m, status: m.status === "active" ? "disabled" : "active" } : m
      )
    );
  };

  const updateTraffic = (idx: number, value: number[]) => {
    setModelData((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, traffic: value[0] } : m))
    );
  };

  const statusColor = {
    active: "bg-success/15 text-success",
    standby: "bg-warning/15 text-warning",
    disabled: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Modelos</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona tus deployments de modelos de IA.</p>
        </div>
        <Button className="gap-2"><Bot className="w-4 h-4" /> Add Model</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {modelData.map((m, idx) => (
          <Card key={m.name} className="border-border rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-heading">{m.name}</CardTitle>
                <Badge variant="secondary" className={cn("text-xs border-0", statusColor[m.status as keyof typeof statusColor])}>
                  {m.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Provider:</span> <span className="text-foreground">{m.provider}</span></div>
                <div><span className="text-muted-foreground">Version:</span> <span className="text-foreground">{m.version}</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">Updated:</span> <span className="text-foreground">{m.lastUpdated}</span></div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Traffic Split</span>
                  <span className="text-foreground font-medium">{m.traffic}%</span>
                </div>
                <Slider value={[m.traffic]} max={100} step={5} onValueChange={(v) => updateTraffic(idx, v)} className="w-full" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Enabled</span>
                <Switch checked={m.status === "active"} onCheckedChange={() => toggleStatus(idx)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
