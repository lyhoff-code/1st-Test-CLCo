'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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
  Loader2,
  Wand2,
  Target,
  Zap,
  Command,
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
  externalOpen?: boolean
  onOpenChange?: (open: boolean) => void
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

export function ContentAssistant({ productName, productDescription, externalOpen, onOpenChange }: ContentAssistantProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
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
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Determine if open based on external or internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen

  const setIsOpen = useCallback((open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setInternalOpen(open)
    }
  }, [onOpenChange])

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen])

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Show tooltip hint periodically
  useEffect(() => {
    const showHint = () => {
      if (!isOpen) {
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 3000)
      }
    }

    // Show hint after 5 seconds
    const timer = setTimeout(showHint, 5000)
    return () => clearTimeout(timer)
  }, [isOpen])

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
          conversationHistory: messages.slice(-6),
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

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0

  return (
    <>
      {/* Floating Button with Tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: 10 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-3 whitespace-nowrap"
                >
                  <div className="glass-strong px-4 py-2 rounded-xl shadow-lg">
                    <p className="text-sm text-databake-text flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-databake-turquoise-dark" />
                      Need help? Press
                      <kbd className="px-2 py-0.5 rounded bg-databake-turquoise/20 text-xs font-mono">
                        {isMac ? '⌘' : 'Ctrl'} + K
                      </kbd>
                    </p>
                  </div>
                  <div className="absolute bottom-0 right-6 w-3 h-3 bg-white/80 transform rotate-45 translate-y-1.5" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button */}
            <motion.button
              onClick={() => setIsOpen(true)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-databake-turquoise to-databake-pink shadow-lg flex items-center justify-center group"
            >
              <Sparkles className="w-6 h-6 text-white" />

              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-2xl animate-ping bg-databake-turquoise/30" style={{ animationDuration: '2s' }} />

              {/* Online indicator */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />

              {/* Keyboard hint on hover */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="glass-subtle px-2 py-1 rounded-lg text-xs text-databake-text-light whitespace-nowrap">
                  {isMac ? '⌘' : 'Ctrl'} + K
                </div>
              </div>
            </motion.button>
          </motion.div>
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
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] glass-strong shadow-2xl flex flex-col z-50 overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 6rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-databake-turquoise/20 to-databake-pink/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-databake-turquoise to-databake-pink flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-databake-text">Content Assistant</h3>
                  <p className="text-xs text-databake-text-light flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Powered by Gemini AI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Keyboard shortcut hint */}
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 mr-2">
                  <Command className="w-3 h-3 text-databake-text-light" />
                  <span className="text-xs text-databake-text-light">K</span>
                </div>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-databake-text-light" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-databake-text-light" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4 text-databake-text-light" />
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
                            ? 'bg-gradient-to-r from-databake-turquoise to-databake-turquoise-dark text-databake-text'
                            : 'bg-white/60 text-databake-text border border-white/30'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/60 rounded-2xl px-4 py-3 border border-white/30">
                        <Loader2 className="w-5 h-5 animate-spin text-databake-turquoise-dark" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-databake-text-light mb-2">Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_ACTIONS.slice(0, 4).map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleSend(action.prompt)}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/70 border border-white/30 text-xs text-databake-text transition-colors disabled:opacity-50"
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
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about content..."
                        rows={1}
                        className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/30 resize-none focus:outline-none focus:border-databake-turquoise/50 text-sm placeholder-databake-text-light"
                        style={{ maxHeight: '120px' }}
                      />
                    </div>
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="p-3 rounded-xl bg-gradient-to-r from-databake-turquoise to-databake-turquoise-dark text-databake-text disabled:opacity-50 hover:shadow-lg transition-all"
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

// Export a header button component for quick access
export function AssistantHeaderButton({ onClick }: { onClick: () => void }) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0

  return (
    <button
      onClick={onClick}
      className="btn-ghost flex items-center gap-2 group relative"
    >
      <div className="relative">
        <Sparkles className="w-5 h-5 text-databake-turquoise-dark" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full" />
      </div>
      <span className="hidden sm:inline">AI Assistant</span>
      <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-databake-turquoise/10 text-[10px] font-mono text-databake-text-light">
        {isMac ? '⌘' : 'Ctrl'}K
      </kbd>
    </button>
  )
}
