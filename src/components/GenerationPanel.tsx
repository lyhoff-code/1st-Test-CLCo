'use client'

import { motion } from 'framer-motion'
import { GenerationState } from '@/types'

interface GenerationPanelProps {
  state: GenerationState
}

const STEPS = [
  { key: 'generating-script', label: 'Creating Script', icon: '📝' },
  { key: 'generating-audio', label: 'Generating Voice', icon: '🎙️' },
  { key: 'generating-video', label: 'Composing Video', icon: '🎬' },
  { key: 'complete', label: 'Complete', icon: '✅' },
]

export function GenerationPanel({ state }: GenerationPanelProps) {
  const currentStepIndex = STEPS.findIndex(s => s.key === state.step)

  return (
    <div className="card p-6">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-clickboom-turquoise to-clickboom-pink rounded-full"
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
                    ? 'bg-gradient-to-r from-clickboom-turquoise to-clickboom-pink text-white'
                    : isCompleted
                    ? 'bg-clickboom-turquoise/20 border-2 border-clickboom-turquoise'
                    : 'bg-gray-100'
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5 text-clickboom-turquoise" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.icon
                )}
              </motion.div>
              <span className="text-xs text-center text-clickboom-text-light">{step.label}</span>
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
          className="text-clickboom-text-light"
        >
          {state.message}
        </motion.p>
      </div>

      {/* Error State */}
      {state.step === 'error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {state.message}
        </div>
      )}
    </div>
  )
}
