"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, RefreshCw, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react"
import { type LogEvent, getEvents, clearEvents } from "@/lib/event-log"

interface EventLogPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
}

const typeColors = {
  info: "text-blue-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  success: "text-green-500",
}

export function EventLogPanel({ open, onOpenChange }: EventLogPanelProps) {
  const [events, setEvents] = useState<LogEvent[]>([])

  const loadEvents = () => {
    setEvents(getEvents())
  }

  useEffect(() => {
    if (open) {
      loadEvents()
    }
  }, [open])

  const handleClear = () => {
    if (confirm("Effacer tous les événements ?")) {
      clearEvents()
      loadEvents()
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border w-full sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Journal des événements</SheetTitle>
          <SheetDescription>Historique des activités de PrintLink</SheetDescription>
        </SheetHeader>

        <div className="flex gap-2 mt-4 px-1">
          <Button variant="outline" size="sm" onClick={loadEvents}>
            <RefreshCw className="h-4 w-4 mr-1" /> Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-1" /> Effacer
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] mt-4 px-1">
          {events.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 rounded-lg border border-dashed border-border">
              Aucun événement enregistré
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {events.map((event) => {
                const Icon = typeIcons[event.type]
                return (
                  <div key={event.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex items-start gap-2">
                      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${typeColors[event.type]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</span>
                        </div>
                        <p className="text-sm mt-1 break-words">{event.message}</p>
                        {event.details && (
                          <pre className="text-xs bg-background p-2 rounded mt-2 overflow-auto max-h-24">
                            {JSON.stringify(event.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
