"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Code2, Play, Save, Trash2, AlertCircle, CheckCircle2, Copy, FileCode } from "lucide-react"
import { type CustomModule, moduleTemplates, saveCustomModule, deleteCustomModule } from "@/lib/dynamic-modules"

interface ModuleEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingModule?: CustomModule | null
  onSave: () => void
}

const iconOptions = [
  "Activity",
  "AlertCircle",
  "BarChart",
  "Battery",
  "Bell",
  "Box",
  "Cpu",
  "Database",
  "Gauge",
  "HardDrive",
  "Heart",
  "LineChart",
  "Monitor",
  "Power",
  "Radio",
  "Server",
  "Settings",
  "Thermometer",
  "Wifi",
  "Zap",
]

export function ModuleEditor({ open, onOpenChange, editingModule, onSave }: ModuleEditorProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("Box")
  const [category, setCategory] = useState<CustomModule["category"]>("custom")
  const [code, setCode] = useState(moduleTemplates.basic)
  const [error, setError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)

  useEffect(() => {
    if (editingModule) {
      setName(editingModule.name)
      setDescription(editingModule.description)
      setIcon(editingModule.icon)
      setCategory(editingModule.category)
      setCode(editingModule.code)
    } else {
      setName("")
      setDescription("")
      setIcon("Box")
      setCategory("custom")
      setCode(moduleTemplates.basic)
    }
    setError(null)
    setTestResult(null)
  }, [editingModule, open])

  const handleTest = () => {
    try {
      new Function("React", "sensorData", "printerStatus", code)
      setTestResult("success")
      setError(null)
    } catch (err) {
      setTestResult("error")
      setError(err instanceof Error ? err.message : "Erreur de syntaxe")
    }
  }

  const handleSave = () => {
    if (!name.trim()) {
      setError("Le nom est requis")
      return
    }

    const id = editingModule?.id || name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now()

    saveCustomModule({
      id,
      name: name.trim(),
      description: description.trim(),
      icon,
      category,
      code,
      enabled: editingModule?.enabled ?? true,
    })

    onSave()
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (editingModule && confirm("Supprimer ce module ?")) {
      deleteCustomModule(editingModule.id)
      onSave()
      onOpenChange(false)
    }
  }

  const applyTemplate = (template: keyof typeof moduleTemplates) => {
    setCode(moduleTemplates[template])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-hidden flex flex-col gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            {editingModule ? "Modifier le module" : "Créer un module personnalisé"}
          </DialogTitle>
          <DialogDescription>
            Créez des modules React personnalisés pour étendre les fonctionnalités de PrintLink
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="config" className="flex-1 overflow-hidden flex flex-col px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="flex-1 overflow-auto space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du module</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mon module" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icône</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du module"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as CustomModule["category"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sensors">Capteurs</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="control">Contrôle</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Templates</Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => applyTemplate("basic")}>
                  <FileCode className="h-4 w-4 mr-1" /> Basique
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyTemplate("chart")}>
                  <FileCode className="h-4 w-4 mr-1" /> Graphique
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyTemplate("control")}>
                  <FileCode className="h-4 w-4 mr-1" /> Contrôle
                </Button>
                <Button variant="outline" size="sm" onClick={() => applyTemplate("api")}>
                  <FileCode className="h-4 w-4 mr-1" /> API
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 overflow-hidden flex flex-col py-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Code React</Label>
              <div className="flex items-center gap-2">
                {testResult === "success" && (
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Valide
                  </Badge>
                )}
                {testResult === "error" && (
                  <Badge variant="outline" className="text-destructive border-destructive">
                    <AlertCircle className="h-3 w-3 mr-1" /> Erreur
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={handleTest}>
                  <Play className="h-4 w-4 mr-1" /> Tester
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(code)}>
                  <Copy className="h-4 w-4 mr-1" /> Copier
                </Button>
              </div>
            </div>
            <Textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setTestResult(null)
              }}
              className="flex-1 font-mono text-sm resize-none min-h-[280px]"
              placeholder="// Votre code React ici..."
            />
            {error && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {error}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Props disponibles : <code className="px-1 py-0.5 rounded bg-secondary">sensorData</code>,{" "}
              <code className="px-1 py-0.5 rounded bg-secondary">printerStatus</code>. Utilisez{" "}
              <code className="px-1 py-0.5 rounded bg-secondary">React.useState</code> et{" "}
              <code className="px-1 py-0.5 rounded bg-secondary">React.useEffect</code> pour la logique.
            </p>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between px-6 py-4 border-t border-border mt-2">
          <div>
            {editingModule && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-1" /> Supprimer
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Enregistrer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
