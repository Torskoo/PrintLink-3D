"use client"

import { useState, useEffect, useCallback } from "react"
import { type ModuleConfig, defaultModules } from "@/lib/module-registry"
import { type CustomModule, getCustomModules, toggleCustomModule as toggleCustom } from "@/lib/dynamic-modules"

const STORAGE_KEY = "printlink-modules"

export function useModules() {
  const [modules, setModules] = useState<ModuleConfig[]>(defaultModules)
  const [customModules, setCustomModules] = useState<CustomModule[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadModules = useCallback(() => {
    // Load default modules
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const merged = defaultModules.map((defaultModule) => {
          const savedModule = parsed.find((m: ModuleConfig) => m.id === defaultModule.id)
          return savedModule ? { ...defaultModule, enabled: savedModule.enabled } : defaultModule
        })
        setModules(merged)
      } catch {
        setModules(defaultModules)
      }
    }

    // Load custom modules
    setCustomModules(getCustomModules())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    loadModules()
  }, [loadModules])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(modules))
    }
  }, [modules, isLoaded])

  const toggleModule = useCallback((id: string) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)))
  }, [])

  const toggleCustomModule = useCallback((id: string) => {
    toggleCustom(id)
    setCustomModules(getCustomModules())
  }, [])

  const refreshCustomModules = useCallback(() => {
    setCustomModules(getCustomModules())
  }, [])

  const enabledModules = modules.filter((m) => m.enabled)
  const enabledCustomModules = customModules.filter((m) => m.enabled)

  return {
    modules,
    customModules,
    enabledModules,
    enabledCustomModules,
    toggleModule,
    toggleCustomModule,
    refreshCustomModules,
    isLoaded,
  }
}
