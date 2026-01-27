'use client'

import { motion } from 'framer-motion'
import { Clapperboard, Smartphone, Image, BookOpen, Check } from 'lucide-react'
import { ContentType, CONTENT_TYPES } from '@/types'

interface ContentTypeSelectorProps {
  selected: ContentType
  onSelect: (type: ContentType) => void
}

const ICONS = {
  Clapperboard,
  Smartphone,
  Image,
  BookOpen,
}

export function ContentTypeSelector({ selected, onSelect }: ContentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CONTENT_TYPES.map((type) => {
        const Icon = ICONS[type.iconName as keyof typeof ICONS]
        const isSelected = selected === type.value
        const isTurquoise = type.color === 'turquoise'
        const isStorytelling = type.value === 'storytelling'

        return (
          <motion.button
            key={type.value}
            onClick={() => onSelect(type.value)}
            className={`relative p-4 sm:p-5 rounded-2xl text-center transition-all ${
              isSelected
                ? isTurquoise
                  ? 'glass-subtle border-2 border-tada-turquoise glow-turquoise'
                  : 'glass-subtle border-2 border-tada-pink glow-pink'
                : 'bg-white/40 border-2 border-transparent hover:bg-white/60 hover:border-white/50'
            } ${isStorytelling ? 'ring-2 ring-tada-pink/20 ring-offset-2 ring-offset-transparent' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isStorytelling && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-tada-turquoise to-tada-pink rounded-full text-[10px] font-bold text-white shadow-glass-sm">
                NEW
              </div>
            )}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl flex items-center justify-center ${
              isSelected
                ? isTurquoise
                  ? 'bg-tada-turquoise/30'
                  : 'bg-tada-pink/30'
                : 'bg-white/50'
            }`}>
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isSelected
                  ? isTurquoise
                    ? 'text-tada-turquoise-dark'
                    : 'text-tada-pink-dark'
                  : 'text-tada-text-light'
              }`} />
            </div>
            <span className="font-semibold block text-tada-text text-sm sm:text-base">
              {type.label}
            </span>
            <span className="text-[10px] sm:text-xs text-tada-text-light mt-1 block leading-tight">
              {type.description}
            </span>
            {isSelected && (
              <motion.div
                layoutId="content-type-indicator"
                className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-glass-sm ${
                  isTurquoise ? 'bg-gradient-to-br from-tada-turquoise to-tada-turquoise-dark' : 'bg-gradient-to-br from-tada-pink to-tada-pink-dark'
                }`}
                initial={false}
              >
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
