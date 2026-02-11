'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Send,
  Check,
  X,
  Copy,
  Instagram,
  Music,
  Youtube,
  Facebook,
  Video,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { ProductCaptions, SocialPlatform, SOCIAL_PLATFORMS } from '@/types/pipeline'
import { ShopifyProduct } from '@/types'

// ============================================
// TikTok custom icon (no native Lucide icon)
// ============================================
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

// ============================================
// Props
// ============================================
interface PublisherProps {
  products: ShopifyProduct[]
  preSelectedProductId?: string
  preUploadedVideoUrl?: string
  onPublished?: () => void
}

// ============================================
// Platform icon helper
// ============================================
function getPlatformIcon(platform: SocialPlatform, className?: string) {
  switch (platform) {
    case 'instagram':
      return <Instagram className={className} />
    case 'tiktok':
      return <TikTokIcon className={className} />
    case 'youtube':
      return <Youtube className={className} />
    case 'facebook':
      return <Facebook className={className} />
    default:
      return <Video className={className} />
  }
}

// ============================================
// Platform brand colors for backgrounds
// ============================================
function getPlatformGradient(platform: SocialPlatform): string {
  switch (platform) {
    case 'instagram':
      return 'from-purple-500 via-pink-500 to-orange-400'
    case 'tiktok':
      return 'from-slate-900 via-slate-800 to-slate-700'
    case 'youtube':
      return 'from-red-600 to-red-500'
    case 'facebook':
      return 'from-blue-600 to-blue-500'
    default:
      return 'from-gray-500 to-gray-400'
  }
}

// ============================================
// Per-platform publish status
// ============================================
type PlatformPublishStatus = 'idle' | 'publishing' | 'success' | 'error'

interface PlatformState {
  platform: SocialPlatform
  enabled: boolean
  publishStatus: PlatformPublishStatus
  showFullCaption: boolean
}

