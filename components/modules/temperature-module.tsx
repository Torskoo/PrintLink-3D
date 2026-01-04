"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface TemperatureModuleProps {
  temperature: number
  history: number[]
}

export function TemperatureModule({ temperature, history }: TemperatureModuleProps) {
  const trend = history.length > 1 ? history[history.length - 1] - history[history.length - 2] : 0

  const data = history.map((value, index) => ({ value, index }))

  const TrendIcon = trend > 0.5 ? TrendingUp : trend < -0.5 ? TrendingDown : Minus
  const trendColor = trend > 0.5 ? "text-chart-4" : trend < -0.5 ? "text-chart-2" : "text-muted-foreground"

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Thermometer className="h-4 w-4 text-chart-4" />
          Température
        </CardTitle>
        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono">{temperature.toFixed(1)}</span>
          <span className="text-muted-foreground">°C</span>
        </div>
        <div className="h-16 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="var(--chart-4)" fill="url(#tempGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Optimal: 22-28°C</p>
      </CardContent>
    </Card>
  )
}
