"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardGrid } from "@/components/dashboard-grid"
import { ModuleSettings } from "@/components/module-settings"
import { SettingsPanel } from "@/components/settings-panel"
import { EventLogPanel } from "@/components/event-log-panel"
import { LoginScreen } from "@/components/login-screen"
import { useModules } from "@/hooks/use-modules"
import { useSensorData } from "@/hooks/use-sensor-data"
import { usePrinterStatus } from "@/hooks/use-printer-status"
import { useAuth } from "@/hooks/use-auth"
import { addEvent } from "@/lib/event-log"

export default function Dashboard() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [eventLogOpen, setEventLogOpen] = useState(false)

  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth()
  const {
    modules,
    customModules,
    enabledModules,
    enabledCustomModules,
    toggleModule,
    toggleCustomModule,
    refreshCustomModules,
    isLoaded,
  } = useModules()
  const { data: sensorData, isConnected, lastUpdate, refresh } = useSensorData()
  const { status: printerStatus } = usePrinterStatus()

  // Log connection status changes
  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      addEvent("info", "system", isConnected ? "Connexion établie" : "Connexion perdue")
    }
  }, [isConnected, isLoaded, isAuthenticated])

  // Show loading state
  if (authLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={(password) => {
          const success = login(password)
          if (success) {
            addEvent("success", "auth", "Connexion réussie")
          } else {
            addEvent("warning", "auth", "Tentative de connexion échouée")
          }
          return success
        }}
      />
    )
  }

  const handleLogout = () => {
    addEvent("info", "auth", "Déconnexion")
    logout()
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        isConnected={isConnected}
        lastUpdate={lastUpdate}
        onRefresh={() => {
          refresh()
          addEvent("info", "system", "Actualisation manuelle")
        }}
        onSettingsClick={() => setSettingsOpen(true)}
        onEventLogClick={() => setEventLogOpen(true)}
        onConfigClick={() => setConfigOpen(true)}
      />

      <main className="container mx-auto px-4 py-6">
        <DashboardGrid
          enabledModules={enabledModules}
          enabledCustomModules={enabledCustomModules}
          sensorData={sensorData}
          printerStatus={printerStatus}
        />
      </main>

      <ModuleSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        modules={modules}
        customModules={customModules}
        onToggle={toggleModule}
        onToggleCustom={toggleCustomModule}
        onCustomModulesChange={refreshCustomModules}
      />

      <SettingsPanel open={configOpen} onOpenChange={setConfigOpen} onLogout={handleLogout} />

      <EventLogPanel open={eventLogOpen} onOpenChange={setEventLogOpen} />
    </div>
  )
}
