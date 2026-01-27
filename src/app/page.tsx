'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
    const savedHistory = localStorage.getItem('clickboom-history')
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
    const updatedHistory = [newItem, ...history].slice(0, 20) // Keep last 20 items
    setHistory(updatedHistory)
    localStorage.setItem('clickboom-history', JSON.stringify(updatedHistory))
  }

  const handleGenerate = async () => {
    if (!selectedProduct) return

    setGenerationState({ step: 'generating-script', progress: 0, message: 'Analyzing product...' })

    try {
      // Generate script
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

      // Generate audio
      const audioResponse = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, tone })
      })

      if (!audioResponse.ok) throw new Error('Error generating audio')

      const { audioUrl } = await audioResponse.json()
      setGenerationState({ step: 'generating-video', progress: 66, message: 'Composing video...' })

      // Simulate video generation
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
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clickboom-turquoise to-clickboom-pink flex items-center justify-center shadow-soft">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-clickboom-text">ClickBoom</h1>
                <p className="text-xs text-clickboom-text-light">Content Generator</p>
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
                className={`btn-ghost flex items-center gap-2 ${showHistory ? 'bg-clickboom-turquoise/20' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">History</span>
                {history.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-clickboom-pink text-white text-xs flex items-center justify-center">
                    {history.length}
                  </span>
                )}
              </button>
              <Link
                href="/settings"
                className="btn-ghost flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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
              localStorage.removeItem('clickboom-history')
            }}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-clickboom-text">
            Create <span className="gradient-text">Viral Content</span> for Your Products
          </h2>
          <p className="text-clickboom-text-light text-lg max-w-2xl mx-auto">
            Transform your Shopify products into engaging reels, stories, and posts with AI-powered scripts and voiceovers.
          </p>
        </motion.section>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Step 1: Product Selection */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h3 className="section-title mb-4">
                <span className="step-badge bg-clickboom-turquoise">1</span>
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
              className="card p-6"
            >
              <h3 className="section-title mb-4">
                <span className="step-badge bg-clickboom-pink">2</span>
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
              className="card p-6"
            >
              <h3 className="section-title mb-4">
                <span className="step-badge bg-gradient-to-r from-clickboom-turquoise to-clickboom-pink">3</span>
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
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
            <div className="card p-6">
              <h3 className="section-title mb-4">
                <svg className="w-5 h-5 text-clickboom-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
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
      <footer className="border-t border-gray-100 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-clickboom-text-light text-sm">
          <p>Made with ClickBoom - AI-Powered Content Generation</p>
        </div>
      </footer>
    </main>
  )
}
