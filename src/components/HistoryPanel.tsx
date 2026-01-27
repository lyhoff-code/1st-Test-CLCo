'use client'

import { motion } from 'framer-motion'
import { HistoryItem } from '@/types'

interface HistoryPanelProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onClose: () => void
  onClear: () => void
}

export function HistoryPanel({ history, onSelect, onClose, onClear }: HistoryPanelProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      divertido: 'Fun',
      profesional: 'Professional',
      educativo: 'Educational'
    }
    return labels[tone] || tone
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="border-b border-gray-100 bg-white shadow-soft"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-clickboom-text flex items-center gap-2">
            <svg className="w-5 h-5 text-clickboom-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Content
          </h3>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="text-sm text-clickboom-text-light hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-clickboom-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-clickboom-text-light">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>No content generated yet</p>
            <p className="text-sm">Your generated content will appear here</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {history.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(item)}
                className="flex-shrink-0 w-64 bg-clickboom-background rounded-xl p-3 text-left hover:bg-clickboom-turquoise/10 transition-colors border border-gray-100 hover:border-clickboom-turquoise/30"
              >
                <div className="flex gap-3">
                  {item.product.images.edges[0]?.node.url && (
                    <img
                      src={item.product.images.edges[0].node.url}
                      alt={item.product.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-clickboom-text truncate text-sm">
                      {item.product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-clickboom-turquoise/20 text-clickboom-text rounded-full">
                        {item.contentType}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-clickboom-pink/20 text-clickboom-text rounded-full">
                        {getToneLabel(item.tone)}
                      </span>
                    </div>
                    <p className="text-xs text-clickboom-text-light mt-1">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
