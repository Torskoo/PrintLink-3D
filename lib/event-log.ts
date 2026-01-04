// Event logging system for tracking dashboard activity

export interface LogEvent {
  id: string
  timestamp: number
  type: "info" | "warning" | "error" | "success"
  category: "system" | "sensor" | "printer" | "auth" | "module"
  message: string
  details?: Record<string, unknown>
}

const LOG_STORAGE_KEY = "printlink-event-log"
const MAX_EVENTS = 100

export function getEvents(): LogEvent[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(LOG_STORAGE_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function addEvent(
  type: LogEvent["type"],
  category: LogEvent["category"],
  message: string,
  details?: Record<string, unknown>,
): LogEvent {
  const event: LogEvent = {
    id: Math.random().toString(36).substring(2),
    timestamp: Date.now(),
    type,
    category,
    message,
    details,
  }

  const events = getEvents()
  events.unshift(event)

  // Keep only the last MAX_EVENTS
  const trimmed = events.slice(0, MAX_EVENTS)
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(trimmed))

  return event
}

export function clearEvents(): void {
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify([]))
}
