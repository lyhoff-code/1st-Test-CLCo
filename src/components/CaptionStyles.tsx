'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Sparkles,
  Check,
  Play,
  ChevronDown,
  Zap,
  MessageSquare
} from 'lucide-react'

export interface CaptionStyle {
  id: string
  name: string
  fontFamily: string
  fontSize: 'small' | 'medium' | 'large' | 'xlarge'
  fontWeight: 'normal' | 'bold' | 'extrabold'
  textColor: string
  backgroundColor: string
  highlightColor: string
  position: 'top' | 'center' | 'bottom'
  alignment: 'left' | 'center' | 'right'
  animation: 'none' | 'fade' | 'pop' | 'typewriter' | 'bounce' | 'glow' | 'karaoke'
  outline: boolean
  shadow: boolean
  emoji: boolean
  style: 'minimal' | 'bold' | 'neon' | 'gradient' | 'boxed' | 'handwritten'
}

const PRESET_STYLES: CaptionStyle[] = [
  {
    id: 'tiktok-viral',
    name: 'TikTok Viral',
    fontFamily: 'Inter',
    fontSize: 'large',
    fontWeight: 'extrabold',
    textColor: '#FFFFFF',
    backgroundColor: 'transparent',
    highlightColor: '#00F5D4',
    position: 'center',
    alignment: 'center',
    animation: 'karaoke',
    outline: true,
    shadow: true,
    emoji: true,
    style: 'bold'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    fontFamily: 'SF Pro',
    fontSize: 'medium',
    fontWeight: 'normal',
    textColor: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.5)',
    highlightColor: '#FFFFFF',
    position: 'bottom',
    alignment: 'center',
    animation: 'fade',
    outline: false,
    shadow: false,
    emoji: false,
    style: 'minimal'
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    fontFamily: 'Poppins',
    fontSize: 'large',
    fontWeight: 'bold',
    textColor: '#FF00FF',
    backgroundColor: 'transparent',
    highlightColor: '#00FFFF',
    position: 'center',
    alignment: 'center',
    animation: 'glow',
    outline: true,
    shadow: true,
    emoji: true,
    style: 'neon'
  },
  {
    id: 'gradient-pop',
    name: 'Gradient Pop',
    fontFamily: 'Montserrat',
    fontSize: 'xlarge',
    fontWeight: 'extrabold',
    textColor: '#FFFFFF',
    backgroundColor: 'transparent',
    highlightColor: '#F9B4C4',
    position: 'center',
    alignment: 'center',
    animation: 'pop',
    outline: true,
    shadow: true,
    emoji: true,
    style: 'gradient'
  },
  {
    id: 'boxed-modern',
    name: 'Boxed Modern',
    fontFamily: 'Roboto',
    fontSize: 'medium',
    fontWeight: 'bold',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    highlightColor: '#FFD700',
    position: 'bottom',
    alignment: 'center',
    animation: 'bounce',
    outline: false,
    shadow: true,
    emoji: false,
    style: 'boxed'
  },
  {
    id: 'handwritten',
    name: 'Handwritten',
    fontFamily: 'Caveat',
    fontSize: 'xlarge',
    fontWeight: 'normal',
    textColor: '#FFFFFF',
    backgroundColor: 'transparent',
    highlightColor: '#FFB6C1',
    position: 'center',
    alignment: 'center',
    animation: 'typewriter',
    outline: true,
    shadow: true,
    emoji: true,
    style: 'handwritten'
  }
]

const COLORS = [
  '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FF6B6B', '#4ECDC4',
  '#A8E6E1', '#F9B4C4', '#FFD700', '#9B59B6', '#E74C3C'
]

interface CaptionStylesProps {
  selectedStyle: CaptionStyle | null
  onSelectStyle: (style: CaptionStyle) => void
  compact?: boolean
}

