'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Settings,
  Palette,
  Type,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Star,
  Zap,
  Download,
  RefreshCw,
  ChevronRight,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  LayoutGrid
} from 'lucide-react'
import { AdProject, AdScene, ProductAnimation, AdStyle } from '@/types/content'

interface AdGeneratorProps {
  productImage?: string
  productName?: string
  productPrice?: string
  productFeatures?: string[]
  onExport?: (project: AdProject) => void
}

// Ad Templates
const AD_TEMPLATES = [
  {
    id: 'amazon-style',
    name: 'Amazon Product Ad',
    platform: 'amazon',
    duration: 15,
    thumbnail: '🛒'
  },
  {
    id: 'facebook-carousel',
    name: 'Facebook Carousel',
    platform: 'facebook',
    duration: 30,
    thumbnail: '📘'
  },
  {
    id: 'tiktok-spark',
    name: 'TikTok Spark Ad',
    platform: 'tiktok',
    duration: 15,
    thumbnail: '🎵'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story Ad',
    platform: 'instagram',
    duration: 15,
    thumbnail: '📸'
  },
  {
    id: 'google-display',
    name: 'Google Display',
    platform: 'google',
    duration: 6,
    thumbnail: '🔍'
  }
]

// Product Animations
const ANIMATIONS: { id: ProductAnimation; name: string; icon: string }[] = [
  { id: 'float', name: 'Float', icon: '🎈' },
  { id: 'rotate', name: 'Rotate', icon: '🔄' },
  { id: 'zoom', name: 'Zoom', icon: '🔍' },
  { id: 'bounce', name: 'Bounce', icon: '⚡' },
  { id: 'spin', name: 'Spin', icon: '🌀' },
  { id: 'glow', name: 'Glow', icon: '✨' },
  { id: 'pulse', name: 'Pulse', icon: '💫' },
  { id: 'slide_in', name: 'Slide In', icon: '➡️' }
]

// Badge Styles
const BADGE_PRESETS = [
  { text: 'Best Seller', color: '#FF6B6B', icon: '🏆' },
  { text: 'New', color: '#4ECDC4', icon: '🆕' },
  { text: 'Sale', color: '#FF9F43', icon: '🔥' },
  { text: 'Limited', color: '#9B59B6', icon: '⏰' },
  { text: 'Free Shipping', color: '#3498DB', icon: '🚚' },
  { text: 'Top Rated', color: '#F1C40F', icon: '⭐' },
  { text: 'Premium', color: '#1ABC9C', icon: '💎' },
  { text: 'Save 50%', color: '#E74C3C', icon: '💰' }
]

// Color Schemes
const COLOR_SCHEMES: AdStyle[] = [
  {
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    accentColor: '#FFD700',
    fontFamily: 'Inter',
    badgeStyle: 'pill',
    priceStyle: 'highlight'
  },
  {
    primaryColor: '#FF6B6B',
    secondaryColor: '#FFFFFF',
    accentColor: '#4ECDC4',
    fontFamily: 'Inter',
    badgeStyle: 'rounded',
    priceStyle: 'badge'
  },
  {
    primaryColor: '#667EEA',
    secondaryColor: '#FFFFFF',
    accentColor: '#F093FB',
    fontFamily: 'Inter',
    badgeStyle: 'pill',
    priceStyle: 'highlight'
  },
  {
    primaryColor: '#1A1A2E',
    secondaryColor: '#EAEAEA',
    accentColor: '#E94560',
    fontFamily: 'Inter',
    badgeStyle: 'square',
    priceStyle: 'strike'
  }
]

