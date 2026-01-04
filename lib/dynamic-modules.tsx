"use client"

// Dynamic module system for user-created custom modules

export interface CustomModule {
  id: string
  name: string
  description: string
  icon: string
  category: "sensors" | "monitoring" | "control" | "system" | "custom"
  code: string
  enabled: boolean
  createdAt?: number
  updatedAt?: number
}

const CUSTOM_MODULES_KEY = "printlink-custom-modules"

export function getCustomModules(): CustomModule[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(CUSTOM_MODULES_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveCustomModule(module: CustomModule): void {
  const modules = getCustomModules()
  const existingIndex = modules.findIndex((m) => m.id === module.id)

  const updatedModule = {
    ...module,
    updatedAt: Date.now(),
    createdAt: module.createdAt || Date.now(),
  }

  if (existingIndex >= 0) {
    modules[existingIndex] = updatedModule
  } else {
    modules.push(updatedModule)
  }

  localStorage.setItem(CUSTOM_MODULES_KEY, JSON.stringify(modules))
}

export function deleteCustomModule(id: string): void {
  const modules = getCustomModules().filter((m) => m.id !== id)
  localStorage.setItem(CUSTOM_MODULES_KEY, JSON.stringify(modules))
}

export function toggleCustomModule(id: string): void {
  const modules = getCustomModules()
  const moduleIndex = modules.findIndex((m) => m.id === id)

  if (moduleIndex >= 0) {
    modules[moduleIndex].enabled = !modules[moduleIndex].enabled
    localStorage.setItem(CUSTOM_MODULES_KEY, JSON.stringify(modules))
  }
}

// Code templates for new modules
export const moduleTemplates = {
  basic: `function CustomModule({ sensorData, printerStatus }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <h3 className="font-medium mb-2">Mon Module</h3>
      <p className="text-sm text-muted-foreground">
        Température: {sensorData.temperature}°C
      </p>
    </div>
  );
}`,

  chart: `function ChartModule({ sensorData }) {
  const [data, setData] = React.useState([]);
  
  React.useEffect(() => {
    // Update data every 2 seconds
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev, { 
          time: new Date().toLocaleTimeString(), 
          value: sensorData.temperature 
        }];
        return newData.slice(-10); // Keep last 10 points
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [sensorData.temperature]);
  
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <h3 className="font-medium mb-3">Graphique Custom</h3>
      <div className="h-32 flex items-end gap-1">
        {data.map((d, i) => (
          <div 
            key={i}
            className="flex-1 bg-primary rounded-t"
            style={{ height: \`\${(d.value / 50) * 100}%\` }}
          />
        ))}
      </div>
    </div>
  );
}`,

  control: `function ControlModule({ sensorData, printerStatus }) {
  const [isOn, setIsOn] = React.useState(false);
  
  const handleToggle = async () => {
    // TODO: Call your API endpoint
    // await fetch('/api/control', { method: 'POST', body: JSON.stringify({ action: isOn ? 'off' : 'on' }) });
    setIsOn(!isOn);
  };
  
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <h3 className="font-medium mb-3">Contrôle</h3>
      <button
        onClick={handleToggle}
        className={\`w-full py-2 rounded-lg font-medium transition-colors \${
          isOn 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground'
        }\`}
      >
        {isOn ? 'Actif' : 'Inactif'}
      </button>
    </div>
  );
}`,

  api: `function ApiModule({ sensorData }) {
  const [apiData, setApiData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with your API endpoint
      const response = await fetch('/api/your-endpoint');
      const data = await response.json();
      setApiData(data);
    } catch (err) {
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <h3 className="font-medium mb-2">Données API</h3>
      {loading && <p className="text-sm text-muted-foreground">Chargement...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {apiData && (
        <pre className="text-xs bg-secondary p-2 rounded overflow-auto">
          {JSON.stringify(apiData, null, 2)}
        </pre>
      )}
    </div>
  );
}`,
}
