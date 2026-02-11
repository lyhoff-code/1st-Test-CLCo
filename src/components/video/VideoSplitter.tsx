'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scissors,
  Upload,
  Download,
  Play,
  Pause,
  Check,
  X,
  Film,
  Clock,
} from 'lucide-react'
import { VideoSplitResult } from '@/types/pipeline'

// ============================================
// TYPES
// ============================================

interface VideoSplitterProps {
  onPartsSelected?: (parts: VideoSplitResult[]) => void
  standalone?: boolean
}

type SplitterStep = 'upload' | 'configure' | 'processing' | 'results'

// ============================================
// HELPERS
// ============================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = (seconds % 60).toFixed(2)
  if (mins > 0) {
    return `${mins}m ${parseFloat(secs).toFixed(2)}s`
  }
  return `${secs}s`
}

const PART_COLORS = [
  'from-[#A8E6E1] to-[#7DD3CC]',
  'from-[#F9B4C4] to-[#F28DA6]',
  'from-[#B4A8E6] to-[#9A8DD3]',
  'from-[#E6D4A8] to-[#D3C18D]',
  'from-[#A8D4E6] to-[#8DC1D3]',
  'from-[#E6A8C4] to-[#D38DA6]',
  'from-[#C4E6A8] to-[#A6D38D]',
  'from-[#E6A8A8] to-[#D38D8D]',
]

const PART_SOLID_COLORS = [
  '#A8E6E1',
  '#F9B4C4',
  '#B4A8E6',
  '#E6D4A8',
  '#A8D4E6',
  '#E6A8C4',
  '#C4E6A8',
  '#E6A8A8',
]

// ============================================
// COMPONENT
// ============================================

