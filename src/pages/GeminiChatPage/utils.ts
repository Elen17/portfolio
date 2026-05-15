import type { ChatMessage } from '../../api/gemini'

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function loadStoredMessages(storageKey: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ChatMessage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
