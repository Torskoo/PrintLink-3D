"use client"

import { useState, useEffect, useCallback } from "react"
import {
  validateSession,
  createSession,
  clearSession,
  getStoredPassword,
  setPassword as setStoredPassword,
} from "@/lib/auth"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const valid = validateSession()
    setIsAuthenticated(valid)
    setIsLoading(false)
  }, [])

  const login = useCallback((password: string): boolean => {
    const storedHash = getStoredPassword()
    const inputHash = password.split("").reduce((hash, char) => {
      hash = (hash << 5) - hash + char.charCodeAt(0)
      return hash & hash
    }, 0)
    const inputHashStr = Math.abs(inputHash).toString(36)

    if (inputHashStr === storedHash) {
      createSession()
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setIsAuthenticated(false)
  }, [])

  const changePassword = useCallback((newPassword: string) => {
    setStoredPassword(newPassword)
  }, [])

  return { isAuthenticated, isLoading, login, logout, changePassword }
}
