'use client'

import { motion } from 'framer-motion'
import { Clock, X, Archive } from 'lucide-react'
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
      className="border-b border-white/20 glass-subtle"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-tada-text flex items-center gap-2">
            <span className="icon-turquoise">
              <Clock className="w-5 h-5" />
            </span>
            Recent Content
          </h3>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="text-sm text-tada-text-light hover:text-tada-pink transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-tada-text-light" />
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-tada-text-light">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/30 flex items-center justify-center">
              <Archive className="w-7 h-7 opacity-50" />
            </div>
            <p className="font-medium">No content generated yet</p>
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
                className="flex-shrink-0 w-64 glass-subtle p-3 text-left hover:bg-white/60 transition-colors border-2 border-transparent hover:border-tada-turquoise/30"
              >
                <div className="flex gap-3">
                  {item.product.images.edges[0]?.node.url && (
                    <img
                      src={item.product.images.edges[0].node.url}
                      alt={item.product.title}
                      className="w-12 h-12 rounded-xl object-cover shadow-glass-sm"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-tada-text truncate text-sm">
                      {item.product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="pill-turquoise">
                        {item.contentType}
                      </span>
                      <span className="pill-pink">
                        {getToneLabel(item.tone)}
                      </span>
                    </div>
                    <p className="text-xs text-tada-text-light mt-1">
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
