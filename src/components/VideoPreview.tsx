'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    // In a real implementation, this would download the generated video
    alert('En una implementación completa, aquí se descargaría el video generado.')
  }

  return (
    <div className="glass-card p-4">
      {/* Phone Frame */}
      <div className={`relative ${aspectRatio} max-w-[300px] mx-auto bg-black rounded-3xl overflow-hidden border-4 border-gray-800`}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col">
          {!product ? (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center text-white/40 p-4">
              <span className="text-4xl mb-3">📱</span>
              <p className="text-sm text-center">Selecciona un producto para ver el preview</p>
            </div>
          ) : generatedContent ? (
            // Generated Content Preview
            <div className="relative flex-1">
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
                  className="absolute bottom-20 left-4 right-4"
                >
                  <p className="text-white text-lg font-medium text-center drop-shadow-lg">
                    {generatedContent.scenes[currentSceneIndex]?.text || ''}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Play/Pause Button */}
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Audio Element */}
              {generatedContent.audioUrl && (
                <audio ref={audioRef} src={generatedContent.audioUrl} />
              )}
            </div>
          ) : (
            // Product Preview (before generation)
            <div className="relative flex-1">
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
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
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
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>📜</span> Script Generado
          </h3>
          <div className="bg-white/5 rounded-xl p-4 max-h-48 overflow-y-auto">
            <p className="text-white/80 text-sm whitespace-pre-wrap">{generatedContent.script}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownload}
              className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2"
            >
              <span>💾</span> Descargar Video
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedContent.script)
                alert('Script copiado al portapapeles!')
              }}
              className="btn-secondary py-3 text-sm"
            >
              📋 Copiar Script
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
