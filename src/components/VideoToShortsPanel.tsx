'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Link,
  Scissors,
  Play,
  Pause,
  Check,
  X,
  Sparkles,
  Clock,
  Hash,
  Zap,
  ChevronRight,
  Film,
  AlertCircle,
  Loader2,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Settings,
  Volume2,
  Type,
  Music
} from 'lucide-react'
import { VideoToShortsInput, DetectedHighlight, GeneratedShort } from '@/types'

interface VideoToShortsPanelProps {
  onShortsGenerated?: (shorts: GeneratedShort[]) => void
}

export function VideoToShortsPanel({ onShortsGenerated }: VideoToShortsPanelProps) {
  // State
  const [step, setStep] = useState<'upload' | 'configure' | 'analyzing' | 'highlights' | 'generating' | 'complete'>('upload')
  const [videoSource, setVideoSource] = useState<'file' | 'url'>('file')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  // Configuration
  const [config, setConfig] = useState<VideoToShortsInput>({
    numberOfShorts: 3,
    shortsDuration: '30',
    focusKeywords: [],
    highlightMoments: 'auto',
    addCaptions: true,
    addMusic: false,
    aspectRatio: '9:16',
    videoDuration: 0
  })
  const [keywordInput, setKeywordInput] = useState('')

  // Results
  const [highlights, setHighlights] = useState<DetectedHighlight[]>([])
  const [generatedShorts, setGeneratedShorts] = useState<GeneratedShort[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    setError(null)

    if (!file.type.startsWith('video/')) {
      setError('Please select a video file (MP4, MOV, WebM)')
      return
    }

    // Max 500MB
    if (file.size > 500 * 1024 * 1024) {
      setError('Video file must be less than 500MB')
      return
    }

    setVideoFile(file)
    const url = URL.createObjectURL(file)
    setVideoPreviewUrl(url)
  }, [])

  // Handle video metadata loaded
  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current) {
      const duration = videoRef.current.duration
      setVideoDuration(duration)
      setConfig(prev => ({ ...prev, videoDuration: duration }))

      if (duration < 60) {
        setError('Video must be at least 60 seconds long for conversion')
      } else {
        setStep('configure')
      }
    }
  }, [])

  // Handle URL submit
  const handleUrlSubmit = useCallback(() => {
    setError(null)

    if (!videoUrl.trim()) {
      setError('Please enter a video URL')
      return
    }

    // Basic URL validation
    try {
      new URL(videoUrl)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    // For now, we'll simulate moving to configure
    // In production, you'd validate and fetch video metadata
    setVideoPreviewUrl(videoUrl)
    setVideoDuration(300) // Simulated 5 min video
    setConfig(prev => ({ ...prev, videoDuration: 300 }))
    setStep('configure')
  }, [videoUrl])

  // Drag and drop handlers
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  // Start analysis
  const handleStartAnalysis = useCallback(async () => {
    setStep('analyzing')
    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI analysis with progress
    const progressSteps = [
      { progress: 10, message: 'Loading video...' },
      { progress: 25, message: 'Extracting audio transcript...' },
      { progress: 45, message: 'Analyzing engagement patterns...' },
      { progress: 65, message: 'Detecting viral moments...' },
      { progress: 85, message: 'Ranking highlights...' },
      { progress: 100, message: 'Complete!' },
    ]

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setAnalysisProgress(step.progress)
    }

    // Generate mock highlights
    const mockHighlights: DetectedHighlight[] = [
      {
        id: '1',
        startTime: 15,
        endTime: 45,
        duration: 30,
        confidence: 95,
        reason: 'High engagement moment - key insight shared',
        transcript: 'This is the most important thing you need to know about...',
        selected: true
      },
      {
        id: '2',
        startTime: 78,
        endTime: 108,
        duration: 30,
        confidence: 88,
        reason: 'Emotional peak - compelling story',
        transcript: 'When I realized this changed everything...',
        selected: true
      },
      {
        id: '3',
        startTime: 145,
        endTime: 175,
        duration: 30,
        confidence: 82,
        reason: 'Tutorial moment - actionable steps',
        transcript: 'Here\'s exactly how you do it step by step...',
        selected: true
      },
      {
        id: '4',
        startTime: 210,
        endTime: 240,
        duration: 30,
        confidence: 78,
        reason: 'Hook potential - controversial statement',
        transcript: 'Most people get this completely wrong...',
        selected: false
      },
      {
        id: '5',
        startTime: 280,
        endTime: 310,
        duration: 30,
        confidence: 72,
        reason: 'Call to action - strong closing',
        transcript: 'If you want to see real results, do this...',
        selected: false
      },
    ]

    setHighlights(mockHighlights)
    setIsAnalyzing(false)
    setStep('highlights')
  }, [])

  // Toggle highlight selection
  const toggleHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.map(h =>
      h.id === id ? { ...h, selected: !h.selected } : h
    ))
  }, [])

  // Generate shorts
  const handleGenerateShorts = useCallback(async () => {
    setStep('generating')

    const selectedHighlights = highlights.filter(h => h.selected)

    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const shorts: GeneratedShort[] = selectedHighlights.map((h, i) => ({
      id: `short-${i + 1}`,
      title: `Viral Short #${i + 1}`,
      description: h.reason,
      startTime: h.startTime,
      endTime: h.endTime,
      duration: h.duration,
      thumbnail: undefined,
      captions: h.transcript,
      suggestedHashtags: ['#viral', '#fyp', '#trending', '#tips', '#mustsee'],
      viralScore: h.confidence
    }))

    setGeneratedShorts(shorts)
    setStep('complete')
    onShortsGenerated?.(shorts)
  }, [highlights, onShortsGenerated])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Reset
  const handleReset = useCallback(() => {
    setStep('upload')
    setVideoFile(null)
    setVideoUrl('')
    setVideoPreviewUrl(null)
    setVideoDuration(0)
    setHighlights([])
    setGeneratedShorts([])
    setError(null)
    setAnalysisProgress(0)
  }, [])

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {['upload', 'configure', 'analyzing', 'highlights', 'complete'].map((s, i) => {
          const stepIndex = ['upload', 'configure', 'analyzing', 'highlights', 'generating', 'complete'].indexOf(step)
          const currentIndex = ['upload', 'configure', 'analyzing', 'highlights', 'complete'].indexOf(s)
          const isActive = currentIndex <= stepIndex
          const isCurrent = s === step || (step === 'generating' && s === 'highlights')

          return (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white scale-110'
                  : isActive
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {isActive && !isCurrent ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < 4 && (
                <div className={`w-8 h-1 mx-1 rounded ${
                  currentIndex < stepIndex ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-800/50 rounded">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Upload */}
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Source Toggle */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setVideoSource('file')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  videoSource === 'file'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
              <button
                onClick={() => setVideoSource('url')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  videoSource === 'url'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Link className="w-4 h-4" />
                Paste URL
              </button>
            </div>

            {videoSource === 'file' ? (
              <>
                {/* Drag & Drop Area */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                    isDragging
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/10'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                      isDragging ? 'bg-pink-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      <Film className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {isDragging ? 'Drop your video here' : 'Drag & drop your long video'}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      MP4, MOV, WebM • Max 500MB • Min 60 seconds
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </>
            ) : (
              /* URL Input */
              <div className="space-y-3">
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube, TikTok, or direct video URL..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  />
                </div>
                <button
                  onClick={handleUrlSubmit}
                  disabled={!videoUrl.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Load Video
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Supports YouTube, TikTok, Vimeo, and direct video links
                </p>
              </div>
            )}

            {/* Video Preview */}
            {videoPreviewUrl && videoSource === 'file' && (
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={videoPreviewUrl}
                  onLoadedMetadata={handleVideoLoaded}
                  controls
                  className="w-full max-h-64 object-contain"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Configure */}
        {step === 'configure' && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 border border-teal-200 dark:border-teal-700/50">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Video Duration: {formatTime(videoDuration)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">We'll analyze this video for the best viral moments</p>
                </div>
              </div>
            </div>

            {/* Number of Shorts */}
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 block">
                Number of Shorts to Generate
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 5, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => setConfig(prev => ({ ...prev, numberOfShorts: num }))}
                    className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                      config.numberOfShorts === num
                        ? 'bg-pink-100 dark:bg-pink-900/50 border-2 border-pink-500 text-pink-700 dark:text-pink-300'
                        : 'bg-slate-100 dark:bg-slate-800 border-2 border-transparent text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {num} {num === 1 ? 'Short' : 'Shorts'}
                  </button>
                ))}
              </div>
            </div>

            {/* Short Duration */}
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 block">
                Short Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['15', '30', '60'] as const).map(dur => (
                  <button
                    key={dur}
                    onClick={() => setConfig(prev => ({ ...prev, shortsDuration: dur }))}
                    className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                      config.shortsDuration === dur
                        ? 'bg-teal-100 dark:bg-teal-900/50 border-2 border-teal-500 text-teal-700 dark:text-teal-300'
                        : 'bg-slate-100 dark:bg-slate-800 border-2 border-transparent text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 block">
                Output Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: '9:16', label: 'Vertical', icon: '📱' },
                  { value: '1:1', label: 'Square', icon: '⬜' },
                  { value: '16:9', label: 'Horizontal', icon: '🖥️' }
                ] as const).map(ratio => (
                  <button
                    key={ratio.value}
                    onClick={() => setConfig(prev => ({ ...prev, aspectRatio: ratio.value }))}
                    className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                      config.aspectRatio === ratio.value
                        ? 'bg-pink-100 dark:bg-pink-900/50 border-2 border-pink-500 text-pink-700 dark:text-pink-300'
                        : 'bg-slate-100 dark:bg-slate-800 border-2 border-transparent text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{ratio.icon}</span>
                    <span className="block mt-1">{ratio.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhancement Options */}
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 block">
                Enhancements
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConfig(prev => ({ ...prev, addCaptions: !prev.addCaptions }))}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                    config.addCaptions
                      ? 'bg-teal-100 dark:bg-teal-900/50 border-2 border-teal-500 text-teal-700 dark:text-teal-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-2 border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Auto Captions
                </button>
                <button
                  onClick={() => setConfig(prev => ({ ...prev, addMusic: !prev.addMusic }))}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                    config.addMusic
                      ? 'bg-teal-100 dark:bg-teal-900/50 border-2 border-teal-500 text-teal-700 dark:text-teal-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-2 border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Music className="w-4 h-4" />
                  Background Music
                </button>
              </div>
            </div>

            {/* Focus Keywords */}
            <div>
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 block">
                Focus Keywords (optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && keywordInput.trim()) {
                      setConfig(prev => ({ ...prev, focusKeywords: [...prev.focusKeywords, keywordInput.trim()] }))
                      setKeywordInput('')
                    }
                  }}
                  placeholder="Add keyword and press Enter"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm"
                />
              </div>
              {config.focusKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {config.focusKeywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        onClick={() => setConfig(prev => ({
                          ...prev,
                          focusKeywords: prev.focusKeywords.filter((_, idx) => idx !== i)
                        }))}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleStartAnalysis}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Analyze Video with AI
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Analyzing */}
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-12 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              AI is Analyzing Your Video
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Finding the most viral-worthy moments...
            </p>
            <div className="max-w-xs mx-auto">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {analysisProgress}% complete
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 4: Highlights */}
        {step === 'highlights' && (
          <motion.div
            key="highlights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Detected Highlights
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Select which moments to convert into shorts
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-sm font-semibold">
                {highlights.filter(h => h.selected).length} selected
              </span>
            </div>

            <div className="space-y-3">
              {highlights.map((highlight) => (
                <motion.div
                  key={highlight.id}
                  layout
                  onClick={() => toggleHighlight(highlight.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    highlight.selected
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      highlight.selected
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}>
                      {highlight.selected && <Check className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {formatTime(highlight.startTime)} - {formatTime(highlight.endTime)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          highlight.confidence >= 90
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                            : highlight.confidence >= 75
                              ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {highlight.confidence}% viral potential
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium mb-1">
                        {highlight.reason}
                      </p>
                      {highlight.transcript && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic truncate">
                          "{highlight.transcript}"
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep('configure')}
                className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleGenerateShorts}
                disabled={highlights.filter(h => h.selected).length === 0}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Scissors className="w-5 h-5" />
                Generate {highlights.filter(h => h.selected).length} Shorts
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Generating */}
        {step === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-12 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
              <Scissors className="w-12 h-12 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Creating Your Shorts
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Cutting, enhancing, and optimizing for maximum engagement...
            </p>
          </motion.div>
        )}

        {/* Step 6: Complete */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700/50 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200">
                {generatedShorts.length} Shorts Generated!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your viral shorts are ready for download
              </p>
            </div>

            <div className="space-y-3">
              {generatedShorts.map((short, i) => (
                <div
                  key={short.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xl">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white">{short.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{short.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{short.duration}s</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          short.viralScore >= 90
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                        }`}>
                          {short.viralScore}% viral score
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {short.suggestedHashtags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {short.suggestedHashtags.map((tag, j) => (
                        <span key={j} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Video
              </button>
              <button
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download All Shorts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
