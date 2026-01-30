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
  MessageSquare,
  BookOpen,
  LayoutGrid,
  Sliders,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react'
import { ProductSelector } from '@/components/ProductSelector'
import { ContentTypeSelector } from '@/components/ContentTypeSelector'
import { ToneSelector } from '@/components/ToneSelector'
import { GenerationPanel } from '@/components/GenerationPanel'
import { VideoPreview } from '@/components/VideoPreview'
import { HistoryPanel } from '@/components/HistoryPanel'
import { StorytellingEditor } from '@/components/StorytellingEditor'
import { VideoSettingsPanel } from '@/components/VideoSettingsPanel'
import { ContentAssistant, AssistantHeaderButton } from '@/components/ContentAssistant'
import { ThemeToggle, LanguageSwitcher } from '@/components/HeaderControls'
import { UserMenu } from '@/components/UserMenu'
import { ResearchPanel } from '@/components/ResearchPanel'
import { useLanguage } from '@/lib/LanguageContext'
import {
  ShopifyProduct,
  ContentType,
  ToneType,
  GeneratedContent,
  GenerationState,
  HistoryItem,
  StorytellingContent,
  VideoSettings,
  ProductResearch,
  DEFAULT_VIDEO_SETTINGS
} from '@/types'

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
  const [showStorytellingEditor, setShowStorytellingEditor] = useState(false)
  const [videoSettings, setVideoSettings] = useState<VideoSettings>(DEFAULT_VIDEO_SETTINGS)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [research, setResearch] = useState<ProductResearch | null>(null)
  const [isResearching, setIsResearching] = useState(false)
  const [selectedHook, setSelectedHook] = useState<string | null>(null)

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('tada-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
    // Load saved video settings
    const savedSettings = localStorage.getItem('tada-video-settings')
    if (savedSettings) {
      setVideoSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save video settings when they change
  useEffect(() => {
    localStorage.setItem('tada-video-settings', JSON.stringify(videoSettings))
  }, [videoSettings])

  // Reset storytelling editor when content type changes
  useEffect(() => {
    if (contentType !== 'storytelling') {
      setShowStorytellingEditor(false)
    }
  }, [contentType])

  // Reset research when product changes
  useEffect(() => {
    setResearch(null)
    setSelectedHook(null)
  }, [selectedProduct])

  // Research product with AI
  const handleResearch = async () => {
    if (!selectedProduct) return

    setIsResearching(true)
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct.title,
          productDescription: selectedProduct.description,
          productPrice: selectedProduct.priceRange.minVariantPrice.amount,
        }),
      })

      if (!response.ok) throw new Error('Research failed')

      const data = await response.json()
      setResearch(data.research)
    } catch (error) {
      console.error('Research error:', error)
    } finally {
      setIsResearching(false)
    }
  }

  // Save history to localStorage
  const saveToHistory = (content: GeneratedContent, product: ShopifyProduct) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      product: product,
      contentType,
      tone,
      content,
      videoSettings
    }
    const updatedHistory = [newItem, ...history].slice(0, 20)
    setHistory(updatedHistory)
    localStorage.setItem('tada-history', JSON.stringify(updatedHistory))
  }

  const handleGenerate = async () => {
    if (!selectedProduct) return

    // If storytelling mode, show the editor instead of auto-generating
    if (contentType === 'storytelling') {
      setShowStorytellingEditor(true)
      return
    }

    setGenerationState({ step: 'generating-script', progress: 0, message: 'Analyzing product...' })

    try {
      const scriptResponse = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: selectedProduct,
          contentType,
          tone,
          videoSettings,
          research,
          selectedHook
        })
      })

      if (!scriptResponse.ok) throw new Error('Error generating script')

      const { script, scenes } = await scriptResponse.json()
      setGenerationState({ step: 'generating-audio', progress: 33, message: 'Creating voiceover...' })

      const audioResponse = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          tone,
          voiceSettings: videoSettings.voice
        })
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

  const handleStorytellingComplete = (storytellingContent: StorytellingContent) => {
    if (!selectedProduct) return

    const fullScript = storytellingContent.scenes.map(s => s.script).join('\n\n')

    const newContent: GeneratedContent = {
      script: fullScript,
      audioUrl: undefined,
      scenes: storytellingContent.scenes.map(s => ({
        text: s.script,
        duration: 5,
        imageUrl: s.imageUrl
      })),
      storytelling: storytellingContent,
      videoUrl: undefined
    }

    setGeneratedContent(newContent)
    saveToHistory(newContent, selectedProduct)
    setGenerationState({ step: 'complete', progress: 100, message: 'Storytelling content saved!' })
  }

  const handleReset = () => {
    setGeneratedContent(null)
    setGenerationState({ step: 'idle', progress: 0, message: '' })
    setShowStorytellingEditor(false)
  }

  const loadFromHistory = (item: HistoryItem) => {
    setSelectedProduct(item.product)
    setContentType(item.contentType)
    setTone(item.tone)
    setGeneratedContent(item.content)
    if (item.videoSettings) {
      setVideoSettings(item.videoSettings)
    }
    setGenerationState({ step: 'complete', progress: 100, message: 'Loaded from history' })
    setShowHistory(false)
    setShowStorytellingEditor(false)
  }

  const canGenerate = selectedProduct && generationState.step === 'idle' && !showStorytellingEditor
  const isGenerating = ['generating-script', 'generating-audio', 'generating-video'].includes(generationState.step)
  const isStorytellingMode = contentType === 'storytelling'

  return (
    <main className="min-h-screen aurora-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-subtle border-b border-white/20 dark:border-gray-700/30">
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
                <h1 className="text-xl font-bold text-tada-text dark:text-gray-100">
                  Tada<span className="text-tada-pink">.media</span>
                </h1>
                <p className="text-xs text-tada-text-light dark:text-gray-400">AI Content Studio</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.nav
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              {/* AI Assistant Button */}
              <AssistantHeaderButton onClick={() => setAssistantOpen(true)} />

              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`btn-ghost flex items-center gap-2 ${showHistory ? 'bg-tada-turquoise/20 text-tada-text dark:text-gray-200' : ''}`}
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

              {/* Language & Theme */}
              <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-white/20 dark:border-gray-700/30">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              {/* User Menu */}
              <div className="ml-2 pl-2 border-l border-white/20 dark:border-gray-700/30">
                <UserMenu />
              </div>
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

        {/* Storytelling Editor Full Screen Mode */}
        <AnimatePresence>
          {showStorytellingEditor && selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="icon-pink">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-tada-text">Storytelling Mode</h2>
                    <p className="text-sm text-tada-text-light">Create a story-driven 30-second reel</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="btn-secondary px-4 py-2 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Exit Storytelling
                </button>
              </div>
              <StorytellingEditor
                product={selectedProduct}
                tone={tone}
                onSave={handleStorytellingComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content - Hidden when storytelling editor is open */}
        {!showStorytellingEditor && (
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

              {/* Step 1.5: AI Research (appears after product selection) */}
              <AnimatePresence>
                {selectedProduct && (
                  <motion.section
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ delay: 0.15 }}
                    className="card-lift"
                  >
                    <ResearchPanel
                      product={selectedProduct}
                      research={research}
                      isLoading={isResearching}
                      onResearch={handleResearch}
                      onSelectHook={setSelectedHook}
                      selectedHook={selectedHook}
                    />
                  </motion.section>
                )}
              </AnimatePresence>

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

                {/* Content Structure Info - Shows for ALL content types */}
                <motion.div
                  key={contentType}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-4 p-4 rounded-2xl border ${
                    contentType === 'reel' || contentType === 'post' || contentType === 'carousel'
                      ? 'bg-gradient-to-r from-tada-turquoise/10 to-tada-turquoise/5 border-tada-turquoise/20'
                      : 'bg-gradient-to-r from-tada-pink/10 to-tada-pink/5 border-tada-pink/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {contentType === 'reel' && <Film className="w-5 h-5 text-tada-turquoise-dark mt-0.5 shrink-0" />}
                    {contentType === 'story' && <Eye className="w-5 h-5 text-tada-pink-dark mt-0.5 shrink-0" />}
                    {contentType === 'post' && <Package className="w-5 h-5 text-tada-turquoise-dark mt-0.5 shrink-0" />}
                    {contentType === 'storytelling' && <BookOpen className="w-5 h-5 text-tada-pink-dark mt-0.5 shrink-0" />}
                    {contentType === 'carousel' && <LayoutGrid className="w-5 h-5 text-tada-turquoise-dark mt-0.5 shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-tada-text dark:text-gray-100">
                        {contentType === 'reel' && 'Reel Structure (15-60s)'}
                        {contentType === 'story' && 'Story Structure (15s)'}
                        {contentType === 'post' && 'Post Structure'}
                        {contentType === 'storytelling' && 'Storytelling Structure (30s)'}
                        {contentType === 'carousel' && 'Carousel Structure (7 slides)'}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {contentType === 'reel' && (
                          <>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Hook</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Value</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Demo</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">CTA</span>
                          </>
                        )}
                        {contentType === 'story' && (
                          <>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-pink/20 text-tada-pink-dark">Attention</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-pink/20 text-tada-pink-dark">Message</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-pink/20 text-tada-pink-dark">Action</span>
                          </>
                        )}
                        {contentType === 'post' && (
                          <>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Visual</span>
                            <span className="text-tada-text-light">+</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Caption</span>
                            <span className="text-tada-text-light">+</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Hashtags</span>
                          </>
                        )}
                        {contentType === 'storytelling' && (
                          <>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-pink/20 text-tada-pink-dark">Hook</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-pink/20 text-tada-pink-dark">Problem</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-pink/20 text-tada-pink-dark">Agitation</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-pink/20 text-tada-pink-dark">Solution</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-pink/20 text-tada-pink-dark">Result</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-pink/20 text-tada-pink-dark">CTA</span>
                          </>
                        )}
                        {contentType === 'carousel' && (
                          <>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Cover</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Problem</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Stats</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Solution</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Benefits</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">Proof</span>
                            <span className="text-tada-text-light">→</span>
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-tada-turquoise/20 text-tada-turquoise-dark">CTA</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-tada-text-light dark:text-gray-400 mt-2">
                        {contentType === 'reel' && 'Perfect for Instagram Reels, TikTok, and YouTube Shorts. Each scene with script and voiceover.'}
                        {contentType === 'story' && 'Quick ephemeral content for Instagram/Facebook Stories. Optimized for swipe-up engagement.'}
                        {contentType === 'post' && 'Static feed content with engaging caption and optimized hashtags for discovery.'}
                        {contentType === 'storytelling' && 'Advanced 6-scene narrative. Each scene gets its own script, voice, and AI-generated image.'}
                        {contentType === 'carousel' && 'Swipeable multi-slide format. 7 slides with impactful text and AI images. High save rate.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
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

              {/* Step 4: Advanced Settings (Collapsible) */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="glass overflow-hidden card-lift"
              >
                <button
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <h3 className="section-title mb-0">
                    <span className="step-badge bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                      <Sliders className="w-4 h-4" />
                    </span>
                    Advanced Settings
                    <span className="ml-2 text-xs font-normal text-tada-text-light">(7 categories)</span>
                  </h3>
                  {showAdvancedSettings ? (
                    <ChevronUp className="w-5 h-5 text-tada-text-light" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-tada-text-light" />
                  )}
                </button>

                <AnimatePresence>
                  {showAdvancedSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 mb-4">
                          <p className="text-xs text-tada-text-light">
                            Customize voice, audience targeting, visual style, music, script options, branding, and export quality for professional results.
                          </p>
                        </div>
                        <VideoSettingsPanel
                          settings={videoSettings}
                          onChange={setVideoSettings}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                  ) : isStorytellingMode ? (
                    <>
                      <BookOpen className="w-5 h-5" />
                      Start Storytelling Mode
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

                {/* Quick Settings Summary */}
                {selectedProduct && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 glass-subtle rounded-2xl"
                  >
                    <h4 className="text-sm font-medium text-tada-text mb-3 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-tada-turquoise-dark" />
                      Current Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-tada-text-light">Voice:</span>
                        <span className="text-tada-text capitalize">{videoSettings.voice.gender}, {videoSettings.voice.emotion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-tada-text-light">Platform:</span>
                        <span className="text-tada-text capitalize">{videoSettings.audience.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-tada-text-light">Style:</span>
                        <span className="text-tada-text capitalize">{videoSettings.visual.visualStyle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-tada-text-light">Music:</span>
                        <span className="text-tada-text capitalize">{videoSettings.music.mood}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-tada-text-light">Duration:</span>
                        <span className="text-tada-text">{videoSettings.script.length}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-tada-text-light">Quality:</span>
                        <span className="text-tada-text">{videoSettings.export.resolution}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
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

      {/* AI Content Assistant */}
      <ContentAssistant
        productName={selectedProduct?.title}
        productDescription={selectedProduct?.description}
        externalOpen={assistantOpen}
        onOpenChange={setAssistantOpen}
      />
    </main>
  )
}