// ============================================
// Confetti particle
// ============================================
interface ConfettiParticle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function Publisher({
  products,
  preSelectedProductId,
  preUploadedVideoUrl,
  onPublished
}: PublisherProps) {
  // -------------------------------------------
  // State: video upload
  // -------------------------------------------
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(preUploadedVideoUrl || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // -------------------------------------------
  // State: product selection & captions
  // -------------------------------------------
  const [selectedProductId, setSelectedProductId] = useState<string>(preSelectedProductId || '')
  const [productCaptions, setProductCaptions] = useState<ProductCaptions | null>(null)
  const [captionsLoading, setCaptionsLoading] = useState(false)
  const [captionsError, setCaptionsError] = useState<string | null>(null)

  // -------------------------------------------
  // State: per-platform toggles and statuses
  // -------------------------------------------
  const [platformStates, setPlatformStates] = useState<PlatformState[]>(
    SOCIAL_PLATFORMS.map((p) => ({
      platform: p.value,
      enabled: true,
      publishStatus: 'idle' as PlatformPublishStatus,
      showFullCaption: false
    }))
  )

  // -------------------------------------------
  // State: publishing flow
  // -------------------------------------------
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishComplete, setPublishComplete] = useState(false)
  const [copiedPlatform, setCopiedPlatform] = useState<SocialPlatform | null>(null)

  // -------------------------------------------
  // State: confetti celebration
  // -------------------------------------------
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([])

  // -------------------------------------------
  // Derived
  // -------------------------------------------
  const selectedProduct = products.find((p) => p.id === selectedProductId) || null
  const enabledPlatforms = platformStates.filter((ps) => ps.enabled)
  const allPublishedSuccessfully = publishComplete && platformStates.filter((ps) => ps.enabled).every((ps) => ps.publishStatus === 'success')

  // -------------------------------------------
  // Load captions when product changes
  // -------------------------------------------
  const loadCaptions = useCallback(async (productId: string) => {
    if (!productId) {
      setProductCaptions(null)
      return
    }

    setCaptionsLoading(true)
    setCaptionsError(null)

    try {
      const res = await fetch('/api/captions')
      if (!res.ok) throw new Error('Failed to fetch captions')
      const data = await res.json()
      const allCaptions: ProductCaptions[] = data.captions || []
      const match = allCaptions.find((c) => c.productId === productId)

      if (match) {
        setProductCaptions(match)
      } else {
        setProductCaptions(null)
        setCaptionsError('no-captions')
      }
    } catch {
      setCaptionsError('fetch-error')
      setProductCaptions(null)
    } finally {
      setCaptionsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedProductId) {
      loadCaptions(selectedProductId)
    } else {
      setProductCaptions(null)
      setCaptionsError(null)
    }
  }, [selectedProductId, loadCaptions])

  // -------------------------------------------
  // Pre-uploaded video URL handling
  // -------------------------------------------
  useEffect(() => {
    if (preUploadedVideoUrl) {
      setVideoPreviewUrl(preUploadedVideoUrl)
    }
  }, [preUploadedVideoUrl])

  // -------------------------------------------
  // Video upload handlers
  // -------------------------------------------
  const handleVideoSelect = (file: File) => {
    if (!file.type.startsWith('video/')) return
    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoPreviewUrl(url)
    // Reset publishing state when new video is uploaded
    setPublishComplete(false)
    setPlatformStates((prev) =>
      prev.map((ps) => ({ ...ps, publishStatus: 'idle' as PlatformPublishStatus }))
    )
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleVideoSelect(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleVideoSelect(file)
  }

  const removeVideo = () => {
    if (videoPreviewUrl && videoFile) {
      URL.revokeObjectURL(videoPreviewUrl)
    }
    setVideoFile(null)
    setVideoPreviewUrl(null)
    setPublishComplete(false)
    setPlatformStates((prev) =>
      prev.map((ps) => ({ ...ps, publishStatus: 'idle' as PlatformPublishStatus }))
    )
  }

  // -------------------------------------------
  // Platform toggle
  // -------------------------------------------
  const togglePlatform = (platform: SocialPlatform) => {
    if (isPublishing) return
    setPlatformStates((prev) =>
      prev.map((ps) =>
        ps.platform === platform ? { ...ps, enabled: !ps.enabled } : ps
      )
    )
  }

  // -------------------------------------------
  // Toggle full caption
  // -------------------------------------------
  const toggleFullCaption = (platform: SocialPlatform) => {
    setPlatformStates((prev) =>
      prev.map((ps) =>
        ps.platform === platform ? { ...ps, showFullCaption: !ps.showFullCaption } : ps
      )
    )
  }

  // -------------------------------------------
  // Copy caption to clipboard
  // -------------------------------------------
  const copyCaption = async (platform: SocialPlatform) => {
    if (!productCaptions) return
    const pc = productCaptions.captions.find((c) => c.platform === platform)
    if (!pc) return

    const text = `${pc.caption}\n\n${pc.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPlatform(platform)
      setTimeout(() => setCopiedPlatform(null), 2000)
    } catch {
      // Clipboard API might not be available
    }
  }

  // -------------------------------------------
  // Spawn confetti
  // -------------------------------------------
  const spawnConfetti = () => {
    const colors = ['#A8E6E1', '#F9B4C4', '#FFD700', '#FF6B6B', '#7C3AED', '#34D399', '#F472B6', '#60A5FA']
    const particles: ConfettiParticle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1
    }))
    setConfettiParticles(particles)
    setTimeout(() => setConfettiParticles([]), 4000)
  }

  // -------------------------------------------
  // Simulated publishing
  // -------------------------------------------
  const handlePublish = async () => {
    if (!videoPreviewUrl || enabledPlatforms.length === 0) return

    setIsPublishing(true)
    setPublishComplete(false)

    // Reset statuses
    setPlatformStates((prev) =>
      prev.map((ps) => ({
        ...ps,
        publishStatus: ps.enabled ? ('publishing' as PlatformPublishStatus) : ('idle' as PlatformPublishStatus)
      }))
    )

    // Simulate publishing per platform sequentially with a 2-second delay
    const enabledList = platformStates.filter((ps) => ps.enabled)

    for (const ps of enabledList) {
      // Set current platform to publishing
      setPlatformStates((prev) =>
        prev.map((s) =>
          s.platform === ps.platform
            ? { ...s, publishStatus: 'publishing' as PlatformPublishStatus }
            : s
        )
      )

      // Wait 2 seconds to simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark as success
      setPlatformStates((prev) =>
        prev.map((s) =>
          s.platform === ps.platform
            ? { ...s, publishStatus: 'success' as PlatformPublishStatus }
            : s
        )
      )
    }

    setIsPublishing(false)
    setPublishComplete(true)
    spawnConfetti()
    onPublished?.()
  }

  // -------------------------------------------
  // Helper: get caption data for a platform
  // -------------------------------------------
  const getCaptionForPlatform = (platform: SocialPlatform) => {
    if (!productCaptions) return null
    return productCaptions.captions.find((c) => c.platform === platform) || null
  }

  // -------------------------------------------
  // Can publish?
  // -------------------------------------------
  const canPublish = !!videoPreviewUrl && !!selectedProductId && !!productCaptions && enabledPlatforms.length > 0 && !isPublishing && !publishComplete

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="relative min-h-screen pb-32">
      {/* Confetti overlay */}
      <AnimatePresence>
        {confettiParticles.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.x}vw`,
                  y: `${p.y}vh`,
                  rotate: 0,
                  scale: p.scale,
                  opacity: 1
                }}
                animate={{
                  y: '110vh',
                  rotate: p.rotation + 720,
                  opacity: [1, 1, 0.8, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: 'easeIn'
                }}
                exit={{ opacity: 0 }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A8E6E1] to-[#F9B4C4] flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Publish to Networks
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 ml-[52px]">
          Upload your final video and publish to all social platforms with one click
        </p>
      </motion.div>

      {/* ============================================ */}
      {/* STEP 1: VIDEO UPLOAD */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A8E6E1] to-[#F9B4C4] flex items-center justify-center text-white text-xs font-bold">
            1
          </span>
          Upload Final Video
        </h2>

        {!videoPreviewUrl ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed
              transition-all duration-300 p-12
              ${isDragging
                ? 'border-[#A8E6E1] bg-[#A8E6E1]/10 scale-[1.01]'
                : 'border-gray-300 dark:border-gray-600 hover:border-[#A8E6E1] hover:bg-[#A8E6E1]/5'
              }
              backdrop-blur-sm bg-white/50 dark:bg-white/5
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center text-center">
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A8E6E1]/20 to-[#F9B4C4]/20 flex items-center justify-center mb-4"
              >
                <Upload className="w-8 h-8 text-[#A8E6E1]" />
              </motion.div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                {isDragging ? 'Drop your video here' : 'Drag & drop your video'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                or click to browse files
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Supports MP4, MOV, WebM -- Final edited video from CapCut or Canva
              </p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10">
            <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
              <video
                src={videoPreviewUrl}
                controls
                className="w-full h-full object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeVideo()
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A8E6E1]/20 to-[#F9B4C4]/20 flex items-center justify-center">
                  <Video className="w-5 h-5 text-[#A8E6E1]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {videoFile ? videoFile.name : 'Pre-uploaded video'}
                  </p>
                  {videoFile && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-medium">Ready</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ============================================ */}
      {/* STEP 2: SELECT PRODUCT */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A8E6E1] to-[#F9B4C4] flex items-center justify-center text-white text-xs font-bold">
            2
          </span>
          Select Product
        </h2>

        <div className="relative rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 p-4">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full bg-transparent text-gray-800 dark:text-gray-200 text-sm rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8E6E1]/50 focus:border-[#A8E6E1] transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-white dark:bg-gray-900">
              -- Select a product --
            </option>
            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
                className="bg-white dark:bg-gray-900"
              >
                {product.title}
              </option>
            ))}
          </select>

          {/* Selected product preview */}
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-[#A8E6E1]/5 dark:bg-[#A8E6E1]/5 border border-[#A8E6E1]/20"
            >
              {selectedProduct.images.edges[0] && (
                <img
                  src={selectedProduct.images.edges[0].node.url}
                  alt={selectedProduct.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {selectedProduct.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedProduct.priceRange.minVariantPrice.currencyCode}{' '}
                  {parseFloat(selectedProduct.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#A8E6E1] flex-shrink-0" />
            </motion.div>
          )}

          {/* Caption loading state */}
          {captionsLoading && (
            <div className="mt-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading captions...
            </div>
          )}

          {/* No captions warning */}
          {captionsError === 'no-captions' && !captionsLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    No captions saved for this product
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    You need to generate and save captions before publishing.
                  </p>
                  <a
                    href="/pipeline/captions"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#A8E6E1] hover:text-[#8fd4ce] mt-2 transition-colors"
                  >
                    Go to Caption Manager
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Fetch error */}
          {captionsError === 'fetch-error' && !captionsLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Failed to load captions
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    There was an error fetching the captions. Please try again.
                  </p>
                  <button
                    onClick={() => loadCaptions(selectedProductId)}
                    className="text-xs font-medium text-[#A8E6E1] hover:text-[#8fd4ce] mt-2 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Captions loaded successfully */}
          {productCaptions && !captionsLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Captions loaded for {productCaptions.captions.length} platforms
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* STEP 3: PLATFORM PREVIEW CARDS */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A8E6E1] to-[#F9B4C4] flex items-center justify-center text-white text-xs font-bold">
            3
          </span>
          Preview per Platform
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOCIAL_PLATFORMS.map((sp, index) => {
            const ps = platformStates.find((s) => s.platform === sp.value)
            if (!ps) return null
            const caption = getCaptionForPlatform(sp.value)
            const isEnabled = ps.enabled

            return (
              <motion.div
                key={sp.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.08 }}
                className={`
                  relative rounded-2xl overflow-hidden transition-all duration-300
                  backdrop-blur-sm border
                  ${isEnabled
                    ? 'bg-white/60 dark:bg-white/5 border-white/30 dark:border-white/10 shadow-lg'
                    : 'bg-gray-100/50 dark:bg-gray-800/30 border-gray-200/50 dark:border-gray-700/30 opacity-60'
                  }
                `}
              >
                {/* Platform header with brand gradient */}
                <div className={`bg-gradient-to-r ${getPlatformGradient(sp.value)} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      {getPlatformIcon(sp.value, 'w-4 h-4 text-white')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{sp.label}</h3>
                      <p className="text-[10px] text-white/70">{sp.hashtagNote}</p>
                    </div>
                  </div>

                  {/* Enable/disable toggle */}
                  <button
                    onClick={() => togglePlatform(sp.value)}
                    disabled={isPublishing}
                    className={`
                      relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0
                      ${isEnabled ? 'bg-white/30' : 'bg-black/20'}
                      ${isPublishing ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <motion.div
                      animate={{ x: isEnabled ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`
                        w-5 h-5 rounded-full absolute top-0.5 shadow-sm
                        ${isEnabled ? 'bg-white' : 'bg-white/60'}
                      `}
                    />
                  </button>
                </div>

                {/* Card body */}
                <div className="p-4">
                  {/* Publishing status overlay */}
                  <AnimatePresence>
                    {ps.publishStatus === 'publishing' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-[#A8E6E1]/10 dark:bg-[#A8E6E1]/5 border border-[#A8E6E1]/20"
                      >
                        <Loader2 className="w-5 h-5 text-[#A8E6E1] animate-spin" />
                        <span className="text-sm font-medium text-[#A8E6E1]">
                          Publishing to {sp.label}...
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {ps.publishStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </motion.div>
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          Published successfully!
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {ps.publishStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                          Publishing failed
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Caption preview */}
                  {caption ? (
                    <div>
                      <div className="mb-3">
                        <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${!ps.showFullCaption ? 'line-clamp-3' : ''}`}>
                          {caption.caption}
                        </p>
                        {caption.caption.length > 120 && (
                          <button
                            onClick={() => toggleFullCaption(sp.value)}
                            className="text-xs font-medium text-[#A8E6E1] hover:text-[#8fd4ce] mt-1 transition-colors"
                          >
                            {ps.showFullCaption ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>

                      {/* Hashtags as chips */}
                      {caption.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {caption.hashtags.map((tag, i) => (
                            <span
                              key={i}
                              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#A8E6E1]/10 dark:bg-[#A8E6E1]/10 text-[#5BA8A0] dark:text-[#A8E6E1] border border-[#A8E6E1]/20"
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Character count */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {caption.currentLength > 0 ? caption.currentLength : caption.caption.length} / {caption.charLimit} characters
                        </span>
                        <div className="w-20 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              (caption.currentLength > 0 ? caption.currentLength : caption.caption.length) / caption.charLimit > 0.9
                                ? 'bg-red-400'
                                : (caption.currentLength > 0 ? caption.currentLength : caption.caption.length) / caption.charLimit > 0.7
                                  ? 'bg-amber-400'
                                  : 'bg-[#A8E6E1]'
                            }`}
                            style={{
                              width: `${Math.min(
                                ((caption.currentLength > 0 ? caption.currentLength : caption.caption.length) / caption.charLimit) * 100,
                                100
                              )}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Copy caption button */}
                      <button
                        onClick={() => copyCaption(sp.value)}
                        className={`
                          w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                          transition-all duration-200
                          ${copiedPlatform === sp.value
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {copiedPlatform === sp.value ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Caption
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {selectedProductId
                          ? captionsLoading
                            ? 'Loading...'
                            : 'No caption available'
                          : 'Select a product to see captions'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* STEP 4: PUBLISH BUTTON */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-40"
      >
        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-t border-white/20 dark:border-white/10 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {/* Platform selection summary */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Publishing to:
                </span>
                <div className="flex items-center gap-1.5">
                  {platformStates.filter((ps) => ps.enabled).length === 0 ? (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      No platforms selected
                    </span>
                  ) : (
                    platformStates
                      .filter((ps) => ps.enabled)
                      .map((ps) => {
                        const sp = SOCIAL_PLATFORMS.find((s) => s.value === ps.platform)
                        return (
                          <div
                            key={ps.platform}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                          >
                            {getPlatformIcon(ps.platform, 'w-3 h-3')}
                            <span className="text-[10px] font-medium">{sp?.label}</span>
                            {ps.publishStatus === 'success' && (
                              <Check className="w-3 h-3 text-emerald-500" />
                            )}
                            {ps.publishStatus === 'publishing' && (
                              <Loader2 className="w-3 h-3 text-[#A8E6E1] animate-spin" />
                            )}
                          </div>
                        )
                      })
                  )}
                </div>
              </div>

              {/* Publishing progress counter */}
              {isPublishing && (
                <span className="text-xs text-[#A8E6E1] font-medium">
                  {platformStates.filter((ps) => ps.enabled && ps.publishStatus === 'success').length}
                  {' / '}
                  {platformStates.filter((ps) => ps.enabled).length} done
                </span>
              )}
            </div>

            {/* Publish / success button */}
            {!publishComplete ? (
              <motion.button
                onClick={handlePublish}
                disabled={!canPublish}
                whileHover={canPublish ? { scale: 1.01 } : {}}
                whileTap={canPublish ? { scale: 0.99 } : {}}
                className={`
                  w-full py-4 rounded-2xl text-base font-bold
                  flex items-center justify-center gap-3
                  transition-all duration-300 shadow-lg
                  ${canPublish
                    ? 'bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] text-white hover:shadow-xl hover:shadow-[#A8E6E1]/20 cursor-pointer'
                    : isPublishing
                      ? 'bg-gradient-to-r from-[#A8E6E1]/80 to-[#F9B4C4]/80 text-white/80 cursor-wait'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }
                `}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Publish to All Networks
                    {enabledPlatforms.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                        {enabledPlatforms.length} platform{enabledPlatforms.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-base font-bold flex items-center justify-center gap-3 shadow-lg"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
                {allPublishedSuccessfully
                  ? 'All Platforms Published Successfully!'
                  : 'Publishing Complete'}
              </motion.div>
            )}

            {/* Validation hints */}
            {!canPublish && !isPublishing && !publishComplete && (
              <div className="mt-2 flex flex-wrap items-center gap-2 justify-center">
                {!videoPreviewUrl && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Upload a video
                  </span>
                )}
                {!selectedProductId && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Select a product
                  </span>
                )}
                {selectedProductId && !productCaptions && !captionsLoading && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Captions required
                  </span>
                )}
                {enabledPlatforms.length === 0 && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Enable at least one platform
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
