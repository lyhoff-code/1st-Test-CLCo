'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Type,
  Image as ImageIcon,
  Sticker,
  Sparkles,
  Palette,
  Layers,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  RotateCcw,
  Move,
  Wand2,
  Music,
  Filter
} from 'lucide-react'

interface StoriesCreatorProps {
  productImage?: string
  productName?: string
  onExport?: (data: any) => void
}

// Animated Story Templates
const STORY_TEMPLATES = [
  {
    id: 'product-reveal',
    name: 'Product Reveal',
    category: 'trending',
    thumbnail: '🎁',
    duration: 5,
    description: 'Dramatic product reveal with zoom'
  },
  {
    id: 'sale-alert',
    name: 'Sale Alert',
    category: 'bold',
    thumbnail: '🔥',
    duration: 4,
    description: 'Eye-catching sale announcement'
  },
  {
    id: 'minimal-showcase',
    name: 'Minimal Showcase',
    category: 'minimal',
    thumbnail: '✨',
    duration: 6,
    description: 'Clean, elegant product display'
  },
  {
    id: 'countdown',
    name: 'Countdown',
    category: 'bold',
    thumbnail: '⏰',
    duration: 5,
    description: 'Limited time offer countdown'
  },
  {
    id: 'before-after',
    name: 'Before & After',
    category: 'trending',
    thumbnail: '🔄',
    duration: 6,
    description: 'Transformation reveal'
  },
  {
    id: 'quote-style',
    name: 'Quote Style',
    category: 'elegant',
    thumbnail: '💬',
    duration: 4,
    description: 'Testimonial or quote highlight'
  },
  {
    id: 'list-style',
    name: '3 Things You Need',
    category: 'fun',
    thumbnail: '📝',
    duration: 8,
    description: 'Numbered list format'
  },
  {
    id: 'quick-tip',
    name: 'Quick Tip',
    category: 'professional',
    thumbnail: '💡',
    duration: 5,
    description: 'Share a helpful tip'
  }
]

// Text Animation Styles
const TEXT_ANIMATIONS = [
  { id: 'fade', name: 'Fade In', icon: '✨' },
  { id: 'slide-up', name: 'Slide Up', icon: '⬆️' },
  { id: 'slide-down', name: 'Slide Down', icon: '⬇️' },
  { id: 'typewriter', name: 'Typewriter', icon: '⌨️' },
  { id: 'bounce', name: 'Bounce', icon: '🏀' },
  { id: 'scale', name: 'Scale Up', icon: '📏' },
  { id: 'shake', name: 'Shake', icon: '📳' },
  { id: 'glow', name: 'Glow', icon: '💫' },
]

// Stickers
const STICKERS = [
  '🔥', '✨', '💯', '🎉', '⭐', '💪', '🚀', '💰',
  '🛒', '📦', '🎁', '❤️', '👆', '👇', '➡️', '⬅️',
  '🆕', '🔴', '🟢', '⚡', '🏆', '👑', '💎', '🎯'
]

