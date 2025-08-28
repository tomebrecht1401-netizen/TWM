'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateContent } from '@/lib/api'
import { getStoredSettings, saveContent } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { Presentation, Download, Save, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface Slide {
  title: string
  content: string
}

export function PresentationGenerator() {
  const [prompt, setPrompt] = useState('')
  const [presentation, setPresentation] = useState<{ title: string, slides: Slide[] } | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
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

      const response = await generateContent(prompt, 'presentation', 'gpt-4', settings)
      setPresentation(response)
      setCurrentSlide(0)
    } catch (error) {
      console.error('Error generating presentation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!presentation) return

    const content = {
      id: generateId(),
      type: 'presentation' as const,
      title: presentation.title,
      content: presentation,
      createdAt: new Date()
    }

    saveContent(content)
    alert('Präsentation wurde in der Bibliothek gespeichert!')
  }

  const handleExportPDF = async () => {
    if (!presentation) return

    const pdf = new jsPDF('landscape')
    
    for (let i = 0; i < presentation.slides.length; i++) {
      if (i > 0) pdf.addPage()
      
      const slideElement = document.getElementById(`slide-${i}`)
      if (slideElement) {
        const canvas = await html2canvas(slideElement)
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 10, 10, 277, 190)
      }
    }
    
    pdf.save(`${presentation.title}.pdf`)
  }

  const nextSlide = () => {
    if (presentation && currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Presentation className="mr-2" />
          Präsentations Generator
        </h1>
        <p className="text-muted-foreground">
          Erstellen Sie professionelle Präsentationen mit KI-Unterstützung.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Präsentation beschreiben</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Thema und Inhalt der Präsentation..."
              className="min-h-[200px]"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Generiere...' : 'Präsentation erstellen'}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {presentation ? presentation.title : 'Präsentation'}
                {presentation && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Speichern
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                      <Download className="h-4 w-4 mr-1" />
                      PDF
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
              ) : presentation ? (
                <div className="space-y-4">
                  <div 
                    id={`slide-${currentSlide}`}
                    className="bg-white dark:bg-gray-900 p-8 rounded-lg border min-h-[400px] flex flex-col justify-center"
                  >
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <ReactMarkdown>{presentation.slides[currentSlide].content}</ReactMarkdown>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Zurück
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      Folie {currentSlide + 1} von {presentation.slides.length}
                    </span>
                    
                    <Button 
                      variant="outline" 
                      onClick={nextSlide}
                      disabled={currentSlide === presentation.slides.length - 1}
                    >
                      Weiter
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground h-[400px] flex items-center justify-center">
                  Präsentation wird hier angezeigt
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}