export function CaptionStyles({ selectedStyle, onSelectStyle, compact = false }: CaptionStylesProps) {
  const [customizing, setCustomizing] = useState(false)
  const [customStyle, setCustomStyle] = useState<CaptionStyle>(PRESET_STYLES[0])
  const [previewText, setPreviewText] = useState("This is how your captions will look!")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateCustomStyle = (updates: Partial<CaptionStyle>) => {
    const newStyle = { ...customStyle, ...updates, id: 'custom', name: 'Custom Style' }
    setCustomStyle(newStyle)
  }

  const getPreviewStyle = (style: CaptionStyle): React.CSSProperties => {
    const fontSizes = { small: '14px', medium: '18px', large: '24px', xlarge: '32px' }
    const fontWeights = { normal: 400, bold: 700, extrabold: 800 }

    return {
      fontFamily: style.fontFamily,
      fontSize: fontSizes[style.fontSize],
      fontWeight: fontWeights[style.fontWeight],
      color: style.textColor,
      backgroundColor: style.backgroundColor,
      textAlign: style.alignment,
      textShadow: style.shadow ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
      WebkitTextStroke: style.outline ? '1px black' : 'none',
      padding: style.style === 'boxed' ? '8px 16px' : '4px',
      borderRadius: style.style === 'boxed' ? '8px' : '0',
      display: 'inline-block'
    }
  }

  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case 'pop': return 'animate-bounce'
      case 'glow': return 'animate-pulse'
      default: return ''
    }
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Caption Style</p>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_STYLES.slice(0, 6).map(style => (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style)}
              className={`p-2 rounded-xl text-center transition-all ${
                selectedStyle?.id === style.id
                  ? 'bg-databake-turquoise/20 border-2 border-databake-turquoise'
                  : 'bg-white/50 dark:bg-slate-800/50 border-2 border-transparent hover:bg-white/70'
              }`}
            >
              <div
                className="text-xs font-bold truncate mb-1"
                style={{ color: style.textColor === '#FFFFFF' ? '#333' : style.textColor }}
              >
                Aa
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{style.name}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Type className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Caption Styles</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Animated word-by-word captions</p>
          </div>
        </div>
        <button
          onClick={() => setCustomizing(!customizing)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            customizing
              ? 'bg-databake-turquoise text-databake-text'
              : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-1" />
          {customizing ? 'Use Presets' : 'Customize'}
        </button>
      </div>

      {/* Preview */}
      <div className="relative h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          key={customizing ? customStyle.id : selectedStyle?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative z-10 ${getAnimationClass(customizing ? customStyle.animation : selectedStyle?.animation || '')}`}
        >
          <span style={getPreviewStyle(customizing ? customStyle : selectedStyle || PRESET_STYLES[0])}>
            {previewText.split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  backgroundColor: i === 2 ? (customizing ? customStyle.highlightColor : selectedStyle?.highlightColor) : 'transparent',
                  color: i === 2 ? '#000' : undefined,
                  padding: i === 2 ? '2px 4px' : undefined,
                  borderRadius: i === 2 ? '4px' : undefined
                }}
              >
                {word}{' '}
              </motion.span>
            ))}
          </span>
        </motion.div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
          <Play className="w-3 h-3" /> Preview
        </div>
      </div>

      {/* Preset Styles */}
      {!customizing && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PRESET_STYLES.map(style => (
            <motion.button
              key={style.id}
              onClick={() => onSelectStyle(style)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-2xl text-left transition-all ${
                selectedStyle?.id === style.id
                  ? 'bg-databake-turquoise/20 border-2 border-databake-turquoise'
                  : 'bg-white/50 dark:bg-slate-800/50 border-2 border-transparent hover:bg-white/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-lg font-bold"
                  style={{
                    color: style.textColor === '#FFFFFF' ? '#333' : style.textColor,
                    textShadow: style.shadow ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  Aa
                </span>
                {selectedStyle?.id === style.id && (
                  <div className="w-5 h-5 rounded-full bg-databake-turquoise flex items-center justify-center">
                    <Check className="w-3 h-3 text-databake-text" />
                  </div>
                )}
              </div>
              <p className="font-medium text-sm text-slate-800 dark:text-white">{style.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{style.animation}</span>
                {style.emoji && <span className="text-xs">✨</span>}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Customizer */}
      {customizing && (
        <div className="space-y-4 p-4 rounded-2xl bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30">
          {/* Font Size */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">Font Size</label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large', 'xlarge'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => updateCustomStyle({ fontSize: size })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    customStyle.fontSize === size
                      ? 'bg-databake-turquoise text-databake-text'
                      : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Animation */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">Animation</label>
            <div className="flex flex-wrap gap-2">
              {(['none', 'fade', 'pop', 'typewriter', 'bounce', 'glow', 'karaoke'] as const).map(anim => (
                <button
                  key={anim}
                  onClick={() => updateCustomStyle({ animation: anim })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    customStyle.animation === anim
                      ? 'bg-databake-pink text-white'
                      : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {anim === 'karaoke' && <Zap className="w-3 h-3 inline mr-1" />}
                  {anim.charAt(0).toUpperCase() + anim.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">Text Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => updateCustomStyle({ textColor: color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    customStyle.textColor === color
                      ? 'border-databake-turquoise scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Highlight Color */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">Highlight Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => updateCustomStyle({ highlightColor: color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    customStyle.highlightColor === color
                      ? 'border-databake-turquoise scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">Position</label>
            <div className="flex gap-2">
              {(['top', 'center', 'bottom'] as const).map(pos => (
                <button
                  key={pos}
                  onClick={() => updateCustomStyle({ position: pos })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    customStyle.position === pos
                      ? 'bg-databake-turquoise text-databake-text'
                      : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Alignment */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">Alignment</label>
            <div className="flex gap-2">
              {[
                { value: 'left', icon: AlignLeft },
                { value: 'center', icon: AlignCenter },
                { value: 'right', icon: AlignRight }
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => updateCustomStyle({ alignment: value as 'left' | 'center' | 'right' })}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${
                    customStyle.alignment === value
                      ? 'bg-databake-turquoise text-databake-text'
                      : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            {[
              { key: 'outline', label: 'Outline' },
              { key: 'shadow', label: 'Shadow' },
              { key: 'emoji', label: 'Emoji' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customStyle[key as keyof CaptionStyle] as boolean}
                  onChange={(e) => updateCustomStyle({ [key]: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-databake-turquoise focus:ring-databake-turquoise"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
              </label>
            ))}
          </div>

          {/* Apply Custom Style */}
          <button
            onClick={() => onSelectStyle(customStyle)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-databake-turquoise to-databake-turquoise-dark text-databake-text font-semibold hover:shadow-lg transition-all"
          >
            Apply Custom Style
          </button>
        </div>
      )}
    </div>
  )
}