export function VideoSplitter({ onPartsSelected, standalone = false }: VideoSplitterProps) {
  // Step state
  const [step, setStep] = useState<SplitterStep>('upload')

  // Upload state
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Configuration state
  const [partsCount, setPartsCount] = useState<number>(2)
  const [customPartsInput, setCustomPartsInput] = useState<string>('')
  const [isCustomMode, setIsCustomMode] = useState(false)

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Results state
  const [splitResults, setSplitResults] = useState<VideoSplitResult[]>([])

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl)
      }
    }
  }, [videoPreviewUrl])

  // ============================================
  // FILE HANDLING
  // ============================================

  const handleFileSelect = useCallback((file: File) => {
    setError(null)

    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      setError('Please select a valid video file (.mp4, .mov, or .webm)')
      return
    }

    if (file.size > 2 * 1024 * 1024 * 1024) {
      setError('Video file must be less than 2GB')
      return
    }

    // Revoke previous URL if any
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl)
    }

    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoPreviewUrl(url)
  }, [videoPreviewUrl])

  const handleVideoMetadataLoaded = useCallback(() => {
    if (videoRef.current) {
      const duration = videoRef.current.duration
      setVideoDuration(duration)
      setStep('configure')
    }
  }, [])

  const toggleVideoPlayback = useCallback(() => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    } else {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }, [])

  // ============================================
  // DRAG & DROP
  // ============================================

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  // ============================================
  // PARTS COUNT SELECTION
  // ============================================

  const selectPresetParts = useCallback((count: number) => {
    setPartsCount(count)
    setIsCustomMode(false)
    setCustomPartsInput('')
  }, [])

  const handleCustomPartsChange = useCallback((value: string) => {
    setCustomPartsInput(value)
    const parsed = parseInt(value, 10)
    if (!isNaN(parsed) && parsed >= 2 && parsed <= 20) {
      setPartsCount(parsed)
    }
  }, [])

  const activateCustomMode = useCallback(() => {
    setIsCustomMode(true)
    setCustomPartsInput(String(partsCount))
  }, [partsCount])

  // ============================================
  // SPLIT VIDEO (API CALL)
  // ============================================

  const handleSplitVideo = useCallback(async () => {
    if (!videoFile) {
      setError('No video file selected')
      return
    }

    if (partsCount < 2 || partsCount > 20) {
      setError('Number of parts must be between 2 and 20')
      return
    }

    setError(null)
    setIsProcessing(true)
    setStep('processing')

    try {
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('parts', String(partsCount))

      const response = await fetch('/api/video/split', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || `Server error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.parts || !Array.isArray(data.parts)) {
        throw new Error('Invalid response from server')
      }

      const results: VideoSplitResult[] = data.parts.map((part: VideoSplitResult, index: number) => ({
        index: part.index ?? index,
        fileName: part.fileName,
        startTime: part.startTime,
        endTime: part.endTime,
        duration: part.duration,
        url: part.url,
        selected: true,
      }))

      setSplitResults(results)
      setStep('results')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to split video. Please try again.'
      setError(message)
      setStep('configure')
    } finally {
      setIsProcessing(false)
    }
  }, [videoFile, partsCount])

  // ============================================
  // RESULTS ACTIONS
  // ============================================

  const togglePartSelection = useCallback((index: number) => {
    setSplitResults(prev =>
      prev.map(part =>
        part.index === index ? { ...part, selected: !part.selected } : part
      )
    )
  }, [])

  const handleDownloadPart = useCallback((part: VideoSplitResult) => {
    const link = document.createElement('a')
    link.href = part.url
    link.download = part.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const handleDownloadSelected = useCallback(() => {
    const selected = splitResults.filter(p => p.selected)
    selected.forEach((part, i) => {
      setTimeout(() => {
        handleDownloadPart(part)
      }, i * 500)
    })
  }, [splitResults, handleDownloadPart])

  const handleUseInPipeline = useCallback(() => {
    const selected = splitResults.filter(p => p.selected)
    onPartsSelected?.(selected)
  }, [splitResults, onPartsSelected])

  const handleReset = useCallback(() => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl)
    }
    setStep('upload')
    setVideoFile(null)
    setVideoPreviewUrl(null)
    setVideoDuration(0)
    setIsVideoPlaying(false)
    setPartsCount(2)
    setCustomPartsInput('')
    setIsCustomMode(false)
    setIsProcessing(false)
    setError(null)
    setSplitResults([])
  }, [videoPreviewUrl])

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const selectedCount = splitResults.filter(p => p.selected).length
  const totalDuration = videoDuration

  // ============================================
  // RENDER
  // ============================================

  const containerClasses = standalone
    ? 'min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 md:p-10'
    : ''

  return (
    <div className={containerClasses}>
      <div className={standalone ? 'max-w-3xl mx-auto' : ''}>
        {/* Header */}
        {standalone && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A8E6E1] to-[#F9B4C4] flex items-center justify-center shadow-lg">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Video Splitter
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Split your video into multiple parts with precision. Upload, choose how many parts, and download.
            </p>
          </motion.div>
        )}

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/20 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden"
        >
          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-red-200 dark:border-red-800/50"
              >
                <div className="flex items-center gap-3 px-6 py-4 bg-red-50 dark:bg-red-900/20">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 flex-1">
                    {error}
                  </p>
                  <button
                    onClick={() => setError(null)}
                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* ============================================ */}
              {/* STEP 1: UPLOAD                               */}
              {/* ============================================ */}
              {step === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Drag & Drop Area */}
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative p-10 md:p-14 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
                      isDragging
                        ? 'border-[#A8E6E1] bg-[#A8E6E1]/10 dark:bg-[#A8E6E1]/5 scale-[1.02]'
                        : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 hover:border-[#A8E6E1] hover:bg-[#A8E6E1]/5 dark:hover:bg-[#A8E6E1]/5'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-5">
                      <motion.div
                        animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                          isDragging
                            ? 'bg-gradient-to-br from-[#A8E6E1] to-[#7DD3CC] text-white shadow-lg shadow-[#A8E6E1]/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:bg-gradient-to-br group-hover:from-[#A8E6E1]/60 group-hover:to-[#A8E6E1]/40 group-hover:text-white'
                        }`}
                      >
                        {isDragging ? (
                          <Film className="w-10 h-10" />
                        ) : (
                          <Upload className="w-10 h-10" />
                        )}
                      </motion.div>

                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-800 dark:text-white">
                          {isDragging ? 'Drop your video here' : 'Drag & drop your video'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          or click to browse files
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <Film className="w-3.5 h-3.5" />
                        <span>MP4, MOV, WebM</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span>Max 2GB</span>
                      </div>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                      e.target.value = ''
                    }}
                    className="hidden"
                  />

                  {/* Video Preview after file selected (loading metadata) */}
                  {videoPreviewUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* File info */}
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A8E6E1] to-[#7DD3CC] flex items-center justify-center">
                          <Film className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                            {videoFile?.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {videoFile ? formatFileSize(videoFile.size) : ''}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReset()
                          }}
                          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>

                      {/* Video player */}
                      <div className="relative rounded-xl overflow-hidden bg-black group/video">
                        <video
                          ref={videoRef}
                          src={videoPreviewUrl}
                          onLoadedMetadata={handleVideoMetadataLoaded}
                          onPlay={() => setIsVideoPlaying(true)}
                          onPause={() => setIsVideoPlaying(false)}
                          onEnded={() => setIsVideoPlaying(false)}
                          className="w-full max-h-72 object-contain"
                          preload="metadata"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleVideoPlayback()
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/video:bg-black/20 transition-colors"
                        >
                          <div className="w-14 h-14 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity shadow-lg">
                            {isVideoPlaying ? (
                              <Pause className="w-6 h-6 text-slate-800 dark:text-white" />
                            ) : (
                              <Play className="w-6 h-6 text-slate-800 dark:text-white ml-1" />
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Loading indicator while waiting for metadata */}
                      {videoDuration === 0 && (
                        <div className="flex items-center justify-center gap-2 py-3 text-sm text-slate-500 dark:text-slate-400">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-[#A8E6E1] border-t-transparent rounded-full"
                          />
                          <span>Loading video metadata...</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ============================================ */}
              {/* STEP 2: CONFIGURE                            */}
              {/* ============================================ */}
              {step === 'configure' && (
                <motion.div
                  key="configure"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Video info bar */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#A8E6E1]/10 to-[#F9B4C4]/10 dark:from-[#A8E6E1]/5 dark:to-[#F9B4C4]/5 border border-[#A8E6E1]/20 dark:border-[#A8E6E1]/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A8E6E1] to-[#7DD3CC] flex items-center justify-center shrink-0">
                      <Film className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                        {videoFile?.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(videoDuration)}
                        </span>
                        <span>{videoFile ? formatFileSize(videoFile.size) : ''}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Video preview (small) */}
                  {videoPreviewUrl && (
                    <div className="relative rounded-xl overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        src={videoPreviewUrl}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                        onEnded={() => setIsVideoPlaying(false)}
                        controls
                        className="w-full max-h-48 object-contain"
                      />
                    </div>
                  )}

                  {/* Split controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 block">
                        How many parts?
                      </label>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Preset buttons */}
                        {[2, 3, 4].map(count => (
                          <button
                            key={count}
                            onClick={() => selectPresetParts(count)}
                            className={`w-14 h-14 rounded-xl text-lg font-bold transition-all duration-200 ${
                              partsCount === count && !isCustomMode
                                ? 'bg-gradient-to-br from-[#A8E6E1] to-[#7DD3CC] text-white shadow-lg shadow-[#A8E6E1]/30 scale-105'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                            }`}
                          >
                            {count}
                          </button>
                        ))}

                        {/* Custom input */}
                        <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                          {isCustomMode ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="number"
                                min={2}
                                max={20}
                                value={customPartsInput}
                                onChange={(e) => handleCustomPartsChange(e.target.value)}
                                placeholder="2-20"
                                autoFocus
                                className="w-20 h-14 rounded-xl bg-white dark:bg-slate-700 border-2 border-[#A8E6E1] text-center text-lg font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A8E6E1]/50"
                              />
                              <button
                                onClick={() => {
                                  if (customPartsInput) {
                                    const parsed = parseInt(customPartsInput, 10)
                                    if (parsed >= 2 && parsed <= 20) {
                                      setPartsCount(parsed)
                                    }
                                  }
                                  setIsCustomMode(false)
                                }}
                                className="h-14 px-4 rounded-xl bg-[#A8E6E1] text-white font-semibold hover:bg-[#7DD3CC] transition-colors"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={activateCustomMode}
                              className="h-14 px-5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-dashed border-slate-300 dark:border-slate-500 flex-1 text-sm"
                            >
                              Custom...
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Duration per part preview */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Each part will be approximately{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {formatTime(videoDuration / partsCount)}
                        </span>
                      </p>
                    </div>

                    {/* Timeline preview */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Split Preview
                      </p>
                      <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                        {Array.from({ length: partsCount }).map((_, i) => (
                          <motion.div
                            key={`preview-${i}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                            className={`flex-1 bg-gradient-to-r ${PART_COLORS[i % PART_COLORS.length]} rounded-sm flex items-center justify-center`}
                          >
                            <span className="text-[10px] font-bold text-white/80">
                              {i + 1}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      className="px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSplitVideo}
                      disabled={partsCount < 2 || partsCount > 20}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#A8E6E1] to-[#7DD3CC] text-white font-bold hover:shadow-lg hover:shadow-[#A8E6E1]/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-[0.98]"
                    >
                      <Scissors className="w-5 h-5" />
                      Split into {partsCount} Parts
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ============================================ */}
              {/* STEP 3: PROCESSING                           */}
              {/* ============================================ */}
              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="py-16 text-center"
                >
                  {/* Animated spinner */}
                  <div className="relative w-28 h-28 mx-auto mb-8">
                    {/* Outer ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#A8E6E1] border-r-[#F9B4C4]"
                    />
                    {/* Middle ring */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#A8E6E1] border-l-[#F9B4C4]"
                    />
                    {/* Inner icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      >
                        <Scissors className="w-10 h-10 text-[#A8E6E1]" />
                      </motion.div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Splitting video...
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                    Processing your video into {partsCount} parts using FFmpeg. This may take a moment depending on the file size.
                  </p>

                  {/* Pulsing dots */}
                  <div className="flex items-center justify-center gap-1.5 mt-6">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                        className="w-2.5 h-2.5 rounded-full bg-[#A8E6E1]"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ============================================ */}
              {/* STEP 4: RESULTS                              */}
              {/* ============================================ */}
              {step === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Success header */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#A8E6E1]/10 to-[#F9B4C4]/10 dark:from-[#A8E6E1]/5 dark:to-[#F9B4C4]/5 border border-[#A8E6E1]/20 dark:border-[#A8E6E1]/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A8E6E1] to-[#7DD3CC] flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        Split complete!
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {splitResults.length} parts created from your video
                      </p>
                    </div>
                  </div>

                  {/* Original video timeline */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Original Timeline
                    </p>
                    <div className="relative h-6 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="absolute inset-0 flex">
                        {splitResults.map((part, i) => {
                          const widthPercent = ((part.endTime - part.startTime) / totalDuration) * 100
                          return (
                            <motion.div
                              key={`timeline-${part.index}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: i * 0.1, duration: 0.4 }}
                              style={{ width: `${widthPercent}%` }}
                              className={`h-full bg-gradient-to-r ${PART_COLORS[i % PART_COLORS.length]} origin-left`}
                            />
                          )
                        })}
                      </div>
                    </div>
                    {/* Time markers */}
                    <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      <span>0.00s</span>
                      <span>{formatTime(totalDuration)}</span>
                    </div>

                    {/* Split segments breakdown */}
                    <div className="flex gap-1.5">
                      {splitResults.map((part, i) => (
                        <div key={`segment-${part.index}`} className="flex-1 text-center">
                          <div
                            className="h-2 rounded-full mb-1"
                            style={{ backgroundColor: PART_SOLID_COLORS[i % PART_SOLID_COLORS.length] }}
                          />
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-tight">
                            {part.startTime.toFixed(2)}s - {part.endTime.toFixed(2)}s
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Parts grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Split Parts
                      </p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedCount} of {splitResults.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {splitResults.map((part, i) => (
                        <motion.div
                          key={`part-${part.index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className={`relative rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                            part.selected
                              ? 'border-[#A8E6E1] bg-[#A8E6E1]/5 dark:bg-[#A8E6E1]/5 shadow-md shadow-[#A8E6E1]/10'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          {/* Color stripe at top */}
                          <div
                            className="h-1.5"
                            style={{ background: `linear-gradient(to right, ${PART_SOLID_COLORS[i % PART_SOLID_COLORS.length]}, ${PART_SOLID_COLORS[(i + 1) % PART_SOLID_COLORS.length]})` }}
                          />

                          <div className="p-4">
                            {/* Header row */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                  style={{ backgroundColor: PART_SOLID_COLORS[i % PART_SOLID_COLORS.length] }}
                                >
                                  {part.index + 1}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                                    Part {part.index + 1}
                                  </p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                    {part.startTime.toFixed(2)}s - {part.endTime.toFixed(2)}s
                                  </p>
                                </div>
                              </div>

                              {/* Checkbox */}
                              <button
                                onClick={() => togglePartSelection(part.index)}
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                                  part.selected
                                    ? 'bg-[#A8E6E1] border-[#A8E6E1] text-white'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-[#A8E6E1]'
                                }`}
                              >
                                {part.selected && <Check className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            {/* Video preview */}
                            <div className="relative rounded-lg overflow-hidden bg-black mb-3 aspect-video">
                              <video
                                src={part.url}
                                className="w-full h-full object-contain"
                                preload="metadata"
                                muted
                                playsInline
                                onMouseEnter={(e) => {
                                  const video = e.currentTarget
                                  video.currentTime = 0
                                  video.play().catch(() => {})
                                }}
                                onMouseLeave={(e) => {
                                  const video = e.currentTarget
                                  video.pause()
                                  video.currentTime = 0
                                }}
                              />
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm">
                                <span className="text-[10px] font-mono text-white/80">
                                  {part.duration.toFixed(2)}s
                                </span>
                              </div>
                            </div>

                            {/* Download button */}
                            <button
                              onClick={() => handleDownloadPart(part)}
                              className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      className="px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm"
                    >
                      Split Another Video
                    </button>

                    <button
                      onClick={handleDownloadSelected}
                      disabled={selectedCount === 0}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#A8E6E1] to-[#7DD3CC] text-white font-bold hover:shadow-lg hover:shadow-[#A8E6E1]/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-[0.98] text-sm"
                    >
                      <Download className="w-5 h-5" />
                      Download Selected ({selectedCount})
                    </button>

                    {onPartsSelected && (
                      <button
                        onClick={handleUseInPipeline}
                        disabled={selectedCount === 0}
                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#F9B4C4] to-[#F28DA6] text-white font-bold hover:shadow-lg hover:shadow-[#F9B4C4]/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-[0.98] text-sm"
                      >
                        <Film className="w-5 h-5" />
                        Use in Pipeline ({selectedCount})
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
