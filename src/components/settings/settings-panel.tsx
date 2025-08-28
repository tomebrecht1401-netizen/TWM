'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { APISettings } from '@/lib/types'
import { getStoredSettings, saveSettings } from '@/lib/storage'
import { Settings, Key, TestTube } from 'lucide-react'

export function SettingsPanel() {
  const [settings, setSettings] = useState<APISettings>({
    openaiKey: '',
    anthropicKey: '',
    openrouterKey: '',
    elevenlabsKey: '',
    deepgramKey: '',
    shotstackKey: '',
    mockMode: true
  })

  useEffect(() => {
    const stored = getStoredSettings()
    if (stored) {
      setSettings(stored)
    }
  }, [])

  const handleSave = () => {
    saveSettings(settings)
    alert('Einstellungen wurden gespeichert!')
  }

  const handleInputChange = (key: keyof APISettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Settings className="mr-2" />
          Einstellungen
        </h1>
        <p className="text-muted-foreground">
          Konfigurieren Sie API-Schlüssel und Anwendungseinstellungen.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="mr-2 h-5 w-5" />
              Modus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mockMode"
                checked={settings.mockMode}
                onChange={(e) => handleInputChange('mockMode', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="mockMode" className="text-sm font-medium">
                Demo-Modus (verwendet Mock-Daten statt echter API-Aufrufe)
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Aktivieren Sie den Demo-Modus, um die App ohne API-Schlüssel zu testen.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              API-Schlüssel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">OpenAI API Key</label>
                <Input
                  type="password"
                  value={settings.openaiKey}
                  onChange={(e) => handleInputChange('openaiKey', e.target.value)}
                  placeholder="sk-..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Anthropic API Key</label>
                <Input
                  type="password"
                  value={settings.anthropicKey}
                  onChange={(e) => handleInputChange('anthropicKey', e.target.value)}
                  placeholder="sk-ant-..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">OpenRouter API Key</label>
                <Input
                  type="password"
                  value={settings.openrouterKey}
                  onChange={(e) => handleInputChange('openrouterKey', e.target.value)}
                  placeholder="sk-or-..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">ElevenLabs API Key</label>
                <Input
                  type="password"
                  value={settings.elevenlabsKey}
                  onChange={(e) => handleInputChange('elevenlabsKey', e.target.value)}
                  placeholder="..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Deepgram API Key</label>
                <Input
                  type="password"
                  value={settings.deepgramKey}
                  onChange={(e) => handleInputChange('deepgramKey', e.target.value)}
                  placeholder="..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Shotstack API Key</label>
                <Input
                  type="password"
                  value={settings.shotstackKey}
                  onChange={(e) => handleInputChange('shotstackKey', e.target.value)}
                  placeholder="..."
                />
              </div>
            </div>
            
            <Button onClick={handleSave} className="w-full">
              Einstellungen speichern
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Über TWM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Framework:</strong> Next.js 14 mit TypeScript</p>
              <p><strong>Features:</strong> KI-gestützte Content-Erstellung</p>
              <p className="text-muted-foreground">
                TWM ist eine umfassende Plattform für die Erstellung verschiedener Inhaltstypen 
                mit modernster KI-Technologie.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}