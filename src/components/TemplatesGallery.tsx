'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layout,
  Film,
  Camera,
  Image,
  LayoutGrid,
  BookOpen,
  Sparkles,
  Check,
  Eye,
  Download,
  Star,
  TrendingUp,
  Clock,
  Palette,
  Play,
  Zap
} from 'lucide-react'
import { ContentType } from '@/types'

export interface VideoTemplate {
  id: string
  name: string
  description: string
  contentType: ContentType
  thumbnail: string
  previewUrl?: string
  category: 'trending' | 'minimal' | 'bold' | 'elegant' | 'fun' | 'professional'
  colors: string[]
  features: string[]
  uses: number
  rating: number
  new: boolean
  premium: boolean
}

const TEMPLATES: VideoTemplate[] = [
  // REELS
  {
    id: 'reel-viral-hook',
    name: 'Viral Hook',
    description: 'Bold text animations that grab attention in the first second',
    contentType: 'reel',
    thumbnail: 'https://picsum.photos/seed/reel1/300/533',
    category: 'trending',
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
    features: ['Hook animation', 'Bold captions', 'Trending music'],
    uses: 125000,
    rating: 4.9,
    new: false,
    premium: false
  },
  {
    id: 'reel-product-showcase',
    name: 'Product Showcase',
    description: 'Clean product presentation with price tags and features',
    contentType: 'reel',
    thumbnail: 'https://picsum.photos/seed/reel2/300/533',
    category: 'professional',
    colors: ['#FFFFFF', '#000000', '#A8E6E1'],
    features: ['Price overlay', 'Feature callouts', 'CTA button'],
    uses: 89000,
    rating: 4.8,
    new: true,
    premium: false
  },
  {
    id: 'reel-before-after',
    name: 'Before & After',
    description: 'Split-screen transformation effect',
    contentType: 'reel',
    thumbnail: 'https://picsum.photos/seed/reel3/300/533',
    category: 'trending',
    colors: ['#9B59B6', '#3498DB', '#FFFFFF'],
    features: ['Split screen', 'Wipe transition', 'Progress bar'],
    uses: 156000,
    rating: 4.9,
    new: false,
    premium: true
  },
  {
    id: 'reel-countdown',
    name: 'Top 5 Countdown',
    description: 'Countdown style with number animations',
    contentType: 'reel',
    thumbnail: 'https://picsum.photos/seed/reel4/300/533',
    category: 'fun',
    colors: ['#FF00FF', '#00FFFF', '#FFFF00'],
    features: ['Number animations', 'Sound effects', 'Reveal effect'],
    uses: 78000,
    rating: 4.7,
    new: true,
    premium: false
  },

  // STORIES
  {
    id: 'story-flash-sale',
    name: 'Flash Sale',
    description: 'Urgent sale announcement with timer',
    contentType: 'story',
    thumbnail: 'https://picsum.photos/seed/story1/300/533',
    category: 'bold',
    colors: ['#FF0000', '#FFFF00', '#FFFFFF'],
    features: ['Countdown timer', 'Swipe up CTA', 'Price slash'],
    uses: 234000,
    rating: 4.9,
    new: false,
    premium: false
  },
  {
    id: 'story-poll',
    name: 'Interactive Poll',
    description: 'Engagement-focused with poll stickers',
    contentType: 'story',
    thumbnail: 'https://picsum.photos/seed/story2/300/533',
    category: 'fun',
    colors: ['#E91E63', '#9C27B0', '#673AB7'],
    features: ['Poll placeholder', 'Question sticker', 'Emoji slider'],
    uses: 189000,
    rating: 4.8,
    new: false,
    premium: false
  },
  {
    id: 'story-new-arrival',
    name: 'New Arrival',
    description: 'Elegant product reveal animation',
    contentType: 'story',
    thumbnail: 'https://picsum.photos/seed/story3/300/533',
    category: 'elegant',
    colors: ['#D4AF37', '#000000', '#FFFFFF'],
    features: ['Reveal animation', 'Sparkle effects', 'Premium feel'],
    uses: 145000,
    rating: 4.9,
    new: true,
    premium: true
  },

  // POSTS
  {
    id: 'post-minimalist',
    name: 'Minimalist Product',
    description: 'Clean white background product shot',
    contentType: 'post',
    thumbnail: 'https://picsum.photos/seed/post1/400/400',
    category: 'minimal',
    colors: ['#FFFFFF', '#000000', '#F5F5F5'],
    features: ['Clean layout', 'Product focus', 'Subtle shadow'],
    uses: 312000,
    rating: 4.9,
    new: false,
    premium: false
  },
  {
    id: 'post-lifestyle',
    name: 'Lifestyle Shot',
    description: 'Product in real-life context',
    contentType: 'post',
    thumbnail: 'https://picsum.photos/seed/post2/400/400',
    category: 'professional',
    colors: ['#8B7355', '#FFFFFF', '#2C3E50'],
    features: ['Context imagery', 'Natural lighting', 'Brand colors'],
    uses: 267000,
    rating: 4.8,
    new: false,
    premium: false
  },
  {
    id: 'post-quote',
    name: 'Quote Card',
    description: 'Testimonial or quote with elegant typography',
    contentType: 'post',
    thumbnail: 'https://picsum.photos/seed/post3/400/400',
    category: 'elegant',
    colors: ['#F9B4C4', '#FFFFFF', '#333333'],
    features: ['Quote marks', 'Customer photo', 'Star rating'],
    uses: 198000,
    rating: 4.7,
    new: true,
    premium: false
  },

  // CAROUSEL
  {
    id: 'carousel-tutorial',
    name: 'Step-by-Step',
    description: '7-slide how-to guide format',
    contentType: 'carousel',
    thumbnail: 'https://picsum.photos/seed/carousel1/400/400',
    category: 'professional',
    colors: ['#3498DB', '#FFFFFF', '#2C3E50'],
    features: ['Numbered steps', 'Progress indicator', 'Swipe hint'],
    uses: 423000,
    rating: 4.9,
    new: false,
    premium: false
  },
  {
    id: 'carousel-comparison',
    name: 'Product Comparison',
    description: 'Compare features across slides',
    contentType: 'carousel',
    thumbnail: 'https://picsum.photos/seed/carousel2/400/400',
    category: 'professional',
    colors: ['#27AE60', '#E74C3C', '#FFFFFF'],
    features: ['Check/X icons', 'Side-by-side', 'Winner slide'],
    uses: 287000,
    rating: 4.8,
    new: true,
    premium: true
  },
  {
    id: 'carousel-storytelling',
    name: 'Brand Story',
    description: 'Tell your brand journey in slides',
    contentType: 'carousel',
    thumbnail: 'https://picsum.photos/seed/carousel3/400/400',
    category: 'elegant',
    colors: ['#A8E6E1', '#F9B4C4', '#FFFFFF'],
    features: ['Timeline style', 'Emotional arc', 'CTA finale'],
    uses: 156000,
    rating: 4.9,
    new: false,
    premium: false
  },

  // STORYTELLING
  {
    id: 'storytelling-problem-solution',
    name: 'Problem → Solution',
    description: 'Classic pain point to resolution narrative',
    contentType: 'storytelling',
    thumbnail: 'https://picsum.photos/seed/story-tell1/300/533',
    category: 'professional',
    colors: ['#E74C3C', '#27AE60', '#FFFFFF'],
    features: ['6 scenes', 'Emotional journey', 'Voice sync'],
    uses: 189000,
    rating: 4.9,
    new: false,
    premium: false
  },
  {
    id: 'storytelling-day-in-life',
    name: 'Day in the Life',
    description: 'Follow a customer using your product',
    contentType: 'storytelling',
    thumbnail: 'https://picsum.photos/seed/story-tell2/300/533',
    category: 'fun',
    colors: ['#F39C12', '#3498DB', '#FFFFFF'],
    features: ['Time stamps', 'Real scenarios', 'Relatable'],
    uses: 234000,
    rating: 4.8,
    new: true,
    premium: true
  },
  {
    id: 'storytelling-transformation',
    name: 'Transformation',
    description: 'Dramatic before/after story arc',
    contentType: 'storytelling',
    thumbnail: 'https://picsum.photos/seed/story-tell3/300/533',
    category: 'bold',
    colors: ['#9B59B6', '#F1C40F', '#FFFFFF'],
    features: ['Contrast scenes', 'Dramatic music', 'Results focus'],
    uses: 312000,
    rating: 4.9,
    new: false,
    premium: false
  }
]

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Layout },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'minimal', label: 'Minimal', icon: Sparkles },
  { id: 'bold', label: 'Bold', icon: Zap },
  { id: 'elegant', label: 'Elegant', icon: Star },
  { id: 'fun', label: 'Fun', icon: Palette },
  { id: 'professional', label: 'Pro', icon: Layout }
]

