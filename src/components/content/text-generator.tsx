'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateContent } from '@/lib/api'
import { getStoredSettings, saveContent } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { FileText, Download, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export function TextGenerator() {
  const [prompt, setPrompt] = useState('')
  const [generatedText, setGeneratedText] = useState('')
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

      const response = await generateContent(prompt, 'text', 'gpt-4', settings)
      setGeneratedText(response.content)
    } catch (error) {
      console.error('Error generating text:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!generatedText) return

    const content = {
      id: generateId(),
      type: 'text' as const,
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      content: generatedText,
      createdAt: new Date()
    }

    saveContent(content)
    alert('Text wurde in der Bibliothek gespeichert!')
  }

  const handleExport = () => {
    if (!generatedText) return

    const blob = new Blob([generatedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-text.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <FileText className="mr-2" />
          Text Generator
        </h1>
        <p className="text-muted-foreground">
          Erstellen Sie hochwertige Texte, Artikel und Inhalte mit KI-Unterstützung.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prompt eingeben</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschreiben Sie, welchen Text Sie erstellen möchten..."
              className="min-h-[200px]"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Generiere...' : 'Text generieren'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generierter Text
              {generatedText && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Speichern
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : generatedText ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{generatedText}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-[200px] flex items-center justify-center">
                Generierter Text wird hier angezeigt
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}