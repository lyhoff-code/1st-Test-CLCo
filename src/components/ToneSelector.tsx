'use client'

import { motion } from 'framer-motion'
import { Smile, Briefcase, GraduationCap, Heart, Zap, Check } from 'lucide-react'
import { ToneType, TONE_TYPES } from '@/types'

interface ToneSelectorProps {
  selected: ToneType
  onSelect: (tone: ToneType) => void
}

const ICONS = {
  Smile,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
}

export function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {TONE_TYPES.map((tone) => {
        const Icon = ICONS[tone.iconName as keyof typeof ICONS]
        const isSelected = selected === tone.value
        const isTurquoise = tone.color === 'turquoise'

        return (
          <motion.button
            key={tone.value}
            onClick={() => onSelect(tone.value)}
            className={`relative p-3 sm:p-4 rounded-2xl text-center transition-all ${
              isSelected
                ? isTurquoise
                  ? 'glass-subtle border-2 border-tada-turquoise glow-turquoise'
                  : 'glass-subtle border-2 border-tada-pink glow-pink'
                : 'bg-white/40 dark:bg-gray-800/40 border-2 border-transparent hover:bg-white/60 dark:hover:bg-gray-700/60 hover:border-white/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${
              isSelected
                ? isTurquoise
                  ? 'bg-tada-turquoise/30'
                  : 'bg-tada-pink/30'
                : 'bg-white/50 dark:bg-gray-700/50'
            }`}>
              <Icon className={`w-5 h-5 ${
                isSelected
                  ? isTurquoise
                    ? 'text-tada-turquoise-dark'
                    : 'text-tada-pink-dark'
                  : 'text-tada-text-light dark:text-gray-400'
              }`} />
            </div>
            <span className="font-bold block text-slate-800 dark:text-white text-sm">
              {tone.label}
            </span>
            <span className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5 block leading-tight font-medium">
              {tone.description}
            </span>
            {isSelected && (
              <motion.div
                layoutId="tone-indicator"
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
