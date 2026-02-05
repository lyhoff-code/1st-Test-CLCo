'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  Play,
  Pause,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Video,
  Wand2,
  Copy,
  Clock,
  Scissors,
  Music,
  Type,
  Download,
  ChevronRight,
  ChevronLeft,
  Eye,
  RefreshCw,
  Sparkles,
  Zap,
  FileText,
  ExternalLink,
  Check,
  AlertCircle,
  GripVertical,
  Mic,
  Volume2,
  VolumeX,
  Loader2,
  Brain,
  Settings
} from 'lucide-react'
import {
  VideoScene,
  VideoProject,
  MotionType,
  generateVideoPrompts,
  createEmptyVideoScene,
  calculateTotalDuration,
  FREE_VIDEO_TOOLS
} from '@/types/content'
import { ToneType } from '@/types'

interface VideoCreatorProps {
  productImage?: string
  productName?: string
  productDescription?: string
  productPrice?: string
  onExport?: (project: VideoProject) => void
}

const MOTION_TYPES: { id: MotionType; name: string; icon: string }[] = [
  { id: 'zoom_in', name: 'Zoom In', icon: '🔍' },
  { id: 'zoom_out', name: 'Zoom Out', icon: '🔎' },
  { id: 'pan_left', name: 'Pan Left', icon: '⬅️' },
  { id: 'pan_right', name: 'Pan Right', icon: '➡️' },
  { id: 'pan_up', name: 'Pan Up', icon: '⬆️' },
  { id: 'pan_down', name: 'Pan Down', icon: '⬇️' },
  { id: 'ken_burns', name: 'Ken Burns', icon: '🎬' },
  { id: 'static', name: 'Static', icon: '⏸️' },
  { id: 'float', name: 'Float', icon: '🎈' },
  { id: 'pulse', name: 'Pulse', icon: '💫' },
]

const CUT_TYPES = [
  { id: 'hard', name: 'Hard Cut', description: 'Direct transition' },
  { id: 'fade', name: 'Fade', description: 'Gradual fade' },
  { id: 'slide', name: 'Slide', description: 'Slide transition' },
  { id: 'zoom', name: 'Zoom', description: 'Zoom transition' },
]

const TONE_OPTIONS: { id: ToneType; name: string; icon: string; description: string }[] = [
  { id: 'divertido', name: 'Fun', icon: '🎉', description: 'Casual, entertaining' },
  { id: 'profesional', name: 'Professional', icon: '💼', description: 'Serious, corporate' },
  { id: 'educativo', name: 'Educational', icon: '📚', description: 'Informative, clear' },
  { id: 'emocional', name: 'Emotional', icon: '💝', description: 'Touching, relatable' },
  { id: 'urgente', name: 'Urgent', icon: '🔥', description: 'FOMO, scarcity' },
]

const CONTENT_TYPES = [
  { id: 'reel', name: 'Reel', duration: 30, icon: '📱' },
  { id: 'story', name: 'Story', duration: 15, icon: '⏱️' },
  { id: 'storytelling', name: 'Storytelling', duration: 30, icon: '📖' },
]

