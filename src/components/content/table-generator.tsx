'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateContent } from '@/lib/api'
import { getStoredSettings, saveContent } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { Table, Download, Save } from 'lucide-react'
import * as XLSX from 'xlsx'

export function TableGenerator() {
  const [prompt, setPrompt] = useState('')
  const [tableData, setTableData] = useState<{ headers: string[], rows: string[][] } | null>(null)
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

      const response = await generateContent(prompt, 'table', 'gpt-4', settings)
      setTableData(response)
    } catch (error) {
      console.error('Error generating table:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!tableData) return

    const content = {
      id: generateId(),
      type: 'table' as const,
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      content: tableData,
      createdAt: new Date()
    }

    saveContent(content)
    alert('Tabelle wurde in der Bibliothek gespeichert!')
  }

  const handleExportCSV = () => {
    if (!tableData) return

    const csvContent = [
      tableData.headers.join(','),
      ...tableData.rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'table.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportXLSX = () => {
    if (!tableData) return

    const ws = XLSX.utils.aoa_to_sheet([tableData.headers, ...tableData.rows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, 'table.xlsx')
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Table className="mr-2" />
          Tabellen Generator
        </h1>
        <p className="text-muted-foreground">
          Erstellen Sie strukturierte Tabellen und Datenübersichten.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tabelle beschreiben</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschreiben Sie die gewünschte Tabelle..."
              className="min-h-[200px]"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Generiere...' : 'Tabelle erstellen'}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generierte Tabelle
                {tableData && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Speichern
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportCSV}>
                      <Download className="h-4 w-4 mr-1" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportXLSX}>
                      <Download className="h-4 w-4 mr-1" />
                      XLSX
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
              ) : tableData ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        {tableData.headers.map((header, index) => (
                          <th key={index} className="border border-border p-2 text-left font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.rows.map((row, rowIndex) => (
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
              ) : (
                <div className="text-center text-muted-foreground h-[300px] flex items-center justify-center">
                  Generierte Tabelle wird hier angezeigt
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}