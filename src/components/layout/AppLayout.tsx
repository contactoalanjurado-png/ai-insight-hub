import { Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, MessageSquare, Coins, ShieldCheck, Bot, Bell, Settings, Search, ChevronLeft, Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Conversaciones", icon: MessageSquare, path: "/conversations", badge: 5 },
  { label: "Tokens & Costos", icon: Coins, path: "/tokens-costs" },
  { label: "Calidad", icon: ShieldCheck, path: "/quality" },
  { label: "Modelos", icon: Bot, path: "/models" },
  { label: "Alertas", icon: Bell, path: "/alerts", badge: 2 },
];

const generalItems = [
  { label: "Ajustes", icon: Settings, path: "/settings" },
];

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-heading text-lg font-bold text-foreground">AJG IA</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "ml-auto p-1 rounded-md hover:bg-secondary text-muted-foreground transition-transform",
              collapsed && "rotate-180 mx-auto ml-0"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {!collapsed && (
            <p className="px-4 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Menú
            </p>
          )}
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs bg-primary/20 text-primary border-0">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}

          <div className="my-4 mx-4 border-t border-border" />

          {!collapsed && (
            <p className="px-4 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              General
            </p>
          )}
          {generalItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0 bg-background">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border border-border">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                  AJ
                </AvatarFallback>
              </Avatar>
              {<span className="text-sm font-medium text-foreground hidden md:block">Admin</span>}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
