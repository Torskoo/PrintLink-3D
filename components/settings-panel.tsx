"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Lock, Eye, EyeOff, RotateCcw, Download, Upload, CheckCircle2, Github } from "lucide-react"
import { setPassword } from "@/lib/auth"

interface SettingsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogout: () => void
}

export function SettingsPanel({ open, onOpenChange, onLogout }: SettingsPanelProps) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  // Settings state
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState("5")
  const [notifications, setNotifications] = useState(true)

  const handlePasswordChange = () => {
    if (newPassword.length < 4) {
      setPasswordError("Le mot de passe doit contenir au moins 4 caractères")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas")
      return
    }

    setPassword(newPassword)
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setPasswordSuccess(true)
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  const handleExportConfig = () => {
    const config = {
      modules: localStorage.getItem("printlink-modules"),
      customModules: localStorage.getItem("printlink-custom-modules"),
      settings: {
        autoRefresh,
        refreshInterval,
        notifications,
      },
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `printlink-config-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportConfig = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const config = JSON.parse(text)

        if (config.modules) {
          localStorage.setItem("printlink-modules", config.modules)
        }
        if (config.customModules) {
          localStorage.setItem("printlink-custom-modules", config.customModules)
        }

        window.location.reload()
      } catch (err) {
        alert("Erreur lors de l'import de la configuration")
      }
    }
    input.click()
  }

  const handleReset = () => {
    localStorage.removeItem("printlink-modules")
    localStorage.removeItem("printlink-custom-modules")
    localStorage.removeItem("printlink-password-hash")
    localStorage.removeItem("printlink-auth-token")
    localStorage.removeItem("printlink-auth-expiry")
    localStorage.removeItem("printlink-event-log")
    window.location.reload()
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="bg-card border-border w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="px-1">
            <SheetTitle>Paramètres</SheetTitle>
            <SheetDescription>Configuration générale de PrintLink</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6 px-1">
            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" /> Sécurité
              </h3>

              <div className="space-y-4 rounded-lg border border-border p-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        setPasswordError("")
                      }}
                      placeholder="Nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setPasswordError("")
                    }}
                    placeholder="Confirmer le mot de passe"
                  />
                </div>

                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}

                {passwordSuccess && (
                  <p className="text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Mot de passe modifié
                  </p>
                )}

                <Button onClick={handlePasswordChange} className="w-full">
                  Changer le mot de passe
                </Button>

                <Button variant="outline" onClick={onLogout} className="w-full bg-transparent">
                  Se déconnecter
                </Button>
              </div>
            </div>

            <Separator />

            {/* Refresh Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Actualisation</h3>

              <div className="space-y-4 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-refresh">Actualisation automatique</Label>
                  <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                </div>

                {autoRefresh && (
                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">Intervalle (secondes)</Label>
                    <Input
                      id="refresh-interval"
                      type="number"
                      min="1"
                      max="60"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notifications</h3>

              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Activer les alertes</Label>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Import/Export */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Sauvegarde</h3>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportConfig} className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-1" /> Exporter
                </Button>
                <Button variant="outline" size="sm" onClick={handleImportConfig} className="flex-1 bg-transparent">
                  <Upload className="h-4 w-4 mr-1" /> Importer
                </Button>
              </div>
            </div>

            <Separator />

            {/* GitHub Link */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Projet</h3>

              <a
                href="https://github.com/Torskoo/PrintLink-3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors"
              >
                <Github className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">PrintLink 3D</p>
                  <p className="text-xs text-muted-foreground">Contribuer sur GitHub</p>
                </div>
              </a>
            </div>

            <Separator />

            {/* Reset */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-destructive">Zone de danger</h3>

              <Button variant="destructive" size="sm" onClick={() => setResetDialogOpen(true)} className="w-full">
                <RotateCcw className="h-4 w-4 mr-1" /> Réinitialiser tout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser toute la configuration ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera tous vos modules personnalisés, paramètres et vous déconnectera. Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
              Réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
