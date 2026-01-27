'use client'

import { motion } from 'framer-motion'
import { GenerationState } from '@/types'

interface GenerationPanelProps {
  state: GenerationState
}

const STEPS = [
  { key: 'generating-script', label: 'Generando Script', icon: '📝' },
  { key: 'generating-audio', label: 'Generando Voz', icon: '🎙️' },
  { key: 'generating-video', label: 'Componiendo Video', icon: '🎬' },
  { key: 'complete', label: 'Completado', icon: '✅' },
]

export function GenerationPanel({ state }: GenerationPanelProps) {
  const currentStepIndex = STEPS.findIndex(s => s.key === state.step)

  return (
    <div className="glass-card p-6">
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${state.progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between mb-4">
        {STEPS.map((step, index) => {
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex
          const isPending = index > currentStepIndex

          return (
            <div
              key={step.key}
              className={`flex flex-col items-center ${
                isPending ? 'opacity-40' : ''
              }`}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : isCompleted
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-white/10'
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {isCompleted ? '✓' : step.icon}
              </motion.div>
              <span className="text-xs text-center">{step.label}</span>
            </div>
          )
        })}
      </div>

      {/* Current Status */}
      <div className="text-center">
        <motion.p
          key={state.message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/70"
        >
          {state.message}
        </motion.p>
      </div>

      {/* Error State */}
      {state.step === 'error' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
          {state.message}
        </div>
      )}
    </div>
  )
}
