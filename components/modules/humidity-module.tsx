"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface HumidityModuleProps {
  humidity: number
  history: number[]
}

export function HumidityModule({ humidity, history }: HumidityModuleProps) {
  const trend = history.length > 1 ? history[history.length - 1] - history[history.length - 2] : 0

  const data = history.map((value, index) => ({ value, index }))

  const TrendIcon = trend > 0.5 ? TrendingUp : trend < -0.5 ? TrendingDown : Minus
  const trendColor = trend > 0.5 ? "text-chart-2" : trend < -0.5 ? "text-chart-4" : "text-muted-foreground"

  const getStatusColor = (h: number) => {
    if (h < 35 || h > 65) return "text-destructive"
    if (h < 40 || h > 55) return "text-chart-3"
    return "text-primary"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Droplets className="h-4 w-4 text-chart-2" />
          Humidité
        </CardTitle>
        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold font-mono ${getStatusColor(humidity)}`}>{humidity.toFixed(1)}</span>
          <span className="text-muted-foreground">%</span>
        </div>
        <div className="h-16 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-2)"
                fill="url(#humidityGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Optimal: 40-55%</p>
      </CardContent>
    </Card>
  )
}
