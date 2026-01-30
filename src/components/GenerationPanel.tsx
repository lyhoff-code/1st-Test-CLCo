'use client'

import { motion } from 'framer-motion'
import { FileText, Mic, Video, CheckCircle2, XCircle } from 'lucide-react'
import { GenerationState } from '@/types'

interface GenerationPanelProps {
  state: GenerationState
}

const STEPS = [
  { key: 'generating-script', label: 'Creating Script', Icon: FileText },
  { key: 'generating-audio', label: 'Generating Voice', Icon: Mic },
  { key: 'generating-video', label: 'Composing Video', Icon: Video },
  { key: 'complete', label: 'Complete', Icon: CheckCircle2 },
]

export function GenerationPanel({ state }: GenerationPanelProps) {
  const currentStepIndex = STEPS.findIndex(s => s.key === state.step)

  return (
    <div className="glass p-6">
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/50 rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-databake-turquoise to-databake-pink rounded-full"
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
          const Icon = step.Icon

          return (
            <div
              key={step.key}
              className={`flex flex-col items-center ${
                isPending ? 'opacity-40' : ''
              }`}
            >
              <motion.div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg mb-2 ${
                  isActive
                    ? 'bg-gradient-to-br from-databake-turquoise to-databake-pink text-white shadow-glass glow-turquoise'
                    : isCompleted
                    ? 'bg-databake-turquoise/20 border-2 border-databake-turquoise'
                    : 'bg-white/50'
                }`}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-databake-turquoise-dark" />
                ) : (
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-white' : 'text-databake-text-light'
                  }`} />
                )}
              </motion.div>
              <span className="text-xs text-center text-databake-text-light font-medium">{step.label}</span>
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
          className="text-databake-text-light"
        >
          {state.message}
        </motion.p>
      </div>

      {/* Error State */}
      {state.step === 'error' && (
        <div className="mt-4 p-4 glass-subtle border-2 border-red-300 text-red-600 text-sm flex items-start gap-3 rounded-2xl">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          {state.message}
        </div>
      )}
    </div>
  )
}
