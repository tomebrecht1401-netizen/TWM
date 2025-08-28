'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateContent } from '@/lib/api'
import { getStoredSettings, saveContent } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { Image, Download, Save } from 'lucide-react'

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<{ imageUrl: string, prompt: string, description: string } | null>(null)
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

      const response = await generateContent(prompt, 'image', 'sdxl', settings)
      setGeneratedImage(response)
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!generatedImage) return

    const content = {
      id: generateId(),
      type: 'image' as const,
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      content: generatedImage,
      createdAt: new Date()
    }

    saveContent(content)
    alert('Bild wurde in der Bibliothek gespeichert!')
  }

  const handleDownload = () => {
    if (!generatedImage) return

    const a = document.createElement('a')
    a.href = generatedImage.imageUrl
    a.download = 'generated-image.jpg'
    a.click()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Image className="mr-2" />
          Bild Generator
        </h1>
        <p className="text-muted-foreground">
          Generieren Sie einzigartige Bilder mit KI-Technologie.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bild beschreiben</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschreiben Sie das gewünschte Bild..."
              className="min-h-[200px]"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Generiere...' : 'Bild erstellen'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generiertes Bild
              {generatedImage && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Speichern
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
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
            ) : generatedImage ? (
              <div className="space-y-4">
                <img 
                  src={generatedImage.imageUrl} 
                  alt={generatedImage.description}
                  className="w-full rounded-lg"
                />
                <p className="text-sm text-muted-foreground">
                  {generatedImage.description}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-[400px] flex items-center justify-center">
                Generiertes Bild wird hier angezeigt
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}