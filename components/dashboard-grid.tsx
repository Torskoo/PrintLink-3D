"use client"

import { CameraModule } from "@/components/modules/camera-module"
import { TemperatureModule } from "@/components/modules/temperature-module"
import { HumidityModule } from "@/components/modules/humidity-module"
import { PowerModule } from "@/components/modules/power-module"
import { PrinterStatusModule } from "@/components/modules/printer-status-module"
import { SystemInfoModule } from "@/components/modules/system-info-module"
import { CustomModuleRenderer } from "@/components/custom-module-renderer"
import type { ModuleConfig } from "@/lib/module-registry"
import type { CustomModule } from "@/lib/dynamic-modules"
import type { SensorData } from "@/hooks/use-sensor-data"
import type { PrinterStatus } from "@/hooks/use-printer-status"

interface DashboardGridProps {
  enabledModules: ModuleConfig[]
  enabledCustomModules: CustomModule[]
  sensorData: SensorData
  printerStatus: PrinterStatus
}

export function DashboardGrid({ enabledModules, enabledCustomModules, sensorData, printerStatus }: DashboardGridProps) {
  const renderModule = (module: ModuleConfig) => {
    switch (module.id) {
      case "camera":
        return <CameraModule key={module.id} />
      case "temperature":
        return (
          <TemperatureModule
            key={module.id}
            temperature={sensorData.temperature}
            history={sensorData.temperatureHistory}
          />
        )
      case "humidity":
        return <HumidityModule key={module.id} humidity={sensorData.humidity} history={sensorData.humidityHistory} />
      case "power":
        return <PowerModule key={module.id} power={sensorData.power} history={sensorData.powerHistory} />
      case "printer-status":
        return <PrinterStatusModule key={module.id} status={printerStatus} />
      case "system-info":
        return <SystemInfoModule key={module.id} />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
      {enabledModules.map(renderModule)}
      {enabledCustomModules.map((module) => (
        <CustomModuleRenderer key={module.id} module={module} sensorData={sensorData} printerStatus={printerStatus} />
      ))}
    </div>
  )
}
