"use client"

import type React from "react"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ModuleConfig } from "@/lib/module-registry"
import type { CustomModule } from "@/lib/dynamic-modules"
import {
  Camera,
  Thermometer,
  Droplets,
  Zap,
  Printer,
  Cpu,
  Plus,
  Edit,
  Activity,
  AlertCircle,
  BarChart,
  Battery,
  Bell,
  Box,
  Database,
  Gauge,
  HardDrive,
  Heart,
  LineChart,
  Monitor,
  Power,
  Radio,
  Server,
  Settings,
  Wifi,
} from "lucide-react"
import { ModuleEditor } from "./module-editor"

const iconMap: Record<string, React.ElementType> = {
  Camera,
  Thermometer,
  Droplets,
  Zap,
  Printer,
  Cpu,
  Activity,
  AlertCircle,
  BarChart,
  Battery,
  Bell,
  Box,
  Database,
  Gauge,
  HardDrive,
  Heart,
  LineChart,
  Monitor,
  Power,
  Radio,
  Server,
  Settings,
  Wifi,
}

interface ModuleSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  modules: ModuleConfig[]
  customModules: CustomModule[]
  onToggle: (id: string) => void
  onToggleCustom: (id: string) => void
  onCustomModulesChange: () => void
}

export function ModuleSettings({
  open,
  onOpenChange,
  modules,
  customModules,
  onToggle,
  onToggleCustom,
  onCustomModulesChange,
}: ModuleSettingsProps) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<CustomModule | null>(null)

  const categories = {
    monitoring: "Monitoring",
    sensors: "Capteurs",
    control: "Contrôle",
    system: "Système",
    custom: "Personnalisé",
  }

  const groupedModules = modules.reduce(
    (acc, module) => {
      if (!acc[module.category]) acc[module.category] = []
      acc[module.category].push(module)
      return acc
    },
    {} as Record<string, ModuleConfig[]>,
  )

  const handleNewModule = () => {
    setEditingModule(null)
    setEditorOpen(true)
  }

  const handleEditModule = (module: CustomModule) => {
    setEditingModule(module)
    setEditorOpen(true)
  }

  const handleEditorSave = () => {
    onCustomModulesChange()
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="bg-card border-border w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="px-1">
            <SheetTitle>Configuration des modules</SheetTitle>
            <SheetDescription>Activez ou désactivez les modules selon vos besoins</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6 px-1">
            {/* Default modules */}
            {Object.entries(groupedModules).map(([category, categoryModules]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {categories[category as keyof typeof categories]}
                </h3>
                <div className="space-y-2">
                  {categoryModules.map((module) => {
                    const Icon = iconMap[module.icon] || Cpu
                    return (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-md bg-background flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <Label htmlFor={module.id} className="text-sm font-medium">
                              {module.name}
                            </Label>
                            <p className="text-xs text-muted-foreground truncate">{module.description}</p>
                          </div>
                        </div>
                        <Switch
                          id={module.id}
                          checked={module.enabled}
                          onCheckedChange={() => onToggle(module.id)}
                          className="shrink-0 ml-2"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            <Separator />

            {/* Custom modules section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Modules personnalisés</h3>
                <Button variant="outline" size="sm" onClick={handleNewModule}>
                  <Plus className="h-4 w-4 mr-1" /> Nouveau
                </Button>
              </div>

              {customModules.length === 0 ? (
                <div className="p-4 rounded-lg border border-dashed border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    Aucun module personnalisé. Cliquez sur "Nouveau" pour en créer un.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customModules.map((module) => {
                    const Icon = iconMap[module.icon] || Box
                    return (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-md bg-background flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium truncate">{module.name}</Label>
                              <Badge variant="outline" className="text-xs shrink-0">
                                Custom
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditModule(module)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Switch checked={module.enabled} onCheckedChange={() => onToggleCustom(module.id)} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ModuleEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editingModule={editingModule}
        onSave={handleEditorSave}
      />
    </>
  )
}