// Color Filters
const FILTERS = [
  { id: 'none', name: 'None', filter: '' },
  { id: 'warm', name: 'Warm', filter: 'sepia(20%) saturate(120%)' },
  { id: 'cool', name: 'Cool', filter: 'saturate(90%) hue-rotate(10deg)' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(40%) contrast(90%)' },
  { id: 'bw', name: 'B&W', filter: 'grayscale(100%)' },
  { id: 'vivid', name: 'Vivid', filter: 'saturate(150%) contrast(110%)' },
  { id: 'fade', name: 'Fade', filter: 'contrast(90%) brightness(110%)' },
  { id: 'dramatic', name: 'Dramatic', filter: 'contrast(130%) brightness(90%)' },
]

interface StoryElement {
  id: string
  type: 'text' | 'image' | 'sticker'
  x: number
  y: number
  content: string
  style: {
    fontSize?: number
    fontWeight?: string
    color?: string
    animation?: string
  }
}

export function StoriesCreator({ productImage, productName, onExport }: StoriesCreatorProps) {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState(STORY_TEMPLATES[0])
  const [elements, setElements] = useState<StoryElement[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFilter, setCurrentFilter] = useState(FILTERS[0])
  const [backgroundColor, setBackgroundColor] = useState('#000000')

  // UI state
  const [activePanel, setActivePanel] = useState<'templates' | 'text' | 'stickers' | 'filters'>('templates')

  // Add element
  const addElement = (type: StoryElement['type'], content: string) => {
    const newElement: StoryElement = {
      id: `element-${Date.now()}`,
      type,
      x: 50,
      y: 50,
      content,
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        animation: 'fade'
      }
    }
    setElements([...elements, newElement])
    setSelectedElementId(newElement.id)
  }

  // Update element
  const updateElement = (id: string, updates: Partial<StoryElement>) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  // Delete element
  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    if (selectedElementId === id) setSelectedElementId(null)
  }

  const selectedElement = elements.find(el => el.id === selectedElementId)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              Stories & Reels Creator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Template: {selectedTemplate.name} - {selectedTemplate.duration}s
            </p>
          </div>
          <button
            onClick={() => onExport?.({ template: selectedTemplate, elements, filter: currentFilter })}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left Panel - Tools */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-700">
          {/* Tool Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {[
              { id: 'templates', label: 'Templates', icon: Layers },
              { id: 'text', label: 'Text', icon: Type },
              { id: 'stickers', label: 'Stickers', icon: Sticker },
              { id: 'filters', label: 'Filters', icon: Filter },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id as typeof activePanel)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs transition-colors ${
                  activePanel === tab.id
                    ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50 dark:bg-pink-900/20'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto">
            {/* Templates Panel */}
            {activePanel === 'templates' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Choose a Template
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {STORY_TEMPLATES.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedTemplate.id === template.id
                          ? 'bg-pink-100 dark:bg-pink-900/30 border-2 border-pink-500'
                          : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{template.thumbnail}</span>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        {template.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{template.duration}s</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Text Panel */}
            {activePanel === 'text' && (
              <div className="space-y-4">
                <button
                  onClick={() => addElement('text', 'Your Text Here')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Text
                </button>

                {selectedElement?.type === 'text' && (
                  <>
                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Text</label>
                      <input
                        type="text"
                        value={selectedElement.content}
                        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-2 block">Animation</label>
                      <div className="grid grid-cols-4 gap-2">
                        {TEXT_ANIMATIONS.map(anim => (
                          <button
                            key={anim.id}
                            onClick={() => updateElement(selectedElement.id, {
                              style: { ...selectedElement.style, animation: anim.id }
                            })}
                            className={`p-2 rounded-lg text-center ${
                              selectedElement.style.animation === anim.id
                                ? 'bg-pink-100 dark:bg-pink-900/30 border-2 border-pink-500'
                                : 'bg-slate-100 dark:bg-slate-700'
                            }`}
                            title={anim.name}
                          >
                            <span className="text-lg">{anim.icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Font Size</label>
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={selectedElement.style.fontSize || 24}
                        onChange={(e) => updateElement(selectedElement.id, {
                          style: { ...selectedElement.style, fontSize: parseInt(e.target.value) }
                        })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">Color</label>
                      <input
                        type="color"
                        value={selectedElement.style.color || '#FFFFFF'}
                        onChange={(e) => updateElement(selectedElement.id, {
                          style: { ...selectedElement.style, color: e.target.value }
                        })}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Stickers Panel */}
            {activePanel === 'stickers' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Add Stickers
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {STICKERS.map((sticker, idx) => (
                    <button
                      key={idx}
                      onClick={() => addElement('sticker', sticker)}
                      className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-2xl"
                    >
                      {sticker}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filters Panel */}
            {activePanel === 'filters' && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Color Filters
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {FILTERS.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setCurrentFilter(filter)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        currentFilter.id === filter.id
                          ? 'bg-pink-100 dark:bg-pink-900/30 border-2 border-pink-500'
                          : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className="w-full aspect-square rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 mb-2"
                        style={{ filter: filter.filter }}
                      />
                      <span className="text-xs font-medium">{filter.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <label className="text-xs font-medium text-slate-500 mb-2 block">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 p-8 flex items-center justify-center bg-slate-100 dark:bg-slate-900/50">
          <div className="relative">
            {/* Phone frame */}
            <div className="w-[280px] h-[560px] bg-black rounded-[40px] p-3 shadow-2xl">
              <div
                className="w-full h-full rounded-[32px] overflow-hidden relative"
                style={{
                  backgroundColor,
                  filter: currentFilter.filter
                }}
              >
                {/* Product Image */}
                {productImage && (
                  <img
                    src={productImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Elements */}
                {elements.map(element => (
                  <motion.div
                    key={element.id}
                    onClick={() => setSelectedElementId(element.id)}
                    className={`absolute cursor-move ${
                      selectedElementId === element.id ? 'ring-2 ring-pink-500' : ''
                    }`}
                    style={{
                      left: `${element.x}%`,
                      top: `${element.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    drag
                    dragMomentum={false}
                  >
                    {element.type === 'text' && (
                      <p
                        style={{
                          fontSize: element.style.fontSize,
                          fontWeight: element.style.fontWeight,
                          color: element.style.color,
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                      >
                        {element.content}
                      </p>
                    )}
                    {element.type === 'sticker' && (
                      <span className="text-5xl">{element.content}</span>
                    )}
                  </motion.div>
                ))}

                {/* Template overlay indicator */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="px-3 py-1 rounded-full bg-black/50 text-white text-xs">
                    {selectedTemplate.thumbnail} {selectedTemplate.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Play button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 p-4 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Right Panel - Elements */}
        <div className="w-64 border-l border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Elements
          </h3>

          {elements.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No elements yet</p>
              <p className="text-xs text-slate-400">Add text or stickers</p>
            </div>
          ) : (
            <div className="space-y-2">
              {elements.map(element => (
                <div
                  key={element.id}
                  onClick={() => setSelectedElementId(element.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedElementId === element.id
                      ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-500'
                      : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {element.type === 'text' && <Type className="w-4 h-4 text-slate-400" />}
                      {element.type === 'sticker' && <span className="text-lg">{element.content}</span>}
                      <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                        {element.type === 'text' ? element.content : 'Sticker'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteElement(element.id)
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
