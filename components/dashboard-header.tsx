"use client"

import { Button } from "@/components/ui/button"
import { Settings, RefreshCw, Wifi, WifiOff, Printer, ScrollText, Cog, Github } from "lucide-react"

interface DashboardHeaderProps {
  isConnected: boolean
  lastUpdate: Date
  onRefresh: () => void
  onSettingsClick: () => void
  onEventLogClick: () => void
  onConfigClick: () => void
}

export function DashboardHeader({
  isConnected,
  lastUpdate,
  onRefresh,
  onSettingsClick,
  onEventLogClick,
  onConfigClick,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Printer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">PrintLink 3D</h1>
              <p className="text-xs text-muted-foreground">Monitoring & Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Connecté</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-destructive" />
                  <span className="text-destructive">Déconnecté</span>
                </>
              )}
            </div>

            <span className="text-xs text-muted-foreground hidden sm:block">
              {lastUpdate.toLocaleTimeString("fr-FR")}
            </span>

            <Button
              variant="ghost"
              size="icon"
              title="GitHub"
              onClick={() => window.open("https://github.com/Torskoo/PrintLink-3D", "_blank")}
            >
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRefresh} title="Actualiser">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onEventLogClick} title="Journal">
              <ScrollText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onSettingsClick} title="Modules">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onConfigClick} title="Paramètres">
              <Cog className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
