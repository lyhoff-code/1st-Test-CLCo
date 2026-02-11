'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Instagram,
  Music,
  Youtube,
  Facebook,
  Copy,
  Check,
  Plus,
  Edit3,
  Trash2,
  Save,
  Hash,
  Type,
  AlertCircle,
  X,
  ChevronLeft,
  Search,
  Loader2,
} from 'lucide-react'
import type {
  ProductCaptions,
  PlatformCaption,
  SocialPlatform,
} from '@/types/pipeline'
import {
  SOCIAL_PLATFORMS,
  DEFAULT_PLATFORM_CAPTIONS,
} from '@/types/pipeline'
import type { ShopifyProduct } from '@/types'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CaptionManagerProps {
  products: ShopifyProduct[]
  onCaptionSelect?: (productId: string, platform: SocialPlatform) => PlatformCaption | undefined
  compact?: boolean
  selectedProductId?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PLATFORM_ICONS: Record<SocialPlatform, React.ElementType> = {
  instagram: Instagram,
  tiktok: Music,
  youtube: Youtube,
  facebook: Facebook,
}

const PLATFORM_GRADIENTS: Record<SocialPlatform, string> = {
  instagram: 'from-purple-500 to-pink-500',
  tiktok: 'from-slate-800 to-slate-600',
  youtube: 'from-red-500 to-red-600',
  facebook: 'from-blue-600 to-blue-500',
}

const PLATFORM_RING_COLORS: Record<SocialPlatform, string> = {
  instagram: 'ring-purple-400',
  tiktok: 'ring-slate-500',
  youtube: 'ring-red-400',
  facebook: 'ring-blue-400',
}

function getCharCountColor(current: number, max: number): string {
  const ratio = current / max
  if (ratio > 0.95) return 'text-red-500 dark:text-red-400'
  if (ratio > 0.8) return 'text-yellow-500 dark:text-yellow-400'
  return 'text-slate-500 dark:text-slate-400'
}

function getCharBarWidth(current: number, max: number): string {
  const pct = Math.min((current / max) * 100, 100)
  return `${pct}%`
}

function getCharBarColor(current: number, max: number): string {
  const ratio = current / max
  if (ratio > 0.95) return 'bg-red-500'
  if (ratio > 0.8) return 'bg-yellow-500'
  return 'bg-databake-turquoise'
}

function productImage(product: ShopifyProduct): string | null {
  return product.images?.edges?.[0]?.node?.url ?? null
}

function deepCloneCaptions(captions: PlatformCaption[]): PlatformCaption[] {
  return captions.map((c) => ({
    ...c,
    hashtags: [...c.hashtags],
  }))
}

// ---------------------------------------------------------------------------
// Stagger animation variants
// ---------------------------------------------------------------------------

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function CaptionManager({
  products,
  onCaptionSelect,
  compact = false,
  selectedProductId,
}: CaptionManagerProps) {
  // ---- State ---------------------------------------------------------------

  const [allCaptions, setAllCaptions] = useState<ProductCaptions[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Editing state
  const [editingProductId, setEditingProductId] = useState<string | null>(
    selectedProductId ?? null,
  )
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>('instagram')
  const [draftCaptions, setDraftCaptions] = useState<PlatformCaption[]>(
    deepCloneCaptions(DEFAULT_PLATFORM_CAPTIONS),
  )

  // Adding-new-product state
  const [showProductPicker, setShowProductPicker] = useState(false)
  const [productSearch, setProductSearch] = useState('')

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hashtag input per platform
  const [hashtagInput, setHashtagInput] = useState<Record<SocialPlatform, string>>({
    instagram: '',
    tiktok: '',
    youtube: '',
    facebook: '',
  })

  // ---- Fetch captions on mount ---------------------------------------------

  const fetchCaptions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/captions')
      if (!res.ok) throw new Error('Failed to load captions')
      const data: ProductCaptions[] = await res.json()
      setAllCaptions(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCaptions()
  }, [fetchCaptions])

  // When editingProductId changes, load existing captions into draft
  useEffect(() => {
    if (!editingProductId) return
    const existing = allCaptions.find((c) => c.productId === editingProductId)
    if (existing) {
      setDraftCaptions(deepCloneCaptions(existing.captions))
    } else {
      setDraftCaptions(deepCloneCaptions(DEFAULT_PLATFORM_CAPTIONS))
    }
    setActivePlatform('instagram')
    setHashtagInput({ instagram: '', tiktok: '', youtube: '', facebook: '' })
  }, [editingProductId, allCaptions])

  // ---- Helpers -------------------------------------------------------------

  const editingProduct = products.find((p) => p.id === editingProductId) ?? null

  const activeDraft = draftCaptions.find((c) => c.platform === activePlatform)!

  const isExisting = allCaptions.some((c) => c.productId === editingProductId)

  const productsWithCaptions = allCaptions
    .map((c) => {
      const product = products.find((p) => p.id === c.productId)
      return product ? { product, captions: c } : null
    })
    .filter(Boolean) as { product: ShopifyProduct; captions: ProductCaptions }[]

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) &&
      !allCaptions.some((c) => c.productId === p.id),
  )

  // ---- Copy to clipboard ---------------------------------------------------

  const copyToClipboard = useCallback(
    async (text: string, key: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopiedKey(key)
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
        copyTimeoutRef.current = setTimeout(() => setCopiedKey(null), 2000)
      } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setCopiedKey(key)
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
        copyTimeoutRef.current = setTimeout(() => setCopiedKey(null), 2000)
      }
    },
    [],
  )

  // ---- Draft mutations -----------------------------------------------------

  const updateDraftCaption = (platform: SocialPlatform, caption: string) => {
    setDraftCaptions((prev) =>
      prev.map((c) =>
        c.platform === platform
          ? { ...c, caption, currentLength: caption.length }
          : c,
      ),
    )
  }

  const addHashtags = (platform: SocialPlatform, raw: string) => {
    const tags = raw
      .split(/[\s,]+/)
      .map((t) => t.replace(/^#/, '').trim())
      .filter((t) => t.length > 0)
    if (tags.length === 0) return
    setDraftCaptions((prev) =>
      prev.map((c) => {
        if (c.platform !== platform) return c
        const existing = new Set(c.hashtags.map((h) => h.toLowerCase()))
        const newTags = tags.filter((t) => !existing.has(t.toLowerCase()))
        return { ...c, hashtags: [...c.hashtags, ...newTags] }
      }),
    )
    setHashtagInput((prev) => ({ ...prev, [platform]: '' }))
  }

  const removeHashtag = (platform: SocialPlatform, index: number) => {
    setDraftCaptions((prev) =>
      prev.map((c) => {
        if (c.platform !== platform) return c
        const hashtags = [...c.hashtags]
        hashtags.splice(index, 1)
        return { ...c, hashtags }
      }),
    )
  }

  // ---- Save ----------------------------------------------------------------

  const handleSave = async () => {
    if (!editingProductId || !editingProduct) return
    try {
      setSaving(true)
      setError(null)

      const payload: ProductCaptions = {
        id: isExisting
          ? allCaptions.find((c) => c.productId === editingProductId)!.id
          : crypto.randomUUID(),
        productId: editingProductId,
        productName: editingProduct.title,
        captions: draftCaptions.map((c) => ({
          ...c,
          currentLength: c.caption.length,
        })),
        createdAt: isExisting
          ? allCaptions.find((c) => c.productId === editingProductId)!.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const res = await fetch('/api/captions', {
        method: isExisting ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to save captions')

      await fetchCaptions()
      setEditingProductId(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  // ---- Delete --------------------------------------------------------------

  const handleDelete = async (productId: string) => {
    try {
      setSaving(true)
      setError(null)

      const res = await fetch('/api/captions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (!res.ok) throw new Error('Failed to delete captions')

      await fetchCaptions()
      if (editingProductId === productId) {
        setEditingProductId(null)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  // ---- Quick copy (compact mode) -------------------------------------------

  const handleQuickCopy = (productId: string, platform: SocialPlatform) => {
    if (onCaptionSelect) {
      const caption = onCaptionSelect(productId, platform)
      if (caption) {
        const hashtagStr = caption.hashtags.map((h) => `#${h}`).join(' ')
        const full = caption.caption + (hashtagStr ? `\n\n${hashtagStr}` : '')
        copyToClipboard(full, `quick-${productId}-${platform}`)
      }
      return
    }
    const pc = allCaptions.find((c) => c.productId === productId)
    if (!pc) return
    const caption = pc.captions.find((c) => c.platform === platform)
    if (!caption) return
    const hashtagStr = caption.hashtags.map((h) => `#${h}`).join(' ')
    const full = caption.caption + (hashtagStr ? `\n\n${hashtagStr}` : '')
    copyToClipboard(full, `quick-${productId}-${platform}`)
  }

  // =========================================================================
  // COMPACT MODE
  // =========================================================================

  if (compact) {
    return (
      <div className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-databake-turquoise" />
          </div>
        )}
        {!loading && productsWithCaptions.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
            No captions configured yet.
          </p>
        )}
        {!loading &&
          productsWithCaptions.map(({ product, captions }) => (
            <div
              key={product.id}
              className="p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-white/20 dark:border-slate-700/30"
            >
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate mb-2">
                {product.title}
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL_PLATFORMS.map((sp) => {
                  const Icon = PLATFORM_ICONS[sp.value]
                  const caption = captions.captions.find(
                    (c) => c.platform === sp.value,
                  )
                  const hasContent = caption && caption.caption.trim().length > 0
                  const key = `quick-${product.id}-${sp.value}`
                  return (
                    <motion.button
                      key={sp.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuickCopy(product.id, sp.value)}
                      disabled={!hasContent}
                      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        hasContent
                          ? `bg-gradient-to-br ${PLATFORM_GRADIENTS[sp.value]} text-white shadow-md hover:shadow-lg`
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      }`}
                      title={hasContent ? `Copy ${sp.label} caption` : `No ${sp.label} caption`}
                    >
                      <AnimatePresence mode="wait">
                        {copiedKey === key ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Icon className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}
      </div>
    )
  }

  // =========================================================================
  // FULL MODE
  // =========================================================================

  // ---- EDITOR VIEW ---------------------------------------------------------

  if (editingProductId && editingProduct) {
    const fullCaption =
      activeDraft.caption +
      (activeDraft.hashtags.length > 0
        ? `\n\n${activeDraft.hashtags.map((h) => `#${h}`).join(' ')}`
        : '')
    const hashtagsOnly = activeDraft.hashtags.map((h) => `#${h}`).join(' ')

    return (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        className="space-y-6"
      >
        {/* Back button + product header */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditingProductId(null)}
            className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/30 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            {productImage(editingProduct) && (
              <img
                src={productImage(editingProduct)!}
                alt={editingProduct.title}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white/50 dark:border-slate-700/50 shadow-sm"
              />
            )}
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-lg text-slate-800 dark:text-white truncate">
                {editingProduct.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isExisting ? 'Edit captions' : 'New captions'}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A8E6E1] to-[#7dd3cc] text-slate-800 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </motion.button>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-auto hover:text-red-800 dark:hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Platform tabs */}
        <div className="flex gap-2">
          {SOCIAL_PLATFORMS.map((sp) => {
            const Icon = PLATFORM_ICONS[sp.value]
            const isActive = activePlatform === sp.value
            const draft = draftCaptions.find((c) => c.platform === sp.value)!
            const hasContent = draft.caption.trim().length > 0

            return (
              <motion.button
                key={sp.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActivePlatform(sp.value)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-semibold text-sm transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${PLATFORM_GRADIENTS[sp.value]} text-white shadow-lg`
                    : 'bg-white/60 dark:bg-slate-800/60 backdrop-blur text-slate-600 dark:text-slate-300 border border-white/20 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{sp.label}</span>
                {hasContent && !isActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-slate-800" />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Active platform editor */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlatform}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="space-y-5 p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/30 shadow-lg"
          >
            {/* Platform info header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${PLATFORM_GRADIENTS[activePlatform]} flex items-center justify-center`}
                >
                  {(() => {
                    const Icon = PLATFORM_ICONS[activePlatform]
                    return <Icon className="w-4 h-4 text-white" />
                  })()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">
                    {SOCIAL_PLATFORMS.find((s) => s.value === activePlatform)?.label} Caption
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {SOCIAL_PLATFORMS.find((s) => s.value === activePlatform)?.hashtagNote}
                  </p>
                </div>
              </div>

              {/* Character counter */}
              <div className="text-right">
                <p
                  className={`text-sm font-mono font-semibold ${getCharCountColor(
                    activeDraft.caption.length,
                    activeDraft.charLimit,
                  )}`}
                >
                  {activeDraft.caption.length}/{activeDraft.charLimit}
                </p>
              </div>
            </div>

            {/* Character bar */}
            <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getCharBarColor(
                  activeDraft.caption.length,
                  activeDraft.charLimit,
                )}`}
                initial={{ width: 0 }}
                animate={{
                  width: getCharBarWidth(activeDraft.caption.length, activeDraft.charLimit),
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            </div>

            {/* Warning if near limit */}
            <AnimatePresence>
              {activeDraft.caption.length / activeDraft.charLimit > 0.95 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-xs text-red-500 dark:text-red-400"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Approaching character limit!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Textarea */}
            <div className="relative">
              <Type className="absolute top-3 left-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <textarea
                value={activeDraft.caption}
                onChange={(e) => updateDraftCaption(activePlatform, e.target.value)}
                maxLength={activeDraft.charLimit}
                rows={6}
                placeholder={`Write your ${SOCIAL_PLATFORMS.find((s) => s.value === activePlatform)?.label} caption here...`}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#A8E6E1] dark:focus:ring-[#A8E6E1]/60 resize-none transition-all text-sm leading-relaxed"
              />
            </div>

            {/* Hashtag section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#F9B4C4]" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hashtags</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({activeDraft.hashtags.length})
                </span>
              </div>

              {/* Hashtag chips */}
              <AnimatePresence>
                {activeDraft.hashtags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {activeDraft.hashtags.map((tag, idx) => (
                      <motion.span
                        key={`${tag}-${idx}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F9B4C4]/20 dark:bg-[#F9B4C4]/10 text-[#d4839a] dark:text-[#F9B4C4] text-xs font-medium border border-[#F9B4C4]/30 dark:border-[#F9B4C4]/20"
                      >
                        #{tag}
                        <button
                          onClick={() => removeHashtag(activePlatform, idx)}
                          className="ml-0.5 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hashtag input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={hashtagInput[activePlatform]}
                    onChange={(e) =>
                      setHashtagInput((prev) => ({
                        ...prev,
                        [activePlatform]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addHashtags(activePlatform, hashtagInput[activePlatform])
                      }
                    }}
                    placeholder="Add hashtags (comma or space separated)"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#A8E6E1] dark:focus:ring-[#A8E6E1]/60 text-sm transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addHashtags(activePlatform, hashtagInput[activePlatform])}
                  className="px-4 py-2.5 rounded-xl bg-[#F9B4C4]/20 hover:bg-[#F9B4C4]/30 dark:bg-[#F9B4C4]/10 dark:hover:bg-[#F9B4C4]/20 text-[#d4839a] dark:text-[#F9B4C4] font-medium text-sm transition-all border border-[#F9B4C4]/30 dark:border-[#F9B4C4]/20"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Copy buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  copyToClipboard(fullCaption, `caption-${activePlatform}`)
                }
                disabled={activeDraft.caption.trim().length === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#A8E6E1] to-[#7dd3cc] text-slate-800 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {copiedKey === `caption-${activePlatform}` ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Copied!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Caption
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  copyToClipboard(hashtagsOnly, `hashtags-${activePlatform}`)
                }
                disabled={activeDraft.hashtags.length === 0}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/60 dark:bg-slate-700/60 backdrop-blur border border-white/30 dark:border-slate-600/30 text-slate-700 dark:text-slate-200 font-medium hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {copiedKey === `hashtags-${activePlatform}` ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Copied!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Hash className="w-4 h-4" />
                      Copy Hashtags Only
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    )
  }

  // ---- PRODUCT LIST VIEW ---------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#A8E6E1] to-[#F9B4C4] flex items-center justify-center shadow-md">
            <Type className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-slate-800 dark:text-white">Caption Manager</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Fixed captions per product per platform
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowProductPicker(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A8E6E1] to-[#7dd3cc] text-slate-800 font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Captions for Product
        </motion.button>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto hover:text-red-800 dark:hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#A8E6E1]" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading captions...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && productsWithCaptions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-white/20 dark:border-slate-700/30"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A8E6E1]/30 to-[#F9B4C4]/30 flex items-center justify-center mb-4">
            <Type className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No captions yet</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
            Add captions for your products to quickly copy and paste them when posting on social media.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProductPicker(true)}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A8E6E1] to-[#7dd3cc] text-slate-800 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Your First Caption
          </motion.button>
        </motion.div>
      )}

      {/* Products with captions list */}
      {!loading && productsWithCaptions.length > 0 && (
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {productsWithCaptions.map(({ product, captions }) => (
            <motion.div
              key={product.id}
              variants={listItemVariants}
              layout
              className="group p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/20 dark:border-slate-700/30 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Product image */}
                {productImage(product) ? (
                  <img
                    src={productImage(product)!}
                    alt={product.title}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-white/50 dark:border-slate-700/50 shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#A8E6E1]/20 to-[#F9B4C4]/20 flex items-center justify-center flex-shrink-0">
                    <Type className="w-6 h-6 text-slate-400" />
                  </div>
                )}

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 dark:text-white truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    {SOCIAL_PLATFORMS.map((sp) => {
                      const caption = captions.captions.find(
                        (c) => c.platform === sp.value,
                      )
                      const hasContent =
                        caption && caption.caption.trim().length > 0
                      const Icon = PLATFORM_ICONS[sp.value]
                      return (
                        <div
                          key={sp.value}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            hasContent
                              ? `bg-gradient-to-br ${PLATFORM_GRADIENTS[sp.value]} text-white`
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                          }`}
                          title={`${sp.label}: ${hasContent ? 'Caption set' : 'No caption'}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      )
                    })}
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                      {captions.captions.filter((c) => c.caption.trim().length > 0).length}/4 platforms
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingProductId(product.id)}
                    className="w-9 h-9 rounded-xl bg-[#A8E6E1]/20 hover:bg-[#A8E6E1]/30 dark:bg-[#A8E6E1]/10 dark:hover:bg-[#A8E6E1]/20 flex items-center justify-center text-[#5eaba2] dark:text-[#A8E6E1] transition-all"
                    title="Edit captions"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(product.id)}
                    className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 flex items-center justify-center text-red-500 dark:text-red-400 transition-all"
                    title="Delete captions"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ---- Product picker modal ---- */}
      <AnimatePresence>
        {showProductPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setShowProductPicker(false)
                setProductSearch('')
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg max-h-[70vh] rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="p-5 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                    Select a Product
                  </h3>
                  <button
                    onClick={() => {
                      setShowProductPicker(false)
                      setProductSearch('')
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#A8E6E1] text-sm"
                    autoFocus
                  />
                </div>
              </div>

              {/* Product list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {filteredProducts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {productSearch
                        ? 'No matching products found'
                        : 'All products already have captions'}
                    </p>
                  </div>
                )}
                {filteredProducts.map((product) => (
                  <motion.button
                    key={product.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setEditingProductId(product.id)
                      setShowProductPicker(false)
                      setProductSearch('')
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#A8E6E1]/10 dark:hover:bg-[#A8E6E1]/5 transition-colors text-left"
                  >
                    {productImage(product) ? (
                      <img
                        src={productImage(product)!}
                        alt={product.title}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Type className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-slate-800 dark:text-white truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {product.priceRange?.minVariantPrice?.amount
                          ? `${product.priceRange.minVariantPrice.currencyCode} ${product.priceRange.minVariantPrice.amount}`
                          : 'No price'}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
