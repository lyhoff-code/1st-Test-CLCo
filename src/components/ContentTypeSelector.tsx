'use client'

import { motion } from 'framer-motion'
import { Clapperboard, Smartphone, Image, Check } from 'lucide-react'
import { ContentType, CONTENT_TYPES } from '@/types'

interface ContentTypeSelectorProps {
  selected: ContentType
  onSelect: (type: ContentType) => void
}

const ICONS = {
  Clapperboard,
  Smartphone,
  Image,
}

export function ContentTypeSelector({ selected, onSelect }: ContentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {CONTENT_TYPES.map((type) => {
        const Icon = ICONS[type.iconName as keyof typeof ICONS]
        const isSelected = selected === type.value
        const isTurquoise = type.color === 'turquoise'

        return (
          <motion.button
            key={type.value}
            onClick={() => onSelect(type.value)}
            className={`relative p-5 rounded-2xl text-center transition-all ${
              isSelected
                ? isTurquoise
                  ? 'glass-subtle border-2 border-tada-turquoise glow-turquoise'
                  : 'glass-subtle border-2 border-tada-pink glow-pink'
                : 'bg-white/40 border-2 border-transparent hover:bg-white/60 hover:border-white/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
              isSelected
                ? isTurquoise
                  ? 'bg-tada-turquoise/30'
                  : 'bg-tada-pink/30'
                : 'bg-white/50'
            }`}>
              <Icon className={`w-6 h-6 ${
                isSelected
                  ? isTurquoise
                    ? 'text-tada-turquoise-dark'
                    : 'text-tada-pink-dark'
                  : 'text-tada-text-light'
              }`} />
            </div>
            <span className="font-semibold block text-tada-text">
              {type.label}
            </span>
            <span className="text-xs text-tada-text-light mt-1 block">
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
