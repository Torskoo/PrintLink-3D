export interface ModuleConfig {
  id: string
  name: string
  description: string
  icon: string
  enabled: boolean
  component: string
  category: "sensors" | "monitoring" | "control" | "system"
}

export const defaultModules: ModuleConfig[] = [
  {
    id: "camera",
    name: "Caméra",
    description: "Flux vidéo en direct de l'imprimante",
    icon: "Camera",
    enabled: true,
    component: "CameraModule",
    category: "monitoring",
  },
  {
    id: "temperature",
    name: "Température",
    description: "Surveillance de la température interne",
    icon: "Thermometer",
    enabled: true,
    component: "TemperatureModule",
    category: "sensors",
  },
  {
    id: "humidity",
    name: "Humidité",
    description: "Taux d'humidité dans l'enceinte",
    icon: "Droplets",
    enabled: true,
    component: "HumidityModule",
    category: "sensors",
  },
  {
    id: "power",
    name: "Consommation",
    description: "Consommation électrique en temps réel",
    icon: "Zap",
    enabled: true,
    component: "PowerModule",
    category: "monitoring",
  },
  {
    id: "printer-status",
    name: "Statut Imprimante",
    description: "État actuel de l'impression",
    icon: "Printer",
    enabled: true,
    component: "PrinterStatusModule",
    category: "control",
  },
  {
    id: "system-info",
    name: "Système",
    description: "Informations du système embarqué",
    icon: "Cpu",
    enabled: true,
    component: "SystemInfoModule",
    category: "system",
  },
]
