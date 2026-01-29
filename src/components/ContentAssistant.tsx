'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Lightbulb,
  TrendingUp,
  Hash,
  MessageCircle,
  Loader2,
  Wand2,
  Target,
  Zap,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuickAction {
  icon: React.ReactNode
  label: string
  prompt: string
}

interface ContentAssistantProps {
  productName?: string
  productDescription?: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: <Lightbulb className="w-4 h-4" />,
    label: 'Content Ideas',
    prompt: 'Give me 5 creative content ideas for social media posts',
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    label: 'Trending Hooks',
    prompt: 'What are the best trending hooks for Reels and TikTok right now?',
  },
  {
    icon: <Hash className="w-4 h-4" />,
    label: 'Hashtag Strategy',
    prompt: 'Suggest an effective hashtag strategy for maximum reach',
  },
  {
    icon: <Target className="w-4 h-4" />,
    label: 'Target Audience',
    prompt: 'Help me define my target audience and create content that resonates with them',
  },
  {
    icon: <Zap className="w-4 h-4" />,
    label: 'Viral Tips',
    prompt: 'What makes content go viral? Give me actionable tips',
  },
  {
    icon: <Wand2 className="w-4 h-4" />,
    label: 'Improve Script',
    prompt: 'How can I make my video scripts more engaging and persuasive?',
  },
]

export function ContentAssistant({ productName, productDescription }: ContentAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hey! I'm your Content Assistant. I'm here to help you create amazing social media content. Ask me anything about:

• Content ideas & strategies
• Trending hooks and formats
• Hashtag optimization
• Target audience insights
• Script improvements
• Viral content tips

What would you like help with today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (customPrompt?: string) => {
    const messageText = customPrompt || input.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          productName,
          productDescription,
          conversationHistory: messages.slice(-6), // Last 6 messages for context
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Assistant error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting. Please check your internet connection and try again.",
        timestamp: new Date(),
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

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-tada-turquoise to-tada-pink shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
          >
            <Sparkles className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '600px',
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 glass-strong shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-tada-turquoise/20 to-tada-pink/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tada-turquoise to-tada-pink flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-tada-text">Content Assistant</h3>
                  <p className="text-xs text-tada-text-light flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Powered by Gemini AI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-tada-text-light" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-tada-text-light" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-tada-text-light" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-tada-turquoise to-tada-turquoise-dark text-tada-text'
                            : 'bg-white/60 text-tada-text border border-white/30'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/60 rounded-2xl px-4 py-3 border border-white/30">
                        <Loader2 className="w-5 h-5 animate-spin text-tada-turquoise-dark" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-tada-text-light mb-2">Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_ACTIONS.slice(0, 4).map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleSend(action.prompt)}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/70 border border-white/30 text-xs text-tada-text transition-colors disabled:opacity-50"
                        >
                          {action.icon}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/20">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about content..."
                        rows={1}
                        className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/30 resize-none focus:outline-none focus:border-tada-turquoise/50 text-sm placeholder-tada-text-light"
                        style={{ maxHeight: '120px' }}
                      />
                    </div>
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="p-3 rounded-xl bg-gradient-to-r from-tada-turquoise to-tada-turquoise-dark text-tada-text disabled:opacity-50 hover:shadow-lg transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
