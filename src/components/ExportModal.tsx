'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Download,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Video,
  Image,
  FileText,
} from 'lucide-react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  scenes: {
    text: string
    imageUrl?: string
    audioUrl?: string
    duration: number
  }[]
}

export function ExportModal({ isOpen, onClose, title, scenes }: ExportModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<'capcut' | 'canva' | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<{
    success: boolean
    editUrl?: string
    error?: string
  } | null>(null)

  const handleExport = async () => {
    if (!selectedPlatform) return

    setIsExporting(true)
    setExportResult(null)

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          title,
          scenes,
          format: 'video',
        }),
      })

      const data = await response.json()
      setExportResult({
        success: data.success,
        editUrl: data.editUrl,
        error: data.error,
      })
    } catch (error) {
      setExportResult({
        success: false,
        error: 'Failed to export. Please try again.',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleClose = () => {
    setSelectedPlatform(null)
    setExportResult(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass dark:bg-gray-800/90 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-tada-text dark:text-gray-100">
                  Export Content
                </h2>
                <p className="text-sm text-tada-text-light dark:text-gray-400">
                  Choose a platform to edit your video
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-tada-text-light" />
              </button>
            </div>

            {/* Export Result */}
            {exportResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-2xl ${
                  exportResult.success
                    ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/30'
                    : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {exportResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      exportResult.success
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {exportResult.success ? 'Export successful!' : 'Export failed'}
                    </p>
                    {exportResult.error && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {exportResult.error}
                      </p>
                    )}
                  </div>
                  {exportResult.success && exportResult.editUrl && (
                    <a
                      href={exportResult.editUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-sm font-medium text-tada-text dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Open Editor
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Platform Selection */}
            <div className="space-y-4 mb-6">
              {/* CapCut */}
              <button
                onClick={() => setSelectedPlatform('capcut')}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  selectedPlatform === 'capcut'
                    ? 'border-tada-turquoise bg-tada-turquoise/10 dark:bg-tada-turquoise/5'
                    : 'border-white/30 dark:border-gray-700/30 hover:border-tada-turquoise/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                    <span className="text-white font-bold">CC</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-tada-text dark:text-gray-100">CapCut</p>
                    <p className="text-sm text-tada-text-light dark:text-gray-400">
                      Professional video editing with templates
                    </p>
                  </div>
                  {selectedPlatform === 'capcut' && (
                    <CheckCircle2 className="w-6 h-6 text-tada-turquoise" />
                  )}
                </div>
              </button>

              {/* Canva */}
              <button
                onClick={() => setSelectedPlatform('canva')}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  selectedPlatform === 'canva'
                    ? 'border-tada-pink bg-tada-pink/10 dark:bg-tada-pink/5'
                    : 'border-white/30 dark:border-gray-700/30 hover:border-tada-pink/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-tada-text dark:text-gray-100">Canva</p>
                    <p className="text-sm text-tada-text-light dark:text-gray-400">
                      Design customization and visual editing
                    </p>
                  </div>
                  {selectedPlatform === 'canva' && (
                    <CheckCircle2 className="w-6 h-6 text-tada-pink" />
                  )}
                </div>
              </button>
            </div>

            {/* Content Summary */}
            <div className="mb-6 p-4 rounded-2xl bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30">
              <p className="text-sm font-medium text-tada-text dark:text-gray-200 mb-2">
                Content to export:
              </p>
              <div className="flex items-center gap-4 text-sm text-tada-text-light dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {scenes.length} scenes
                </span>
                <span className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  {scenes.reduce((acc, s) => acc + s.duration, 0)}s total
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={!selectedPlatform || isExporting}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Export
                  </>
                )}
              </button>
            </div>

            {/* Note */}
            <p className="mt-4 text-center text-xs text-tada-text-light dark:text-gray-500">
              Demo mode: Configure API keys in Settings for full functionality
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