export function AdGenerator({ productImage, productName, productPrice, productFeatures = [], onExport }: AdGeneratorProps) {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState(AD_TEMPLATES[0])
  const [selectedStyle, setSelectedStyle] = useState(COLOR_SCHEMES[0])
  const [selectedAnimation, setSelectedAnimation] = useState<ProductAnimation>('float')
  const [badges, setBadges] = useState<typeof BADGE_PRESETS>([BADGE_PRESETS[0]])
  const [headline, setHeadline] = useState(productName || 'Amazing Product')
  const [subheadline, setSubheadline] = useState('The best you can get')
  const [price, setPrice] = useState(productPrice || '$99.99')
  const [originalPrice, setOriginalPrice] = useState('$149.99')
  const [features, setFeatures] = useState(productFeatures.length > 0 ? productFeatures : [
    'Premium Quality',
    'Fast Shipping',
    '30-Day Returns'
  ])
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'animation'>('content')

  // Add badge
  const addBadge = (badge: typeof BADGE_PRESETS[0]) => {
    if (badges.length < 3 && !badges.find(b => b.text === badge.text)) {
      setBadges([...badges, badge])
    }
  }

  // Remove badge
  const removeBadge = (text: string) => {
    setBadges(badges.filter(b => b.text !== text))
  }

  // Add feature
  const addFeature = () => {
    setFeatures([...features, 'New Feature'])
  }

  // Update feature
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  // Remove feature
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Ad Generator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Platform: {selectedTemplate.name} - {selectedTemplate.duration}s
            </p>
          </div>
          <button
            onClick={() => onExport?.({
              id: `ad-${Date.now()}`,
              name: headline,
              platform: selectedTemplate.platform as AdProject['platform'],
              product: {
                name: headline,
                description: subheadline,
                price,
                imageUrl: productImage || '',
                features,
                badges: badges.map(b => b.text)
              },
              scenes: [],
              style: selectedStyle,
              duration: selectedTemplate.duration,
              status: 'ready',
              createdAt: new Date().toISOString()
            })}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Ad
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left Panel */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-700">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {[
              { id: 'content', label: 'Content', icon: Type },
              { id: 'style', label: 'Style', icon: Palette },
              { id: 'animation', label: 'Animation', icon: Sparkles },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto space-y-4">
            {/* Content Tab */}
            {activeTab === 'content' && (
              <>
                {/* Headline */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg"
                  />
                </div>

                {/* Subheadline */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Subheadline</label>
                  <input
                    type="text"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg"
                  />
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Price</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">Original</label>
                    <input
                      type="text"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg"
                    />
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">Badges (max 3)</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {badges.map(badge => (
                      <span
                        key={badge.text}
                        className="px-2 py-1 rounded-full text-xs text-white flex items-center gap-1"
                        style={{ backgroundColor: badge.color }}
                      >
                        {badge.icon} {badge.text}
                        <button
                          onClick={() => removeBadge(badge.text)}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {BADGE_PRESETS.map(badge => (
                      <button
                        key={badge.text}
                        onClick={() => addBadge(badge)}
                        disabled={badges.find(b => b.text === badge.text) !== undefined}
                        className="p-2 rounded text-center text-lg disabled:opacity-30"
                        title={badge.text}
                      >
                        {badge.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-slate-500">Features</label>
                    <button
                      onClick={addFeature}
                      className="text-xs text-blue-500 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(idx, e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded"
                        />
                        <button
                          onClick={() => removeFeature(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Style Tab */}
            {activeTab === 'style' && (
              <>
                {/* Color Schemes */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">Color Scheme</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_SCHEMES.map((scheme, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedStyle(scheme)}
                        className={`p-3 rounded-xl transition-all ${
                          selectedStyle === scheme
                            ? 'ring-2 ring-orange-500'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: scheme.primaryColor }}
                          />
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: scheme.secondaryColor }}
                          />
                          <div
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: scheme.accentColor }}
                          />
                        </div>
                        <p className="text-xs text-slate-500">Scheme {idx + 1}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ad Templates */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">Platform Template</label>
                  <div className="space-y-2">
                    {AD_TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                          selectedTemplate.id === template.id
                            ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500'
                            : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-2xl">{template.thumbnail}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium">{template.name}</p>
                          <p className="text-xs text-slate-400">{template.duration}s</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Animation Tab */}
            {activeTab === 'animation' && (
              <div>
                <label className="text-xs font-medium text-slate-500 mb-2 block">Product Animation</label>
                <div className="grid grid-cols-4 gap-2">
                  {ANIMATIONS.map(anim => (
                    <button
                      key={anim.id}
                      onClick={() => setSelectedAnimation(anim.id)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        selectedAnimation === anim.id
                          ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500'
                          : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'
                      }`}
                      title={anim.name}
                    >
                      <span className="text-xl">{anim.icon}</span>
                      <p className="text-[10px] mt-1 text-slate-500">{anim.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 p-8 flex items-center justify-center bg-slate-100 dark:bg-slate-900/50">
          <div className="relative w-full max-w-md">
            {/* Ad Preview */}
            <motion.div
              className="aspect-square rounded-2xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: selectedStyle.primaryColor }}
            >
              {/* Product Image */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={
                  selectedAnimation === 'float' ? { y: [0, -10, 0] } :
                  selectedAnimation === 'pulse' ? { scale: [1, 1.05, 1] } :
                  selectedAnimation === 'rotate' ? { rotate: [0, 5, -5, 0] } :
                  {}
                }
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {productImage ? (
                  <img
                    src={productImage}
                    alt=""
                    className="w-3/4 h-3/4 object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/50" />
                  </div>
                )}
              </motion.div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {badges.map((badge, idx) => (
                  <motion.div
                    key={badge.text}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg"
                    style={{ backgroundColor: badge.color }}
                  >
                    {badge.icon} {badge.text}
                  </motion.div>
                ))}
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <motion.h3
                  className="text-2xl font-bold text-white mb-1"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  {headline}
                </motion.h3>
                <motion.p
                  className="text-white/80 text-sm mb-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {subheadline}
                </motion.p>

                {/* Price */}
                <motion.div
                  className="flex items-center gap-3 mb-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span
                    className="text-3xl font-bold"
                    style={{ color: selectedStyle.accentColor }}
                  >
                    {price}
                  </span>
                  <span className="text-white/50 line-through text-lg">
                    {originalPrice}
                  </span>
                </motion.div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {features.slice(0, 3).map((feature, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="px-2 py-1 rounded-full bg-white/20 text-white text-xs"
                    >
                      ✓ {feature}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 p-4 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
