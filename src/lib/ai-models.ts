import { TaskType, AIModel } from './types'

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Fortschrittlichstes Sprachmodell für komplexe Aufgaben'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Schnell und effizient für die meisten Aufgaben'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Exzellent für kreative und analytische Aufgaben'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Ausgewogen zwischen Geschwindigkeit und Qualität'
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'OpenRouter',
    description: 'Open-Source-Modell mit starker Leistung'
  }
]

export const TASK_TYPES: TaskType[] = [
  {
    id: 'text',
    name: 'Text erstellen',
    description: 'Artikel, Blogs, Geschichten und andere Texte',
    icon: 'FileText',
    models: AI_MODELS.slice(0, 3)
  },
  {
    id: 'table',
    name: 'Tabelle erstellen',
    description: 'Datenstrukturen und Vergleichstabellen',
    icon: 'Table',
    models: AI_MODELS.slice(0, 3)
  },
  {
    id: 'presentation',
    name: 'Präsentation',
    description: 'Folien und Präsentationen erstellen',
    icon: 'Presentation',
    models: AI_MODELS.slice(0, 3)
  },
  {
    id: 'podcast',
    name: 'Podcast',
    description: 'Audio-Inhalte und Skripte generieren',
    icon: 'Mic',
    models: [AI_MODELS[0], AI_MODELS[2]]
  },
  {
    id: 'image',
    name: 'Bild generieren',
    description: 'KI-generierte Bilder und Grafiken',
    icon: 'Image',
    models: [AI_MODELS[4]]
  },
  {
    id: 'video',
    name: 'Video erstellen',
    description: 'Kurze Videos und Animationen',
    icon: 'Video',
    models: [AI_MODELS[0]]
  }
]

export function getModelsForTask(taskId: string): AIModel[] {
  const task = TASK_TYPES.find(t => t.id === taskId)
  return task?.models || AI_MODELS.slice(0, 3)
}

export function detectTaskType(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('tabelle') || lowerPrompt.includes('daten') || lowerPrompt.includes('vergleich')) {
    return 'table'
  }
  if (lowerPrompt.includes('präsentation') || lowerPrompt.includes('folien') || lowerPrompt.includes('slides')) {
    return 'presentation'
  }
  if (lowerPrompt.includes('podcast') || lowerPrompt.includes('audio') || lowerPrompt.includes('sprechen')) {
    return 'podcast'
  }
  if (lowerPrompt.includes('bild') || lowerPrompt.includes('foto') || lowerPrompt.includes('grafik')) {
    return 'image'
  }
  if (lowerPrompt.includes('video') || lowerPrompt.includes('film') || lowerPrompt.includes('animation')) {
    return 'video'
  }
  
  return 'text'
}