export function VideoCreator({ productImage, productName, productDescription, productPrice, onExport }: VideoCreatorProps) {
  // Project state
  const [scenes, setScenes] = useState<VideoScene[]>([
    createEmptyVideoScene(0),
    createEmptyVideoScene(1),
    createEmptyVideoScene(2),
  ])
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  // AI Generation state
  const [selectedTone, setSelectedTone] = useState<ToneType>('profesional')
  const [selectedContentType, setSelectedContentType] = useState('reel')
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  // Audio state
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // UI state
  const [activeTab, setActiveTab] = useState<'edit' | 'ai' | 'prompts' | 'upload'>('ai')
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)
  const [showToneSelector, setShowToneSelector] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const selectedScene = scenes[selectedSceneIndex]
  const totalDuration = calculateTotalDuration(scenes)

  // AI Script Generation
  const generateScript = async () => {
    if (!productName) {
      setGenerationError('Please select a product first')
      return
    }

    setIsGeneratingScript(true)
    setGenerationError(null)

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            title: productName,
            description: productDescription || '',
            priceRange: {
              minVariantPrice: {
                amount: productPrice?.replace('$', '') || '0',
                currencyCode: 'USD'
              }
            }
          },
          contentType: selectedContentType,
          tone: selectedTone
        })
      })

      if (!response.ok) throw new Error('Failed to generate script')

      const data = await response.json()

      // Update scenes with generated scripts
      if (data.scenes && Array.isArray(data.scenes)) {
        const newScenes = data.scenes.map((scene: { text: string; duration: number }, index: number) => ({
          ...createEmptyVideoScene(index),
          script: scene.text,
          duration: Math.round(scene.duration) || 3,
          videoPrompts: generateVideoPrompts(scene.text, 'zoom_in', scene.duration || 3)
        }))
        setScenes(newScenes)
        setSelectedSceneIndex(0)
      }
    } catch (error) {
      console.error('Error generating script:', error)
      setGenerationError('Failed to generate script. Using demo content...')

      // Demo fallback
      const demoScenes = [
        { text: `Discover ${productName} - the product you've been waiting for!`, duration: 5 },
        { text: productDescription?.slice(0, 80) || 'Premium quality and incredible features.', duration: 8 },
        { text: `Available now for only ${productPrice || '$99'}`, duration: 5 },
        { text: 'Order today! Link in bio.', duration: 4 },
      ]

      const newScenes = demoScenes.map((scene, index) => ({
        ...createEmptyVideoScene(index),
        script: scene.text,
        duration: scene.duration,
        videoPrompts: generateVideoPrompts(scene.text, 'zoom_in', scene.duration)
      }))
      setScenes(newScenes)
    } finally {
      setIsGeneratingScript(false)
    }
  }

  // Voice Generation
  const generateVoice = async () => {
    const fullScript = scenes.map(s => s.script).filter(Boolean).join(' ')
    if (!fullScript) {
      setGenerationError('Please generate a script first')
      return
    }

    setIsGeneratingVoice(true)
    setGenerationError(null)

    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullScript,
          tone: selectedTone
        })
      })

      if (!response.ok) throw new Error('Failed to generate audio')

      const data = await response.json()
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl)
      }
    } catch (error) {
      console.error('Error generating voice:', error)
      setGenerationError('Voice generation failed. Using browser TTS...')

      // Browser TTS fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(fullScript)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        speechSynthesis.speak(utterance)
      }
    } finally {
      setIsGeneratingVoice(false)
    }
  }

  // Play/Pause audio
  const toggleAudio = () => {
    if (!audioRef.current) return

    if (isPlayingAudio) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlayingAudio(!isPlayingAudio)
  }

  // Scene operations
  const addScene = () => {
    const newScene = createEmptyVideoScene(scenes.length)
    setScenes([...scenes, newScene])
    setSelectedSceneIndex(scenes.length)
  }

  const deleteScene = (index: number) => {
    if (scenes.length <= 1) return
    const newScenes = scenes.filter((_, i) => i !== index)
    setScenes(newScenes)
    if (selectedSceneIndex >= newScenes.length) {
      setSelectedSceneIndex(newScenes.length - 1)
    }
  }

  const duplicateScene = (index: number) => {
    const scene = scenes[index]
    const newScene = {
      ...scene,
      id: `scene-${Date.now()}`,
      order: scenes.length
    }
    setScenes([...scenes, newScene])
  }

  const updateScene = (index: number, updates: Partial<VideoScene>) => {
    setScenes(scenes.map((scene, i) => {
      if (i !== index) return scene
      const updated = { ...scene, ...updates }
      // Regenerate prompts if motion type or duration changes
      if (updates.motionType || updates.duration || updates.script) {
        updated.videoPrompts = generateVideoPrompts(
          updates.script || scene.script,
          updates.motionType || scene.motionType,
          updates.duration || scene.duration
        )
      }
      return updated
    }))
  }

  const reorderScenes = (newScenes: VideoScene[]) => {
    setScenes(newScenes.map((scene, i) => ({ ...scene, order: i })))
  }

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    updateScene(selectedSceneIndex, {
      imageUrl: url,
      imageFile: file,
      status: 'image_ready'
    })
  }

  // Video upload (from external tools)
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    updateScene(selectedSceneIndex, {
      videoUrl: url,
      videoFile: file,
      status: 'video_ready'
    })
  }

  // Copy prompt to clipboard
  const copyPrompt = (tool: string, prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(tool)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  // Get scene status
  const getSceneStatus = (scene: VideoScene) => {
    if (scene.videoUrl) return { status: 'video_ready', label: 'Video Ready', color: 'green' }
    if (scene.imageUrl) return { status: 'image_ready', label: 'Image Ready', color: 'blue' }
    return { status: 'pending', label: 'Pending', color: 'gray' }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-500" />
              Video Creator
              {productName && (
                <span className="text-sm font-normal text-slate-500">- {productName}</span>
              )}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {scenes.length} scenes - {totalDuration}s total
            </p>
          </div>
          <div className="flex items-center gap-2">
            {audioUrl && (
              <button
                onClick={toggleAudio}
                className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600"
              >
                {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              scenes.every(s => s.status === 'video_ready')
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {scenes.filter(s => s.videoUrl).length}/{scenes.length} videos ready
            </span>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlayingAudio(false)}
          className="hidden"
        />
      )}

      <div className="flex">
        {/* Scenes List (Left) */}
        <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Scenes</span>
            <button
              onClick={addScene}
              className="p-1.5 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Reorder.Group
            axis="y"
            values={scenes}
            onReorder={reorderScenes}
            className="p-2 space-y-2 max-h-[500px] overflow-y-auto"
          >
            {scenes.map((scene, index) => {
              const status = getSceneStatus(scene)
              return (
                <Reorder.Item
                  key={scene.id}
                  value={scene}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedSceneIndex === index
                      ? 'bg-white dark:bg-slate-800 shadow-md border-2 border-purple-500'
                      : 'bg-white dark:bg-slate-800 hover:shadow border border-slate-200 dark:border-slate-700'
                  }`}
                  onClick={() => setSelectedSceneIndex(index)}
                >
                  <div className="flex items-start gap-2">
                    <div className="cursor-grab mt-1">
                      <GripVertical className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 relative">
                      {scene.videoUrl ? (
                        <video
                          src={scene.videoUrl}
                          className="w-full h-full object-cover"
                        />
                      ) : scene.imageUrl ? (
                        <img
                          src={scene.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <span className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                        status.color === 'green' ? 'bg-green-500' :
                        status.color === 'blue' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Scene {index + 1}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {scene.script?.slice(0, 30) || 'No script yet'}...
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {scene.duration}s
                      </p>
                    </div>
                  </div>
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {[
              { id: 'ai', label: 'AI Script', icon: Brain },
              { id: 'edit', label: 'Edit', icon: Type },
              { id: 'prompts', label: 'Prompts', icon: Wand2 },
              { id: 'upload', label: 'Upload', icon: Upload },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {/* AI Script Tab */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                {/* Content Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Content Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CONTENT_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedContentType(type.id)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          selectedContentType === type.id
                            ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                            : 'bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{type.name}</p>
                        <p className="text-xs text-slate-500">{type.duration}s</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tone / Style
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {TONE_OPTIONS.map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedTone(tone.id)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          selectedTone === tone.id
                            ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                            : 'bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xl">{tone.icon}</span>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">{tone.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {generationError && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{generationError}</span>
                  </div>
                )}

                {/* Generate Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={generateScript}
                    disabled={isGeneratingScript || !productName}
                    className={`p-4 rounded-xl flex items-center justify-center gap-3 font-medium transition-all ${
                      isGeneratingScript || !productName
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {isGeneratingScript ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Script with AI
                      </>
                    )}
                  </button>

                  <button
                    onClick={generateVoice}
                    disabled={isGeneratingVoice || !scenes.some(s => s.script)}
                    className={`p-4 rounded-xl flex items-center justify-center gap-3 font-medium transition-all ${
                      isGeneratingVoice || !scenes.some(s => s.script)
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {isGeneratingVoice ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Generate Voice
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Script Preview */}
                {scenes.some(s => s.script) && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Generated Script
                    </h4>
                    <div className="space-y-2">
                      {scenes.map((scene, idx) => (
                        <div key={scene.id} className="flex gap-2">
                          <span className="text-xs font-medium text-purple-500 w-16">Scene {idx + 1}:</span>
                          <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">{scene.script}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Edit Tab */}
            {activeTab === 'edit' && selectedScene && (
              <div className="space-y-4">
                {/* Scene Preview */}
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden relative">
                  {selectedScene.videoUrl ? (
                    <video
                      src={selectedScene.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : selectedScene.imageUrl ? (
                    <img
                      src={selectedScene.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : productImage ? (
                    <img
                      src={productImage}
                      alt=""
                      className="w-full h-full object-cover opacity-50"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500">Upload an image or video</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Script Editor */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Scene Script
                  </label>
                  <textarea
                    value={selectedScene.script}
                    onChange={(e) => updateScene(selectedSceneIndex, { script: e.target.value })}
                    placeholder="Enter the script for this scene..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                    rows={3}
                  />
                </div>

                {/* Duration & Motion */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={selectedScene.duration}
                      onChange={(e) => updateScene(selectedSceneIndex, { duration: parseInt(e.target.value) || 3 })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Cut Type
                    </label>
                    <select
                      value={selectedScene.cutType}
                      onChange={(e) => updateScene(selectedSceneIndex, { cutType: e.target.value as VideoScene['cutType'] })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      {CUT_TYPES.map(cut => (
                        <option key={cut.id} value={cut.id}>{cut.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Motion Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Motion Type
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {MOTION_TYPES.map(motion => (
                      <button
                        key={motion.id}
                        onClick={() => updateScene(selectedSceneIndex, { motionType: motion.id })}
                        className={`p-2 rounded-lg text-center text-xs transition-all ${
                          selectedScene.motionType === motion.id
                            ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                            : 'bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <span className="text-lg">{motion.icon}</span>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">{motion.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scene Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center gap-2 hover:bg-blue-100"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Upload Image
                  </button>
                  <button
                    onClick={() => duplicateScene(selectedSceneIndex)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteScene(selectedSceneIndex)}
                    disabled={scenes.length <= 1}
                    className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Prompts Tab */}
            {activeTab === 'prompts' && selectedScene && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Scene {selectedSceneIndex + 1} Script
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedScene.script || 'No script yet. Generate one in the AI Script tab.'}
                  </p>
                </div>

                <h4 className="font-medium text-slate-700 dark:text-slate-300">
                  Copy prompts for free video tools:
                </h4>

                <div className="space-y-3">
                  {FREE_VIDEO_TOOLS.map(tool => {
                    const prompt = selectedScene.videoPrompts?.[tool.id as keyof typeof selectedScene.videoPrompts] ||
                      `Create a ${selectedScene.duration}s video with ${selectedScene.motionType} effect: ${selectedScene.script}`
                    return (
                      <div key={tool.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {tool.name}
                            </span>
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-full">
                              {tool.freeCredits}
                            </span>
                          </div>
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                          >
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{tool.bestFor}</p>
                        <div className="flex gap-2">
                          <div className="flex-1 p-2 bg-white dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400 max-h-20 overflow-y-auto">
                            {prompt}
                          </div>
                          <button
                            onClick={() => copyPrompt(tool.id, prompt)}
                            className={`p-2 rounded-lg transition-all ${
                              copiedPrompt === tool.id
                                ? 'bg-green-100 text-green-600'
                                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            }`}
                          >
                            {copiedPrompt === tool.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && selectedScene && (
              <div className="space-y-4">
                <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center">
                  <Video className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Upload Video for Scene {selectedSceneIndex + 1}
                  </h4>
                  <p className="text-sm text-slate-500 mb-4">
                    Upload the video you created with free tools
                  </p>
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                  >
                    Choose Video File
                  </button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>

                {selectedScene.videoUrl && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 dark:text-green-400">Video uploaded successfully!</span>
                  </div>
                )}

                {/* Workflow reminder */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Workflow:</h4>
                  <ol className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>Generate script in AI Script tab</li>
                    <li>Copy prompts from Prompts tab</li>
                    <li>Create video in free tools (Grok, Pika, etc.)</li>
                    <li>Upload the video here</li>
                    <li>Export your project</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Timeline */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Timeline</span>
          <span className="text-sm text-slate-500">{totalDuration}s total</span>
        </div>

        {/* Timeline visualization */}
        <div className="flex gap-1 h-12 rounded-lg overflow-hidden">
          {scenes.map((scene, index) => {
            const width = (scene.duration / totalDuration) * 100
            const status = getSceneStatus(scene)
            return (
              <button
                key={scene.id}
                onClick={() => setSelectedSceneIndex(index)}
                className={`relative transition-all ${
                  selectedSceneIndex === index ? 'ring-2 ring-purple-500' : ''
                }`}
                style={{ width: `${width}%` }}
              >
                <div className={`h-full rounded ${
                  status.color === 'green' ? 'bg-green-200 dark:bg-green-900/50' :
                  status.color === 'blue' ? 'bg-blue-200 dark:bg-blue-900/50' :
                  'bg-slate-200 dark:bg-slate-700'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {scene.duration}s
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Export button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onExport?.({
              id: `project-${Date.now()}`,
              name: productName || 'Video Project',
              type: selectedContentType === 'storytelling' ? 'video' : selectedContentType as 'reel' | 'story' | 'video',
              productName,
              productImage,
              aspectRatio: '9:16',
              scenes,
              music: undefined,
              totalDuration,
              status: scenes.every(s => s.videoUrl) ? 'ready' : 'editing',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })}
            disabled={!scenes.some(s => s.videoUrl || s.script)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export Project
          </button>
        </div>
      </div>
    </div>
  )
}
