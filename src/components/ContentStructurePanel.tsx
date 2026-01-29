'use client'

import { motion } from 'framer-motion'
import {
  Layers,
  Clock,
  Target,
  Clapperboard,
  Smartphone,
  Image,
  BookOpen,
  ChevronRight
} from 'lucide-react'
import { ContentType, CONTENT_TYPES } from '@/types'

interface ContentStructurePanelProps {
  contentType: ContentType
  currentScene?: number
  isGenerating?: boolean
}

const ICONS = {
  Clapperboard,
  Smartphone,
  Image,
  BookOpen,
}

export function ContentStructurePanel({
  contentType,
  currentScene = -1,
  isGenerating = false
}: ContentStructurePanelProps) {
  const config = CONTENT_TYPES.find(t => t.value === contentType)

  if (!config) return null

  const Icon = ICONS[config.iconName as keyof typeof ICONS]
  const isTurquoise = config.color === 'turquoise'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-subtle p-4 rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isTurquoise
            ? 'bg-tada-turquoise/20'
            : 'bg-tada-pink/20'
        }`}>
          <Icon className={`w-5 h-5 ${
            isTurquoise ? 'text-tada-turquoise-dark' : 'text-tada-pink-dark'
          }`} />
        </div>
        <div>
          <h4 className="font-semibold text-tada-text dark:text-gray-100 text-sm">
            {config.label} Structure
          </h4>
          <p className="text-xs text-tada-text-light dark:text-gray-400">
            {config.scenes.length} scenes
          </p>
        </div>
      </div>

      {/* Scene Timeline */}
      <div className="space-y-2">
        {config.scenes.map((scene, index) => {
          const isActive = currentScene === index
          const isPast = currentScene > index

          return (
            <motion.div
              key={scene.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive
                  ? isTurquoise
                    ? 'bg-tada-turquoise/20 border border-tada-turquoise/30'
                    : 'bg-tada-pink/20 border border-tada-pink/30'
                  : isPast
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/30'
                    : 'bg-white/30 dark:bg-gray-800/30 border border-transparent'
              }`}
            >
              {/* Scene Number */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                isActive
                  ? isTurquoise
                    ? 'bg-tada-turquoise text-white'
                    : 'bg-tada-pink text-white'
                  : isPast
                    ? 'bg-green-500 text-white'
                    : 'bg-white/50 dark:bg-gray-700/50 text-tada-text-light dark:text-gray-400'
              }`}>
                {isPast ? '✓' : index + 1}
              </div>

              {/* Scene Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${
                    isActive
                      ? 'text-tada-text dark:text-gray-100'
                      : 'text-tada-text dark:text-gray-200'
                  }`}>
                    {scene.name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? isTurquoise
                        ? 'bg-tada-turquoise/30 text-tada-turquoise-dark'
                        : 'bg-tada-pink/30 text-tada-pink-dark'
                      : 'bg-white/50 dark:bg-gray-700/50 text-tada-text-light dark:text-gray-400'
                  }`}>
                    {scene.time}
                  </span>
                </div>
                <p className="text-[11px] text-tada-text-light dark:text-gray-400 truncate">
                  {scene.purpose}
                </p>
              </div>

              {/* Active Indicator */}
              {isActive && isGenerating && (
                <div className="w-2 h-2 rounded-full bg-tada-turquoise animate-pulse" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Progress Bar */}
      {currentScene >= 0 && (
        <div className="mt-4 pt-4 border-t border-white/20 dark:border-gray-700/30">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-tada-text-light dark:text-gray-400">Progress</span>
            <span className={`font-medium ${
              isTurquoise ? 'text-tada-turquoise-dark' : 'text-tada-pink-dark'
            }`}>
              {Math.round(((currentScene + 1) / config.scenes.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentScene + 1) / config.scenes.length) * 100}%` }}
              className={`h-full rounded-full ${
                isTurquoise
                  ? 'bg-gradient-to-r from-tada-turquoise to-tada-turquoise-dark'
                  : 'bg-gradient-to-r from-tada-pink to-tada-pink-dark'
              }`}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Compact version for inline display
export function ContentStructureBadges({ contentType }: { contentType: ContentType }) {
  const config = CONTENT_TYPES.find(t => t.value === contentType)

  if (!config) return null

  const isTurquoise = config.color === 'turquoise'

  return (
    <div className="flex flex-wrap gap-1.5">
      {config.scenes.map((scene, index) => (
        <motion.div
          key={scene.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium ${
            isTurquoise
              ? 'bg-tada-turquoise/10 text-tada-turquoise-dark border border-tada-turquoise/20'
              : 'bg-tada-pink/10 text-tada-pink-dark border border-tada-pink/20'
          }`}
        >
          <span className="opacity-60">{index + 1}.</span>
          <span>{scene.name}</span>
          {index < config.scenes.length - 1 && (
            <ChevronRight className="w-2.5 h-2.5 opacity-40" />
          )}
        </motion.div>
      ))}
    </div>
  )
}
