'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateContent, synthesizeSpeech } from '@/lib/api'
import { getStoredSettings, saveContent } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { Mic, Download, Save, Play, Pause } from 'lucide-react'
import { useRef } from 'react'

export function PodcastGenerator() {
  const [prompt, setPrompt] = useState('')
  const [podcast, setPodcast] = useState<{ title: string, script: string, audioUrl?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

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

      const response = await generateContent(prompt, 'podcast', 'gpt-4', settings)
      setPodcast(response)
    } catch (error) {
      console.error('Error generating podcast:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateAudio = async () => {
    if (!podcast) return

    setIsGeneratingAudio(true)
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

      const audioUrl = await synthesizeSpeech(podcast.script, settings)
      setPodcast(prev => prev ? { ...prev, audioUrl } : null)
    } catch (error) {
      console.error('Error generating audio:', error)
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  const handleSave = () => {
    if (!podcast) return

    const content = {
      id: generateId(),
      type: 'podcast' as const,
      title: podcast.title,
      content: podcast,
      createdAt: new Date()
    }

    saveContent(content)
    alert('Podcast wurde in der Bibliothek gespeichert!')
  }

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Mic className="mr-2" />
          Podcast Generator
        </h1>
        <p className="text-muted-foreground">
          Erstellen Sie Podcast-Skripte und Audio-Inhalte.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Podcast-Thema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschreiben Sie das Podcast-Thema..."
              className="min-h-[200px]"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Generiere...' : 'Skript erstellen'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {podcast ? podcast.title : 'Podcast-Skript'}
              {podcast && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Speichern
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerateAudio} disabled={isGeneratingAudio}>
                    <Mic className="h-4 w-4 mr-1" />
                    {isGeneratingAudio ? 'Generiere...' : 'Audio'}
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : podcast ? (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none dark:prose-invert max-h-[250px] overflow-y-auto">
                  <p>{podcast.script}</p>
                </div>
                
                {podcast.audioUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={togglePlayback}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <span className="text-sm text-muted-foreground">Audio abspielen</span>
                    </div>
                    <audio
                      ref={audioRef}
                      src={podcast.audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full"
                      controls
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-[300px] flex items-center justify-center">
                Podcast-Skript wird hier angezeigt
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}