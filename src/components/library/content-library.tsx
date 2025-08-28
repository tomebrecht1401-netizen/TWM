'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getStoredContent, deleteContent } from '@/lib/storage'
import { GeneratedContent } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { 
  Library, 
  FileText, 
  Table, 
  Presentation, 
  Mic, 
  Image, 
  Video, 
  Trash2,
  Eye 
} from 'lucide-react'

const typeIcons = {
  text: FileText,
  table: Table,
  presentation: Presentation,
  podcast: Mic,
  image: Image,
  video: Video,
  document: FileText
}

export function ContentLibrary() {
  const [content, setContent] = useState<GeneratedContent[]>([])
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null)

  useEffect(() => {
    setContent(getStoredContent())
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Möchten Sie diesen Inhalt wirklich löschen?')) {
      deleteContent(id)
      setContent(getStoredContent())
      if (selectedContent?.id === id) {
        setSelectedContent(null)
      }
    }
  }

  const handleView = (item: GeneratedContent) => {
    setSelectedContent(item)
  }

  const renderContent = (item: GeneratedContent) => {
    switch (item.type) {
      case 'text':
      case 'document':
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: item.content.content || item.content }} />
          </div>
        )
      
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  {item.content.headers?.map((header: string, index: number) => (
                    <th key={index} className="border border-border p-2 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.content.rows?.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className="hover:bg-muted/50">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-border p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      
      case 'presentation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{item.content.title}</h3>
            <p className="text-sm text-muted-foreground">
              {item.content.slides?.length} Folien
            </p>
          </div>
        )
      
      case 'image':
        return (
          <div className="space-y-2">
            <img 
              src={item.content.imageUrl} 
              alt={item.content.description}
              className="w-full rounded-lg max-h-64 object-cover"
            />
            <p className="text-sm text-muted-foreground">
              {item.content.description}
            </p>
          </div>
        )
      
      default:
        return <p>Unbekannter Inhaltstyp</p>
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Library className="mr-2" />
          Bibliothek
        </h1>
        <p className="text-muted-foreground">
          Verwalten Sie alle Ihre generierten Inhalte an einem Ort.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Gespeicherte Inhalte ({content.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {content.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Noch keine Inhalte gespeichert
                </p>
              ) : (
                <div className="space-y-2">
                  {content.map((item) => {
                    const Icon = typeIcons[item.type]
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted ${
                          selectedContent?.id === item.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => handleView(item)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2 flex-1">
                            <Icon className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(new Date(item.createdAt))}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedContent ? selectedContent.title : 'Inhalt auswählen'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedContent ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const Icon = typeIcons[selectedContent.type]
                        return <Icon className="h-4 w-4" />
                      })()}
                      <span className="text-sm text-muted-foreground capitalize">
                        {selectedContent.type}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        • {formatDate(new Date(selectedContent.createdAt))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="max-h-[500px] overflow-y-auto">
                    {renderContent(selectedContent)}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground h-[400px] flex items-center justify-center">
                  <div className="space-y-2">
                    <Eye className="h-8 w-8 mx-auto" />
                    <p>Wählen Sie einen Inhalt aus der Liste aus</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}