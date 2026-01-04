"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface PowerModuleProps {
  power: number
  history: number[]
}

export function PowerModule({ power, history }: PowerModuleProps) {
  const trend = history.length > 1 ? history[history.length - 1] - history[history.length - 2] : 0

  const data = history.map((value, index) => ({ value, index }))
  const avgPower = history.reduce((a, b) => a + b, 0) / history.length

  const TrendIcon = trend > 5 ? TrendingUp : trend < -5 ? TrendingDown : Minus

  return (
    <Card className="col-span-2 bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Zap className="h-4 w-4 text-chart-3" />
          Consommation Électrique
        </CardTitle>
        <TrendIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono">{power.toFixed(0)}</span>
              <span className="text-muted-foreground">W</span>
            </div>
            <p className="text-xs text-muted-foreground">Instantané</p>
          </div>
          <div className="border-l border-border pl-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold font-mono">{avgPower.toFixed(0)}</span>
              <span className="text-muted-foreground text-sm">W</span>
            </div>
            <p className="text-xs text-muted-foreground">Moyenne</p>
          </div>
        </div>
        <div className="h-24 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="index" hide />
              <YAxis domain={["dataMin - 20", "dataMax + 20"]} hide />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-3)"
                fill="url(#powerGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
