'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Download,
  Copy,
  FileText,
  Video,
  Share2,
  CheckCircle2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronRight
} from 'lucide-react'
import { ShopifyProduct, ContentType, GeneratedContent, GenerationState, CONTENT_TYPES } from '@/types'
import { ExportModal } from './ExportModal'
import { ContentStructurePanel, ContentStructureBadges } from './ContentStructurePanel'

interface VideoPreviewProps {
  product: ShopifyProduct | null
  contentType: ContentType
  generatedContent: GeneratedContent | null
  generationState: GenerationState
}

const ASPECT_RATIOS: Record<ContentType, string> = {
  reel: 'aspect-[9/16]',
  story: 'aspect-[9/16]',
  post: 'aspect-square',
  storytelling: 'aspect-[9/16]',
}

const ASPECT_LABELS: Record<ContentType, string> = {
  reel: '9:16',
  story: '9:16',
  post: '1:1',
  storytelling: '9:16',
}

export function VideoPreview({ product, contentType, generatedContent, generationState }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [showExportModal, setShowExportModal] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const aspectRatio = ASPECT_RATIOS[contentType]
  const aspectLabel = ASPECT_LABELS[contentType]
  const contentConfig = CONTENT_TYPES.find(t => t.value === contentType)

  const getImageUrl = (p: ShopifyProduct) => {
    return p.images.edges[0]?.node.url || 'https://via.placeholder.com/400'
  }

  // Auto-play scenes when audio is playing
  useEffect(() => {
    if (!isPlaying || !generatedContent?.scenes) return

    const scene = generatedContent.scenes[currentSceneIndex]
    if (!scene) return

    const timer = setTimeout(() => {
      if (currentSceneIndex < generatedContent.scenes.length - 1) {
        setCurrentSceneIndex(prev => prev + 1)
      } else {
        setIsPlaying(false)
        setCurrentSceneIndex(0)
      }
    }, scene.duration * 1000)

    return () => clearTimeout(timer)
  }, [isPlaying, currentSceneIndex, generatedContent])

  const handlePlay = () => {
    if (audioRef.current && generatedContent?.audioUrl) {
      audioRef.current.play()
    }
    setIsPlaying(true)
    setCurrentSceneIndex(0)
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsPlaying(false)
  }

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1)
    }
  }

  const handleNextScene = () => {
    if (generatedContent && currentSceneIndex < generatedContent.scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1)
    }
  }

  const handleDownload = () => {
    if (!generatedContent || !product) return

    const contentPackage = {
      title: product.title,
      contentType,
      script: generatedContent.script,
      scenes: generatedContent.scenes.map((scene, index) => ({
        number: index + 1,
        text: scene.text,
        duration: scene.duration,
        imageUrl: scene.imageUrl || null,
      })),
      audioUrl: generatedContent.audioUrl || null,
      createdAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(contentPackage, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tada-${contentType}-${product.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    const scriptBlob = new Blob([generatedContent.script], { type: 'text/plain' })
    const scriptUrl = URL.createObjectURL(scriptBlob)
    const scriptLink = document.createElement('a')
    scriptLink.href = scriptUrl
    scriptLink.download = `tada-script-${contentType}-${Date.now()}.txt`
    document.body.appendChild(scriptLink)
    scriptLink.click()
    document.body.removeChild(scriptLink)
    URL.revokeObjectURL(scriptUrl)

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 2000)
  }

  const handleCopyScript = () => {
    if (!generatedContent) return
    navigator.clipboard.writeText(generatedContent.script)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Content Type & Aspect Ratio Badge */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle">
          <div className={`w-2 h-2 rounded-full ${
            contentConfig?.color === 'turquoise' ? 'bg-tada-turquoise' : 'bg-tada-pink'
          }`} />
          <span className="text-xs font-medium text-tada-text dark:text-gray-200">
            {contentConfig?.label}
          </span>
          <span className="text-[10px] text-tada-text-light dark:text-gray-400 px-1.5 py-0.5 bg-white/50 dark:bg-gray-700/50 rounded">
            {aspectLabel}
          </span>
        </div>
      </div>

      {/* Phone Frame - Centered */}
      <div className="flex justify-center">
        <div className={`relative ${aspectRatio} w-full max-w-[300px] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-gray-800 dark:border-gray-700 bg-gray-900`}>
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-30 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-700" />
            <div className="w-3 h-3 rounded-full bg-gray-800 ring-1 ring-gray-700" />
          </div>

          {/* Content Area */}
          <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
            {!product ? (
              // Empty State
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center mb-4 shadow-lg"
                >
                  <Video className="w-10 h-10 opacity-40" />
                </motion.div>
                <p className="text-sm text-center font-medium text-gray-500">
                  Select a product
                </p>
                <p className="text-xs text-center text-gray-600 mt-1">
                  to see the preview
                </p>
              </div>
            ) : generatedContent ? (
              // Generated Content Preview
              <div className="relative h-full">
                {/* Background Image with Scene */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSceneIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={generatedContent.scenes[currentSceneIndex]?.imageUrl || getImageUrl(product)}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                  </motion.div>
                </AnimatePresence>

                {/* Scene Indicator Pills */}
                <div className="absolute top-14 left-4 right-4 flex gap-1.5 z-20">
                  {generatedContent.scenes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSceneIndex(idx)}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        idx === currentSceneIndex
                          ? 'bg-white'
                          : idx < currentSceneIndex
                            ? 'bg-white/60'
                            : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Scene Label */}
                {contentConfig && contentConfig.scenes[currentSceneIndex] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-20 left-4 z-20"
                  >
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      contentConfig.color === 'turquoise'
                        ? 'bg-tada-turquoise/90 text-white'
                        : 'bg-tada-pink/90 text-white'
                    }`}>
                      {contentConfig.scenes[currentSceneIndex]?.name}
                    </span>
                  </motion.div>
                )}

                {/* Scene Text */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSceneIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-24 left-4 right-4 z-20"
                  >
                    <p className="text-white text-lg font-semibold text-center leading-snug drop-shadow-lg">
                      {generatedContent.scenes[currentSceneIndex]?.text || ''}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Playback Controls */}
                <div className="absolute bottom-6 left-4 right-4 z-20">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handlePrevScene}
                      disabled={currentSceneIndex === 0}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-40"
                    >
                      <SkipBack className="w-4 h-4 text-white" />
                    </button>

                    <button
                      onClick={isPlaying ? handlePause : handlePlay}
                      className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors border border-white/30"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </button>

                    <button
                      onClick={handleNextScene}
                      disabled={currentSceneIndex === generatedContent.scenes.length - 1}
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-40"
                    >
                      <SkipForward className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Scene Counter */}
                  <p className="text-center text-white/70 text-xs mt-3">
                    Scene {currentSceneIndex + 1} of {generatedContent.scenes.length}
                  </p>
                </div>

                {/* Audio Element */}
                {generatedContent.audioUrl && (
                  <audio ref={audioRef} src={generatedContent.audioUrl} muted={isMuted} />
                )}
              </div>
            ) : (
              // Product Preview (before generation)
              <div className="relative h-full">
                <div className="absolute inset-0">
                  <img
                    src={getImageUrl(product)}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
                </div>

                {/* Product Info */}
                <div className="absolute bottom-6 left-4 right-4 z-20">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-white font-bold text-xl drop-shadow-lg mb-2">
                      {product.title}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2 drop-shadow mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-lg">
                        ${product.priceRange.minVariantPrice.amount}
                        <span className="text-xs font-normal text-white/60 ml-1">
                          {product.priceRange.minVariantPrice.currencyCode}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Generation Overlay */}
                {generationState.step !== 'idle' && generationState.step !== 'complete' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30"
                  >
                    <div className="text-center px-6">
                      <div className="w-16 h-16 rounded-full border-4 border-tada-turquoise/30 border-t-tada-turquoise animate-spin mx-auto mb-4" />
                      <p className="text-white font-medium">{generationState.message}</p>
                      <div className="mt-4 w-48 h-1.5 bg-white/20 rounded-full mx-auto overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${generationState.progress}%` }}
                          className="h-full bg-gradient-to-r from-tada-turquoise to-tada-pink rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-30" />
        </div>
      </div>

      {/* Content Structure Panel */}
      {product && !generatedContent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ContentStructurePanel
            contentType={contentType}
            currentScene={-1}
          />
        </motion.div>
      )}

      {/* Generated Content Actions */}
      {generatedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Scene Structure Badges */}
          <div className="flex justify-center">
            <ContentStructureBadges contentType={contentType} />
          </div>

          {/* Script Preview */}
          <div className="glass-subtle p-4 rounded-2xl">
            <h4 className="font-semibold text-tada-text dark:text-gray-100 mb-3 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-tada-turquoise-dark" />
              Generated Script
            </h4>
            <div className="max-h-32 overflow-y-auto">
              <p className="text-tada-text dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                {generatedContent.script}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleDownload}
              className="btn-primary py-3 text-sm flex items-center justify-center gap-2"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Done!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-secondary py-3 text-sm flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleCopyScript}
              className="btn-ghost py-3 text-sm flex items-center justify-center gap-2 border border-white/20 dark:border-gray-700/30"
            >
              {copySuccess ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              Copy
            </button>
          </div>
        </motion.div>
      )}

      {/* Export Modal */}
      {generatedContent && product && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title={product.title}
          scenes={generatedContent.scenes}
        />
      )}
    </div>
  )
}
