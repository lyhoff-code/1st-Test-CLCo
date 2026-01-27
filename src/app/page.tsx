'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Clock,
  Settings,
  Zap,
  RotateCcw,
  Eye,
  Package,
  Film,
  MessageSquare
} from 'lucide-react'
import { ProductSelector } from '@/components/ProductSelector'
import { ContentTypeSelector } from '@/components/ContentTypeSelector'
import { ToneSelector } from '@/components/ToneSelector'
import { GenerationPanel } from '@/components/GenerationPanel'
import { VideoPreview } from '@/components/VideoPreview'
import { HistoryPanel } from '@/components/HistoryPanel'
import { ShopifyProduct, ContentType, ToneType, GeneratedContent, GenerationState, HistoryItem } from '@/types'

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null)
  const [contentType, setContentType] = useState<ContentType>('reel')
  const [tone, setTone] = useState<ToneType>('divertido')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [generationState, setGenerationState] = useState<GenerationState>({
    step: 'idle',
    progress: 0,
    message: ''
  })
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('tada-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save history to localStorage
  const saveToHistory = (content: GeneratedContent, product: ShopifyProduct) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      product: product,
      contentType,
      tone,
      content
    }
    const updatedHistory = [newItem, ...history].slice(0, 20)
    setHistory(updatedHistory)
    localStorage.setItem('tada-history', JSON.stringify(updatedHistory))
  }

  const handleGenerate = async () => {
    if (!selectedProduct) return

    setGenerationState({ step: 'generating-script', progress: 0, message: 'Analyzing product...' })

    try {
      const scriptResponse = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProduct,
          contentType,
          tone
        })
      })

      if (!scriptResponse.ok) throw new Error('Error generating script')

      const { script, scenes } = await scriptResponse.json()
      setGenerationState({ step: 'generating-audio', progress: 33, message: 'Creating voiceover...' })

      const audioResponse = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, tone })
      })

      if (!audioResponse.ok) throw new Error('Error generating audio')

      const { audioUrl } = await audioResponse.json()
      setGenerationState({ step: 'generating-video', progress: 66, message: 'Composing video...' })

      await new Promise(resolve => setTimeout(resolve, 2000))

      const newContent: GeneratedContent = {
        script,
        audioUrl,
        scenes,
        videoUrl: undefined
      }

      setGeneratedContent(newContent)
      saveToHistory(newContent, selectedProduct)
      setGenerationState({ step: 'complete', progress: 100, message: 'Content ready!' })

    } catch (error) {
      setGenerationState({
        step: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const handleReset = () => {
    setGeneratedContent(null)
    setGenerationState({ step: 'idle', progress: 0, message: '' })
  }

  const loadFromHistory = (item: HistoryItem) => {
    setSelectedProduct(item.product)
    setContentType(item.contentType)
    setTone(item.tone)
    setGeneratedContent(item.content)
    setGenerationState({ step: 'complete', progress: 100, message: 'Loaded from history' })
    setShowHistory(false)
  }

  const canGenerate = selectedProduct && generationState.step === 'idle'
  const isGenerating = ['generating-script', 'generating-audio', 'generating-video'].includes(generationState.step)

  return (
    <main className="min-h-screen aurora-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-subtle border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-tada-turquoise via-tada-turquoise-dark to-tada-pink flex items-center justify-center shadow-glass glow-turquoise">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-tada-text">
                  Tada<span className="text-tada-pink">.media</span>
                </h1>
                <p className="text-xs text-tada-text-light">AI Content Studio</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`btn-ghost flex items-center gap-2 ${showHistory ? 'bg-tada-turquoise/20 text-tada-text' : ''}`}
              >
                <Clock className="w-5 h-5" />
                <span className="hidden sm:inline">History</span>
                {history.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-tada-pink to-tada-pink-dark text-white text-xs flex items-center justify-center font-medium">
                    {history.length}
                  </span>
                )}
              </button>
              <Link
                href="/settings"
                className="btn-ghost flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </motion.nav>
          </div>
        </div>
      </header>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <HistoryPanel
            history={history}
            onSelect={loadFromHistory}
            onClose={() => setShowHistory(false)}
            onClear={() => {
              setHistory([])
              localStorage.removeItem('tada-history')
            }}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-6"
          >
            <Sparkles className="w-4 h-4 text-tada-turquoise-dark" />
            <span className="text-sm font-medium text-tada-text">AI-Powered Content Creation</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-5 text-tada-text leading-tight">
            Create <span className="gradient-text">Viral Content</span>
            <br className="hidden md:block" /> for Your Products
          </h2>
          <p className="text-tada-text-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your Shopify products into engaging reels, stories, and posts with AI-powered scripts and voiceovers.
          </p>
        </motion.section>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Left Column - Configuration */}
          <div className="space-y-5">
            {/* Step 1: Product Selection */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 card-lift"
            >
              <h3 className="section-title mb-5">
                <span className="step-badge bg-gradient-to-br from-tada-turquoise to-tada-turquoise-dark text-white">
                  <Package className="w-4 h-4" />
                </span>
                Select Your Product
              </h3>
              <ProductSelector
                selectedProduct={selectedProduct}
                onSelect={setSelectedProduct}
              />
            </motion.section>

            {/* Step 2: Content Type */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 card-lift"
            >
              <h3 className="section-title mb-5">
                <span className="step-badge bg-gradient-to-br from-tada-pink to-tada-pink-dark text-white">
                  <Film className="w-4 h-4" />
                </span>
                Content Type
              </h3>
              <ContentTypeSelector
                selected={contentType}
                onSelect={setContentType}
              />
            </motion.section>

            {/* Step 3: Tone */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 card-lift"
            >
              <h3 className="section-title mb-5">
                <span className="step-badge bg-gradient-to-r from-tada-turquoise to-tada-pink text-white">
                  <MessageSquare className="w-4 h-4" />
                </span>
                Content Tone
              </h3>
              <ToneSelector
                selected={tone}
                onSelect={setTone}
              />
            </motion.section>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3"
            >
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 rounded-full spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Content
                  </>
                )}
              </button>
              {generatedContent && (
                <button
                  onClick={handleReset}
                  className="btn-secondary px-4"
                  title="Start over"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
            </motion.div>

            {/* Generation Progress */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <GenerationPanel state={generationState} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="glass p-6">
              <h3 className="section-title mb-5">
                <span className="icon-turquoise">
                  <Eye className="w-5 h-5" />
                </span>
                Preview
              </h3>
              <VideoPreview
                product={selectedProduct}
                contentType={contentType}
                generatedContent={generatedContent}
                generationState={generationState}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-tada-text-light text-sm">
            <Sparkles className="w-4 h-4 text-tada-turquoise" />
            <span>Made with</span>
            <span className="font-semibold text-tada-text">Tada.media</span>
            <span>— AI-Powered Content Creation</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
