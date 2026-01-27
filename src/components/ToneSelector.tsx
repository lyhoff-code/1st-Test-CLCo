'use client'

import { motion } from 'framer-motion'
import { ToneType, TONE_TYPES } from '@/types'

interface ToneSelectorProps {
  selected: ToneType
  onSelect: (tone: ToneType) => void
}

export function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  return (
    <div className="glass-card p-4">
      <div className="grid grid-cols-3 gap-3">
        {TONE_TYPES.map((tone) => (
          <motion.button
            key={tone.value}
            onClick={() => onSelect(tone.value)}
            className={`relative p-4 rounded-xl transition-all ${
              selected === tone.value
                ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/50'
                : 'bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {selected === tone.value && (
              <motion.div
                layoutId="tone-indicator"
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl"
              />
            )}
            <div className="relative z-10">
              <span className="text-2xl block mb-2">{tone.icon}</span>
              <span className="font-medium block">{tone.label}</span>
              <span className="text-xs text-white/50 mt-1 block">{tone.description}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
