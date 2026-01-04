"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, HardDrive, Wifi, Clock } from "lucide-react"
import { useEffect, useState } from "react"

export function SystemInfoModule() {
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${d}j ${h}h ${m}m`
  }

  // Simulated system data - replace with actual ESP/Raspberry Pi data
  const systemData = {
    cpu: 23,
    memory: 45,
    storage: 62,
    ip: "192.168.1.100",
    hostname: "printlink-controller",
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Cpu className="h-4 w-4 text-chart-5" />
          Système
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Cpu className="h-3 w-3" />
            CPU
          </span>
          <span className="font-mono">{systemData.cpu}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <HardDrive className="h-3 w-3" />
            Mémoire
          </span>
          <span className="font-mono">{systemData.memory}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Wifi className="h-3 w-3" />
            IP
          </span>
          <span className="font-mono text-xs">{systemData.ip}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            Uptime
          </span>
          <span className="font-mono text-xs">{formatUptime(uptime)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
