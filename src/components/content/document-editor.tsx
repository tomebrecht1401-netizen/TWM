'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { saveContent } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { FileText, Download, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export function DocumentEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSave = () => {
    if (!content.trim()) return

    const document = {
      id: generateId(),
      type: 'document' as const,
      title: title || 'Unbenanntes Dokument',
      content: { title, content },
      createdAt: new Date()
    }

    saveContent(document)
    alert('Dokument wurde in der Bibliothek gespeichert!')
  }

  const handleExportTXT = () => {
    if (!content.trim()) return

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'document'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <FileText className="mr-2" />
          Dokument Editor
        </h1>
        <p className="text-muted-foreground">
          Erstellen und bearbeiten Sie Dokumente mit Live-Vorschau.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dokumenttitel..."
              className="w-full p-2 border rounded-md bg-background"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dokumentinhalt (Markdown unterstützt)..."
              className="min-h-[400px] font-mono"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!content.trim()}>
                <Save className="h-4 w-4 mr-1" />
                Speichern
              </Button>
              <Button variant="outline" onClick={handleExportTXT} disabled={!content.trim()}>
                <Download className="h-4 w-4 mr-1" />
                TXT Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vorschau</CardTitle>
          </CardHeader>
          <CardContent>
            {content ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {title && <h1>{title}</h1>}
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-[400px] flex items-center justify-center">
                Dokumentvorschau wird hier angezeigt
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}