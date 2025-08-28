import { GeneratedContent, APISettings } from './types'

const STORAGE_KEYS = {
  CONTENT: 'twm_content',
  SETTINGS: 'twm_settings',
  CHAT_HISTORY: 'twm_chat_history'
}

export function saveContent(content: GeneratedContent): void {
  const existing = getStoredContent()
  const updated = [content, ...existing]
  localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(updated))
}

export function getStoredContent(): GeneratedContent[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONTENT)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function deleteContent(id: string): void {
  const existing = getStoredContent()
  const filtered = existing.filter(item => item.id !== id)
  localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(filtered))
}

export function saveSettings(settings: APISettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

export function getStoredSettings(): APISettings | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function saveChatHistory(messages: any[]): void {
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages))
}

export function getChatHistory(): any[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}