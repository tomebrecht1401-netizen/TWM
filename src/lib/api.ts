import { APISettings } from './types'

export async function generateContent(
  prompt: string,
  taskType: string,
  model: string,
  settings: APISettings
): Promise<any> {
  if (settings.mockMode) {
    return generateMockContent(taskType, prompt)
  }

  // Real API calls would go here
  // For now, return mock data
  return generateMockContent(taskType, prompt)
}

export async function generateFollowUpQuestions(
  content: string,
  settings: APISettings
): Promise<string[]> {
  if (settings.mockMode) {
    return [
      'Kannst du das weiter ausführen?',
      'Welche Alternativen gibt es?',
      'Wie kann ich das praktisch umsetzen?'
    ]
  }

  // Real API call would go here
  return [
    'Kannst du das weiter ausführen?',
    'Welche Alternativen gibt es?',
    'Wie kann ich das praktisch umsetzen?'
  ]
}

export async function transcribeAudio(
  audioBlob: Blob,
  settings: APISettings
): Promise<string> {
  if (settings.mockMode) {
    return 'Das ist eine Demo-Transkription des aufgenommenen Audios.'
  }

  // Real API call to Deepgram or OpenAI Whisper would go here
  return 'Das ist eine Demo-Transkription des aufgenommenen Audios.'
}

export async function synthesizeSpeech(
  text: string,
  settings: APISettings
): Promise<string> {
  if (settings.mockMode) {
    // Return a demo audio URL
    return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuR2O/AciMFl'
  }

  // Real API call to ElevenLabs would go here
  return 'demo-audio-url'
}

function generateMockContent(taskType: string, prompt: string): any {
  switch (taskType) {
    case 'text':
      return {
        content: `# ${prompt}\n\nDies ist ein generierter Text basierend auf Ihrem Prompt: "${prompt}"\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\n## Hauptpunkte\n\n- Punkt 1: Wichtige Information\n- Punkt 2: Weitere Details\n- Punkt 3: Zusammenfassung\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
      }
    
    case 'table':
      return {
        headers: ['Name', 'Kategorie', 'Wert', 'Status'],
        rows: [
          ['Produkt A', 'Kategorie 1', '€99', 'Verfügbar'],
          ['Produkt B', 'Kategorie 2', '€149', 'Ausverkauft'],
          ['Produkt C', 'Kategorie 1', '€79', 'Verfügbar'],
          ['Produkt D', 'Kategorie 3', '€199', 'Vorbestellung']
        ]
      }
    
    case 'presentation':
      return {
        title: prompt,
        slides: [
          {
            title: 'Einführung',
            content: `# ${prompt}\n\nWillkommen zu dieser Präsentation über "${prompt}"`
          },
          {
            title: 'Hauptpunkte',
            content: '## Wichtige Aspekte\n\n- Punkt 1\n- Punkt 2\n- Punkt 3'
          },
          {
            title: 'Details',
            content: '## Detaillierte Analyse\n\nHier finden Sie eine ausführliche Betrachtung des Themas.'
          },
          {
            title: 'Fazit',
            content: '## Zusammenfassung\n\nDie wichtigsten Erkenntnisse und nächste Schritte.'
          }
        ]
      }
    
    case 'podcast':
      return {
        title: prompt,
        script: `Willkommen zu unserem Podcast über "${prompt}". In dieser Episode werden wir verschiedene Aspekte dieses faszinierenden Themas erkunden...`,
        audioUrl: 'demo-audio-url'
      }
    
    case 'image':
      return {
        imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
        prompt: prompt,
        description: `Ein KI-generiertes Bild basierend auf: "${prompt}"`
      }
    
    case 'video':
      return {
        videoUrl: 'demo-video-url',
        prompt: prompt,
        description: `Ein KI-generiertes Video basierend auf: "${prompt}"`
      }
    
    default:
      return { content: 'Unbekannter Task-Typ' }
  }
}