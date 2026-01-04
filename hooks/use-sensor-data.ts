"use client"

import { useState, useEffect, useCallback } from "react"

export interface SensorData {
  temperature: number
  humidity: number
  power: number
  powerHistory: number[]
  temperatureHistory: number[]
  humidityHistory: number[]
}

// Simulated data - replace with real API calls to your ESP/Raspberry Pi
function generateSensorData(prev: SensorData): SensorData {
  const temp = Math.max(20, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2))
  const humidity = Math.max(30, Math.min(70, prev.humidity + (Math.random() - 0.5) * 3))
  const power = Math.max(50, Math.min(300, prev.power + (Math.random() - 0.5) * 20))

  return {
    temperature: temp,
    humidity: humidity,
    power: power,
    powerHistory: [...prev.powerHistory.slice(-29), power],
    temperatureHistory: [...prev.temperatureHistory.slice(-29), temp],
    humidityHistory: [...prev.humidityHistory.slice(-29), humidity],
  }
}

const initialData: SensorData = {
  temperature: 25,
  humidity: 45,
  power: 120,
  powerHistory: Array(30).fill(120),
  temperatureHistory: Array(30).fill(25),
  humidityHistory: Array(30).fill(45),
}

export function useSensorData(refreshInterval = 2000) {
  const [data, setData] = useState<SensorData>(initialData)
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const refresh = useCallback(() => {
    // TODO: Replace with actual API call
    // Example: fetch('http://your-esp-ip/api/sensors')
    setData((prev) => generateSensorData(prev))
    setLastUpdate(new Date())
  }, [])

  useEffect(() => {
    const interval = setInterval(refresh, refreshInterval)
    return () => clearInterval(interval)
  }, [refresh, refreshInterval])

  return { data, isConnected, lastUpdate, refresh }
}
