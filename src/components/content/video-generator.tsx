'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateContent } from '@/lib/api'
import { getStoredSettings, saveContent } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { Video, Download, Save, Play } from 'lucide-react'

export function VideoGenerator() {
  const [prompt, setPrompt] = useState('')
  const [generatedVideo, setGeneratedVideo] = useState<{ videoUrl: string, prompt: string, description: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    try {
      const settings = getStoredSettings() || {
        openaiKey: '',
        anthropicKey: '',
        openrouterKey: '',
        elevenlabsKey: '',
        deepgramKey: '',
        shotstackKey: '',
        mockMode: true
      }

      const response = await generateContent(prompt, 'video', 'gpt-4', settings)
      setGeneratedVideo(response)
    } catch (error) {
      console.error('Error generating video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!generatedVideo) return

    const content = {
      id: generateId(),
      type: 'video' as const,
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      content: generatedVideo,
      createdAt: new Date()
    }

    saveContent(content)
    alert('Video wurde in der Bibliothek gespeichert!')
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Video className="mr-2" />
          Video Generator
        </h1>
        <p className="text-muted-foreground">
          Erstellen Sie kurze Videos und Animationen mit KI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Video beschreiben</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschreiben Sie das gewünschte Video..."
              className="min-h-[200px]"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Generiere...' : 'Video erstellen'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generiertes Video
              {generatedVideo && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Speichern
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : generatedVideo ? (
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <Play className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Video-Vorschau (Demo-Modus)
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {generatedVideo.description}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-[400px] flex items-center justify-center">
                Generiertes Video wird hier angezeigt
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}