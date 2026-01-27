'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductSelector } from '@/components/ProductSelector'
import { ContentTypeSelector } from '@/components/ContentTypeSelector'
import { ToneSelector } from '@/components/ToneSelector'
import { GenerationPanel } from '@/components/GenerationPanel'
import { VideoPreview } from '@/components/VideoPreview'
import { ShopifyProduct, ContentType, ToneType, GeneratedContent, GenerationState } from '@/types'

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

  const handleGenerate = async () => {
    if (!selectedProduct) return

    setGenerationState({ step: 'generating-script', progress: 0, message: 'Analizando producto...' })

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

      if (!scriptResponse.ok) throw new Error('Error generando script')

      const { script, scenes } = await scriptResponse.json()
      setGenerationState({ step: 'generating-audio', progress: 33, message: 'Generando voz...' })

      // Generate audio
      const audioResponse = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, tone })
      })

      if (!audioResponse.ok) throw new Error('Error generando audio')

      const { audioUrl } = await audioResponse.json()
      setGenerationState({ step: 'generating-video', progress: 66, message: 'Componiendo video...' })

      // For now, we'll simulate video generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      setGeneratedContent({
        script,
        audioUrl,
        scenes,
        videoUrl: undefined // Video composition would happen here
      })

      setGenerationState({ step: 'complete', progress: 100, message: 'Video generado!' })

    } catch (error) {
      setGenerationState({
        step: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  const canGenerate = selectedProduct && generationState.step === 'idle'
  const isGenerating = ['generating-script', 'generating-audio', 'generating-video'].includes(generationState.step)

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-end mb-4"
      >
        <Link
          href="/settings"
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configurar
        </Link>
      </motion.nav>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Content Generator</span>
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
          Transforma tus productos de Shopify en contenido viral para redes sociales
        </p>
      </motion.header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Step 1: Product Selection */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">1</span>
              Selecciona tu Producto
            </h2>
            <ProductSelector
              selectedProduct={selectedProduct}
              onSelect={setSelectedProduct}
            />
          </motion.section>

          {/* Step 2: Content Type */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-sm">2</span>
              Tipo de Contenido
            </h2>
            <ContentTypeSelector
              selected={contentType}
              onSelect={setContentType}
            />
          </motion.section>

          {/* Step 3: Tone */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-sm">3</span>
              Tono del Contenido
            </h2>
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
          >
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generando...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Generar Contenido
                </>
              )}
            </button>
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
          className="lg:sticky lg:top-8 lg:self-start"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center text-sm">👁️</span>
            Preview
          </h2>
          <VideoPreview
            product={selectedProduct}
            contentType={contentType}
            generatedContent={generatedContent}
            generationState={generationState}
          />
        </motion.div>
      </div>
    </main>
  )
}
