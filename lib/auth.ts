// Simple password-based authentication for public access
// In production, replace with a proper auth system

const AUTH_STORAGE_KEY = "printlink-auth-token"
const AUTH_EXPIRY_KEY = "printlink-auth-expiry"
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Default password - in production, this should be set via environment variable
// or stored hashed in a database
export const DEFAULT_PASSWORD = "printlink"

export function hashPassword(password: string): string {
  // Simple hash for demo - in production use bcrypt on server
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export function verifyPassword(input: string, storedHash: string): boolean {
  return hashPassword(input) === storedHash
}

export function createSession(): string {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const expiry = Date.now() + SESSION_DURATION

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, token)
    localStorage.setItem(AUTH_EXPIRY_KEY, expiry.toString())
  }

  return token
}

export function validateSession(): boolean {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem(AUTH_STORAGE_KEY)
  const expiry = localStorage.getItem(AUTH_EXPIRY_KEY)

  if (!token || !expiry) return false

  if (Date.now() > Number.parseInt(expiry)) {
    clearSession()
    return false
  }

  return true
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(AUTH_EXPIRY_KEY)
  }
}

export function getStoredPassword(): string {
  if (typeof window === "undefined") return hashPassword(DEFAULT_PASSWORD)
  return localStorage.getItem("printlink-password-hash") || hashPassword(DEFAULT_PASSWORD)
}

export function setPassword(newPassword: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("printlink-password-hash", hashPassword(newPassword))
  }
}
