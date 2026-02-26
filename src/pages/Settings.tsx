import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Ajustes</h1>
        <p className="text-sm text-muted-foreground mt-1">Configuración general de AJG IA.</p>
      </div>

      <Card className="border-border rounded-2xl">
        <CardHeader><CardTitle className="font-heading">Perfil</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Nombre de la organización</Label>
            <Input defaultValue="AJG IA" className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Email de contacto</Label>
            <Input defaultValue="admin@ajgia.com" className="bg-secondary border-border" />
          </div>
          <Button>Guardar</Button>
        </CardContent>
      </Card>

      <Card className="border-border rounded-2xl">
        <CardHeader><CardTitle className="font-heading">Notificaciones</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Alertas por email", desc: "Recibe alertas críticas en tu email" },
            { label: "Alertas por Slack", desc: "Integración con canal de Slack" },
            { label: "Resumen diario", desc: "Reporte diario de métricas" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border rounded-2xl">
        <CardHeader><CardTitle className="font-heading">API Keys</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">OpenAI API Key</Label>
            <Input type="password" defaultValue="sk-•••••••••••••••" className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Anthropic API Key</Label>
            <Input type="password" defaultValue="sk-ant-•••••••••••" className="bg-secondary border-border" />
          </div>
          <Button>Actualizar Keys</Button>
        </CardContent>
      </Card>
    </div>
  );
}
