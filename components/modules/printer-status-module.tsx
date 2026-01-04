"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Printer, Pause, Square, FileCode } from "lucide-react"
import type { PrinterStatus } from "@/hooks/use-printer-status"

interface PrinterStatusModuleProps {
  status: PrinterStatus
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export function PrinterStatusModule({ status }: PrinterStatusModuleProps) {
  const stateLabels: Record<PrinterStatus["state"], string> = {
    idle: "En attente",
    printing: "Impression",
    paused: "En pause",
    error: "Erreur",
    offline: "Hors ligne",
  }

  const stateColors: Record<PrinterStatus["state"], string> = {
    idle: "bg-muted",
    printing: "bg-primary",
    paused: "bg-chart-3",
    error: "bg-destructive",
    offline: "bg-muted-foreground",
  }

  return (
    <Card className="col-span-2 bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Printer className="h-4 w-4 text-primary" />
          Statut Imprimante
        </CardTitle>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${stateColors[status.state]} ${status.state === "printing" ? "animate-pulse" : ""}`}
          />
          <span className="text-xs text-muted-foreground">{stateLabels[status.state]}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.fileName && (
          <div className="flex items-center gap-2 text-sm">
            <FileCode className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-xs truncate">{status.fileName}</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-mono">{status.progress.toFixed(1)}%</span>
          </div>
          <Progress value={status.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Temps écoulé</p>
            <p className="font-mono">{formatTime(status.timeElapsed)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Temps restant</p>
            <p className="font-mono">{formatTime(status.timeRemaining)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Hotend</p>
            <p className="font-mono">
              <span className="text-chart-4">{status.hotendTemp.toFixed(0)}°C</span>
              <span className="text-muted-foreground"> / {status.hotendTarget}°C</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Plateau</p>
            <p className="font-mono">
              <span className="text-chart-4">{status.bedTemp.toFixed(0)}°C</span>
              <span className="text-muted-foreground"> / {status.bedTarget}°C</span>
            </p>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground text-xs">Couche</p>
          <p className="font-mono">
            {status.layer} / {status.totalLayers}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" size="sm" className="flex-1">
            <Pause className="h-4 w-4 mr-1" />
            Pause
          </Button>
          <Button variant="destructive" size="sm" className="flex-1">
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
