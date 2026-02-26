import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, X } from "lucide-react";
import { conversations } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Conversations() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof conversations[0] | null>(null);

  const filtered = conversations.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.user.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = {
    resolved: "bg-success/15 text-success",
    escalated: "bg-warning/15 text-warning",
    "needs-review": "bg-destructive/15 text-destructive",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Conversaciones</h1>
          <p className="text-sm text-muted-foreground mt-1">Historial de interacciones con usuarios.</p>
        </div>
      </div>

      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por ID o usuario..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
      </div>

      <Card className="border-border rounded-2xl">
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Usuario</th>
                <th className="text-left px-4 py-3 font-medium">Canal</th>
                <th className="text-right px-4 py-3 font-medium">Msgs</th>
                <th className="text-right px-4 py-3 font-medium">Tokens</th>
                <th className="text-right px-4 py-3 font-medium">Costo</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3 text-foreground font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3 text-foreground">{c.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.channel}</td>
                  <td className="px-4 py-3 text-right text-foreground">{c.messages}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{c.tokens.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">${c.cost.toFixed(3)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={cn("text-xs border-0", statusColor[c.status])}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-primary text-xs" onClick={() => setSelected(c)}>
                          Ver
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="bg-card border-border">
                        <SheetHeader>
                          <SheetTitle className="font-heading text-foreground">{c.id}</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-muted-foreground">Usuario:</span> <span className="text-foreground">{c.user}</span></div>
                            <div><span className="text-muted-foreground">Canal:</span> <span className="text-foreground">{c.channel}</span></div>
                            <div><span className="text-muted-foreground">Mensajes:</span> <span className="text-foreground">{c.messages}</span></div>
                            <div><span className="text-muted-foreground">Tokens:</span> <span className="text-foreground">{c.tokens}</span></div>
                          </div>
                          <div className="border-t border-border pt-4 space-y-3">
                            <p className="text-xs text-muted-foreground">Timeline de mensajes (mock)</p>
                            {Array.from({ length: Math.min(c.messages, 5) }, (_, i) => (
                              <div key={i} className={cn("p-3 rounded-xl text-sm max-w-[80%]", i % 2 === 0 ? "bg-secondary text-foreground" : "bg-primary/15 text-foreground ml-auto")}>
                                {i % 2 === 0 ? "Hola, necesito ayuda con mi pedido..." : "¡Claro! Déjame verificar el estado de tu pedido."}
                              </div>
                            ))}
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
