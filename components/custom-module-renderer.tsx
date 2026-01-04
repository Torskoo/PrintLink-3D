"use client"

import React, { useMemo } from "react"
import type { CustomModule } from "@/lib/dynamic-modules"
import type { SensorData } from "@/hooks/use-sensor-data"
import type { PrinterStatus } from "@/hooks/use-printer-status"
import { AlertCircle } from "lucide-react"

interface CustomModuleRendererProps {
  module: CustomModule
  sensorData: SensorData
  printerStatus: PrinterStatus
}

export function CustomModuleRenderer({ module, sensorData, printerStatus }: CustomModuleRendererProps) {
  const Component = useMemo(() => {
    try {
      // Create a function that returns the component
      const createComponent = new Function(
        "React",
        "sensorData",
        "printerStatus",
        `
        ${module.code}
        
        // Find the component function in the code
        const componentMatch = \`${module.code}\`.match(/function\\s+(\\w+)/);
        const componentName = componentMatch ? componentMatch[1] : null;
        
        if (typeof ${module.code.match(/function\s+(\w+)/)?.[1] || "CustomModule"} === 'function') {
          return ${module.code.match(/function\s+(\w+)/)?.[1] || "CustomModule"};
        }
        return null;
        `,
      )

      const ComponentFn = createComponent(React, sensorData, printerStatus)
      return ComponentFn
    } catch (err) {
      console.error("Error creating custom module:", err)
      return null
    }
  }, [module.code, sensorData, printerStatus])

  if (!Component) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">Erreur de module</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Impossible de charger le module "{module.name}"</p>
      </div>
    )
  }

  try {
    return <Component sensorData={sensorData} printerStatus={printerStatus} />
  } catch (err) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">Erreur d'exécution</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{err instanceof Error ? err.message : "Erreur inconnue"}</p>
      </div>
    )
  }
}
