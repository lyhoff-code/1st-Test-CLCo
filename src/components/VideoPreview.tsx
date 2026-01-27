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
    alert('In a full implementation, the generated video would be downloaded here.')
  }

  return (
    <div>
      {/* Phone Frame */}
      <div className={`relative ${aspectRatio} max-w-[280px] mx-auto phone-frame rounded-[2.5rem] overflow-hidden`}>
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />

        {/* Content */}
        <div className="absolute inset-2 rounded-[2rem] overflow-hidden bg-gray-900">
          {!product ? (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 bg-gradient-to-b from-gray-800 to-gray-900">
              <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
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
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
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
          <h4 className="font-semibold text-clickboom-text mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-clickboom-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generated Script
          </h4>
          <div className="bg-gray-50 rounded-xl p-4 max-h-40 overflow-y-auto border border-gray-100">
            <p className="text-clickboom-text text-sm whitespace-pre-wrap">{generatedContent.script}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownload}
              className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Video
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedContent.script)
                alert('Script copied to clipboard!')
              }}
              className="btn-secondary py-3 text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
