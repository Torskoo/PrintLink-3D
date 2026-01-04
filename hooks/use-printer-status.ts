"use client"

import { useState, useEffect, useCallback } from "react"

export interface PrinterStatus {
  state: "idle" | "printing" | "paused" | "error" | "offline"
  progress: number
  fileName: string | null
  timeElapsed: number
  timeRemaining: number
  hotendTemp: number
  hotendTarget: number
  bedTemp: number
  bedTarget: number
  layer: number
  totalLayers: number
}

const mockStatus: PrinterStatus = {
  state: "printing",
  progress: 67,
  fileName: "benchy_v2.gcode",
  timeElapsed: 7245,
  timeRemaining: 3600,
  hotendTemp: 205,
  hotendTarget: 210,
  bedTemp: 58,
  bedTarget: 60,
  layer: 134,
  totalLayers: 200,
}

export function usePrinterStatus() {
  const [status, setStatus] = useState<PrinterStatus>(mockStatus)
  const [isConnected, setIsConnected] = useState(true)

  const refresh = useCallback(() => {
    // TODO: Replace with OctoPrint/Klipper API call
    // Example: fetch('http://your-printer-ip/api/job')
    setStatus((prev) => ({
      ...prev,
      progress: Math.min(100, prev.progress + Math.random() * 0.5),
      timeElapsed: prev.timeElapsed + 2,
      timeRemaining: Math.max(0, prev.timeRemaining - 2),
      hotendTemp: prev.hotendTarget + (Math.random() - 0.5) * 3,
      bedTemp: prev.bedTarget + (Math.random() - 0.5) * 2,
      layer: Math.min(prev.totalLayers, Math.floor(prev.layer + Math.random() * 0.3)),
    }))
  }, [])

  useEffect(() => {
    const interval = setInterval(refresh, 2000)
    return () => clearInterval(interval)
  }, [refresh])

  return { status, isConnected, refresh }
}
