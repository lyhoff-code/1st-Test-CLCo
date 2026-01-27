'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Download, Copy, FileText, Video } from 'lucide-react'
import { ShopifyProduct, ContentType, GeneratedContent, GenerationState } from '@/types'

interface VideoPreviewProps {
  product: ShopifyProduct | null
  contentType: ContentType
  generatedContent: GeneratedContent | null
  generationState: GenerationState
}

const ASPECT_RATIOS = {
  reel: 'aspect-[9/16]',
  story: 'aspect-[9/16]',
  post: 'aspect-square',
}

export function VideoPreview({ product, contentType, generatedContent, generationState }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const aspectRatio = ASPECT_RATIOS[contentType]

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

  const handleDownload = () => {
    alert('In a full implementation, the generated video would be downloaded here.')
  }

  return (
    <div>
      {/* Phone Frame */}
      <div className={`relative ${aspectRatio} max-w-[280px] mx-auto rounded-[2.5rem] overflow-hidden shadow-glass-lg border-4 border-white/30`}>
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/80 rounded-full z-20" />

        {/* Content */}
        <div className="absolute inset-2 rounded-[2rem] overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
          {!product ? (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 bg-gradient-to-b from-gray-800 to-gray-900">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
                <Video className="w-7 h-7 opacity-50" />
              </div>
              <p className="text-sm text-center">Select a product to see the preview</p>
            </div>
          ) : generatedContent ? (
            // Generated Content Preview
            <div className="relative h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={getImageUrl(product)}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
              </div>

              {/* Scene Text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSceneIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-16 left-4 right-4"
                >
                  <p className="text-white text-base font-medium text-center drop-shadow-lg">
                    {generatedContent.scenes[currentSceneIndex]?.text || ''}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Play/Pause Button */}
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </button>

              {/* Audio Element */}
              {generatedContent.audioUrl && (
                <audio ref={audioRef} src={generatedContent.audioUrl} />
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
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
              </div>

              {/* Product Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg drop-shadow-lg">{product.title}</h3>
                <p className="text-white/80 text-sm mt-1 line-clamp-2 drop-shadow">
                  {product.description}
                </p>
                <p className="text-white font-semibold mt-2">
                  ${product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                </p>
              </div>

              {/* Generation Overlay */}
              {generationState.step !== 'idle' && generationState.step !== 'complete' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full spinner mx-auto mb-3" />
                    <p className="text-white text-sm">{generationState.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Script Preview */}
      {generatedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h4 className="font-semibold text-tada-text mb-3 flex items-center gap-2">
            <span className="icon-turquoise">
              <FileText className="w-5 h-5" />
            </span>
            Generated Script
          </h4>
          <div className="glass-subtle p-4 max-h-40 overflow-y-auto">
            <p className="text-tada-text text-sm whitespace-pre-wrap">{generatedContent.script}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownload}
              className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Video
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedContent.script)
                alert('Script copied to clipboard!')
              }}
              className="btn-secondary py-3 text-sm flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