const CONTENT_TYPE_ICONS = {
  reel: Film,
  story: Camera,
  post: Image,
  carousel: LayoutGrid,
  storytelling: BookOpen,
  'video-to-shorts': Film
}

interface TemplatesGalleryProps {
  contentType?: ContentType
  onSelectTemplate: (template: VideoTemplate) => void
  selectedTemplateId?: string
}

export function TemplatesGallery({ contentType, onSelectTemplate, selectedTemplateId }: TemplatesGalleryProps) {
  const [filterType, setFilterType] = useState<ContentType | 'all'>(contentType || 'all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [previewTemplate, setPreviewTemplate] = useState<VideoTemplate | null>(null)

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesType = filterType === 'all' || t.contentType === filterType
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    return matchesType && matchesCategory
  })

  const formatUses = (uses: number) => {
    if (uses >= 1000000) return `${(uses / 1000000).toFixed(1)}M`
    if (uses >= 1000) return `${(uses / 1000).toFixed(0)}K`
    return uses.toString()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Templates</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pre-designed video templates</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium">
          {filteredTemplates.length} templates
        </span>
      </div>

      {/* Content Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            filterType === 'all'
              ? 'bg-databake-turquoise text-databake-text'
              : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
          }`}
        >
          All Types
        </button>
        {(['reel', 'story', 'post', 'carousel', 'storytelling'] as ContentType[]).map(type => {
          const Icon = CONTENT_TYPE_ICONS[type]
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-databake-turquoise text-databake-text'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )
        })}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === cat.id
                ? 'bg-databake-pink text-white'
                : 'bg-white/30 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:bg-white/50'
            }`}
          >
            <cat.icon className="w-3 h-3" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto">
        {filteredTemplates.map(template => {
          const TypeIcon = CONTENT_TYPE_ICONS[template.contentType]
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className={`relative group rounded-2xl overflow-hidden cursor-pointer transition-all ${
                selectedTemplateId === template.id
                  ? 'ring-2 ring-databake-turquoise ring-offset-2 dark:ring-offset-slate-900'
                  : ''
              }`}
              onClick={() => onSelectTemplate(template)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[9/16]">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {template.new && (
                    <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold">
                      NEW
                    </span>
                  )}
                  {template.premium && (
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold flex items-center gap-1">
                      <Star className="w-2 h-2" /> PRO
                    </span>
                  )}
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 right-2">
                  <div className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <TypeIcon className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Preview Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template); }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <Play className="w-5 h-5 text-slate-800 ml-0.5" />
                </button>

                {/* Selected Check */}
                {selectedTemplateId === template.id && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-databake-turquoise flex items-center justify-center">
                    <Check className="w-6 h-6 text-databake-text" />
                  </div>
                )}

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-semibold text-sm mb-1">{template.name}</p>
                  <div className="flex items-center gap-2 text-white/70 text-xs">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {template.rating}
                    </span>
                    <span>•</span>
                    <span>{formatUses(template.uses)} uses</span>
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="absolute bottom-0 left-0 right-0 flex h-1">
                {template.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layout className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No templates found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Image */}
              <div className="relative aspect-[9/16] max-h-[400px]">
                <img
                  src={previewTemplate.thumbnail}
                  alt={previewTemplate.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold">{previewTemplate.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{previewTemplate.description}</p>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{previewTemplate.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                      <Eye className="w-4 h-4" />
                      {formatUses(previewTemplate.uses)} uses
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {previewTemplate.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onSelectTemplate(previewTemplate)
                      setPreviewTemplate(null)
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-databake-turquoise to-databake-turquoise-dark text-databake-text font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Use Template
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
