'use client'

import { motion } from 'framer-motion'
import { ContentType, CONTENT_TYPES } from '@/types'

interface ContentTypeSelectorProps {
  selected: ContentType
  onSelect: (type: ContentType) => void
}

export function ContentTypeSelector({ selected, onSelect }: ContentTypeSelectorProps) {
  return (
    <div className="glass-card p-4">
      <div className="grid grid-cols-3 gap-3">
        {CONTENT_TYPES.map((type) => (
          <motion.button
            key={type.value}
            onClick={() => onSelect(type.value)}
            className={`relative p-4 rounded-xl transition-all ${
              selected === type.value
                ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/50'
                : 'bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selected === type.value && (
              <motion.div
                layoutId="content-type-indicator"
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl"
              />
            )}
            <div className="relative z-10">
              <span className="text-2xl block mb-2">{type.icon}</span>
              <span className="font-medium block">{type.label}</span>
              <span className="text-xs text-white/50 mt-1 block">{type.description}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
