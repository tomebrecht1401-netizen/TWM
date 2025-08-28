export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  followUpQuestions?: string[]
}

export interface TaskType {
  id: string
  name: string
  description: string
  icon: string
  models: AIModel[]
}

export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  apiKey?: string
}

export interface GeneratedContent {
  id: string
  type: 'text' | 'table' | 'presentation' | 'podcast' | 'image' | 'video' | 'document'
  title: string
  content: any
  createdAt: Date
  model?: string
}

export interface APISettings {
  openaiKey: string
  anthropicKey: string
  openrouterKey: string
  elevenlabsKey: string
  deepgramKey: string
  shotstackKey: string
  mockMode: boolean
}