'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ChatMessage } from '@/lib/types'
import { generateContent, generateFollowUpQuestions } from '@/lib/api'
import { detectTaskType } from '@/lib/ai-models'
import { getChatHistory, saveChatHistory, getStoredSettings } from '@/lib/storage'
import { generateId } from '@/lib/utils'
import { Send, Mic, Edit, Volume2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const history = getChatHistory()
    if (history.length > 0) {
      setMessages(history)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    saveChatHistory(messages)
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
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

      const taskType = detectTaskType(input)
      const response = await generateContent(input, taskType, 'gpt-4', settings)
      
      const followUpQuestions = await generateFollowUpQuestions(response.content || input, settings)

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.content || 'Entschuldigung, ich konnte keine Antwort generieren.',
        timestamp: new Date(),
        followUpQuestions
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFollowUp = (question: string) => {
    setInput(question)
  }

  const handleEdit = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setInput(message.content)
    }
  }

  const handleSpeak = async (text: string) => {
    // TTS implementation would go here
    console.log('Speaking:', text)
  }

  const startRecording = () => {
    setIsRecording(true)
    // Voice recording implementation would go here
    setTimeout(() => {
      setIsRecording(false)
      setInput('Das ist eine Demo-Transkription.')
    }, 2000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <h2 className="text-2xl font-semibold mb-2">Willkommen bei TWM</h2>
            <p>Stellen Sie eine Frage oder beschreiben Sie, was Sie erstellen möchten.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : ''}`}>
              <CardContent className="p-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                
                {message.role === 'assistant' && (
                  <div className="mt-4 space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(message.id)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Bearbeiten
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSpeak(message.content)}
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        Vorlesen
                      </Button>
                    </div>
                    
                    {message.followUpQuestions && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Folgefragen:</p>
                        {message.followUpQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-auto p-2 text-left justify-start whitespace-normal"
                            onClick={() => handleFollowUp(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%]">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Generiere Antwort...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={startRecording}
            disabled={isRecording}
            className={isRecording ? 'bg-red-500 text-white' : ''}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nachricht eingeben..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}