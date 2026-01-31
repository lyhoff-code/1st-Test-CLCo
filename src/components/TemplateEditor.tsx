'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Image as ImageIcon,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Edit3,
  Check,
  X,
  Clock,
  Type,
  Music,
  Sparkles,
  RefreshCw,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn
} from 'lucide-react'
import {
  VideoTemplateStructure,
  SceneTemplate,
  UserScene,
  UserProject
} from '@/types/templates'

interface TemplateEditorProps {
  template: VideoTemplateStructure
  product?: {
    id: string
    name: string
    description: string
    imageUrl?: string
  }
  onExport: (project: UserProject) => void
  onGenerateAI?: (sceneId: string, prompt: string) => Promise<string>
  onGenerateSpeech?: (text: string) => Promise<string>
}

export function TemplateEditor({
  template,
  product,
  onExport,
  onGenerateAI,
  onGenerateSpeech
}: TemplateEditorProps) {
  const [userScenes, setUserScenes] = useState<UserScene[]>(
    template.scenes.map(scene => ({
      id: `user-${scene.id}`,
      templateSceneId: scene.id,
      imageUrl: null,
      script: scene.defaultText.replace('[product]', product?.name || '[product]'),
      duration: scene.duration,
      isEdited: false
    }))
  )
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [editingScript, setEditingScript] = useState<string | null>(null)
  const [tempScript, setTempScript] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeScene = template.scenes[activeSceneIndex]
  const activeUserScene = userScenes[activeSceneIndex]

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setUserScenes(prev => prev.map((scene, idx) =>
          idx === activeSceneIndex
            ? { ...scene, imageUrl, imageFile: file, isEdited: true }
            : scene
        ))
      }
      reader.readAsDataURL(file)
    }
  }, [activeSceneIndex])

  // Handle AI image generation
  const handleGenerateAI = async () => {
    if (!onGenerateAI) return
    setIsGenerating(true)
    try {
      const prompt = `${activeScene.placeholder.instructions} for ${product?.name || 'product'}`
      const imageUrl = await onGenerateAI(activeScene.id, prompt)
      setUserScenes(prev => prev.map((scene, idx) =>
        idx === activeSceneIndex
          ? { ...scene, imageUrl, isEdited: true }
          : scene
      ))
    } catch (error) {
      console.error('AI generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle script edit
  const startEditingScript = () => {
    setEditingScript(activeUserScene.id)
    setTempScript(activeUserScene.script)
  }

  const saveScript = () => {
    setUserScenes(prev => prev.map((scene, idx) =>
      idx === activeSceneIndex
        ? { ...scene, script: tempScript, isEdited: true }
        : scene
    ))
    setEditingScript(null)
  }

  const cancelEditScript = () => {
    setEditingScript(null)
    setTempScript('')
  }

  // Navigation
  const goToNextScene = () => {
    if (activeSceneIndex < template.scenes.length - 1) {
      setActiveSceneIndex(prev => prev + 1)
    }
  }

  const goToPrevScene = () => {
    if (activeSceneIndex > 0) {
      setActiveSceneIndex(prev => prev - 1)
    }
  }

  // Generate speech for scene
  const handleGenerateSpeech = async () => {
    if (!onGenerateSpeech) return
    setIsGenerating(true)
    try {
      const speechUrl = await onGenerateSpeech(activeUserScene.script)
      setUserScenes(prev => prev.map((scene, idx) =>
        idx === activeSceneIndex
          ? { ...scene, speechUrl, isEdited: true }
          : scene
      ))
    } catch (error) {
      console.error('Speech generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Calculate progress
  const completedScenes = userScenes.filter(s => s.imageUrl).length
  const progress = (completedScenes / template.scenes.length) * 100

  // Export project
  const handleExport = () => {
    const project: UserProject = {
      id: `project-${Date.now()}`,
      templateId: template.id,
      productId: product?.id,
      productName: product?.name,
      scenes: userScenes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ready'
    }
    onExport(project)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{template.emoji}</span>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">{template.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {template.scenes.length} scenes • {template.totalDuration}s total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {completedScenes}/{template.scenes.length}
              </span>
            </div>
            <button
              onClick={handleExport}
              disabled={completedScenes === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Left: Scene List */}
        <div className="border-r border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wide">
            Scenes
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {template.scenes.map((scene, idx) => {
              const userScene = userScenes[idx]
              const hasImage = !!userScene.imageUrl
              return (
                <motion.button
                  key={scene.id}
                  onClick={() => setActiveSceneIndex(idx)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                    activeSceneIndex === idx
                      ? 'bg-white dark:bg-slate-700 shadow-md ring-2 ring-blue-500'
                      : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className={`w-14 h-20 rounded-lg flex-shrink-0 overflow-hidden ${
                    hasImage ? '' : 'bg-slate-200 dark:bg-slate-600'
                  }`}>
                    {hasImage ? (
                      <img
                        src={userScene.imageUrl!}
                        alt={scene.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                      <span className="font-medium text-slate-800 dark:text-white truncate">
                        {scene.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {scene.duration}s • {scene.type}
                    </p>
                    {hasImage && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
                        <Check className="w-3 h-3" /> Ready
                      </span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Center: Main Editor */}
        <div className="p-6">
          {/* Scene Preview */}
          <div className="relative aspect-[9/16] max-h-[500px] mx-auto rounded-2xl overflow-hidden bg-slate-900 shadow-2xl">
            {activeUserScene.imageUrl ? (
              <img
                src={activeUserScene.imageUrl}
                alt={activeScene.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-700/50 flex items-center justify-center mb-4">
                  <ImageIcon className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-slate-400 text-center text-sm mb-2">
                  {activeScene.placeholder.instructions}
                </p>
                <p className="text-slate-500 text-xs">
                  Upload image or generate with AI
                </p>
              </div>
            )}

            {/* Text Overlay Preview */}
            <div className={`absolute inset-x-0 ${
              activeScene.textPosition === 'top' ? 'top-4' :
              activeScene.textPosition === 'bottom' ? 'bottom-4' : 'top-1/2 -translate-y-1/2'
            } px-4`}>
              <motion.p
                key={activeUserScene.script}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center px-3 py-2 rounded-lg ${
                  activeScene.textStyle === 'bold' ? 'text-xl font-bold text-white bg-black/50' :
                  activeScene.textStyle === 'neon' ? 'text-xl font-bold text-white bg-gradient-to-r from-pink-500/80 to-purple-500/80' :
                  activeScene.textStyle === 'gradient' ? 'text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300' :
                  'text-lg text-white/90'
                }`}
              >
                {activeUserScene.script}
              </motion.p>
            </div>

            {/* Duration badge */}
            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {activeScene.duration}s
            </div>

            {/* Scene number */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/20 backdrop-blur text-white text-xs font-bold">
              {activeSceneIndex + 1} / {template.scenes.length}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={goToPrevScene}
              disabled={activeSceneIndex === 0}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Preview All
            </button>
            <button
              onClick={goToNextScene}
              disabled={activeSceneIndex === template.scenes.length - 1}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right: Tools Panel */}
        <div className="border-l border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 text-sm uppercase tracking-wide">
            Scene Tools
          </h3>

          <div className="space-y-4">
            {/* Image Upload */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-slate-700 dark:text-white text-sm">Image</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !onGenerateAI}
                  className="flex-1 py-2 px-3 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  AI
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

            {/* Script Editor */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-slate-700 dark:text-white text-sm">Script</span>
                </div>
                {editingScript !== activeUserScene.id && (
                  <button
                    onClick={startEditingScript}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Edit3 className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>

              {editingScript === activeUserScene.id ? (
                <div className="space-y-2">
                  <textarea
                    value={tempScript}
                    onChange={(e) => setTempScript(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter your script..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveScript}
                      className="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={cancelEditScript}
                      className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                  {activeUserScene.script}
                </p>
              )}
            </div>

            {/* Speech Generator */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-slate-700 dark:text-white text-sm">Speech</span>
              </div>
              <button
                onClick={handleGenerateSpeech}
                disabled={isGenerating || !onGenerateSpeech}
                className="w-full py-2 px-3 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : activeUserScene.speechUrl ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Speech
                  </>
                )}
              </button>
              {activeUserScene.speechUrl && (
                <div className="mt-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Speech ready</span>
                </div>
              )}
            </div>

            {/* Scene Info */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Scene Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Type</span>
                  <span className="text-slate-700 dark:text-white capitalize">{activeScene.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Duration</span>
                  <span className="text-slate-700 dark:text-white">{activeScene.duration}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Transition</span>
                  <span className="text-slate-700 dark:text-white capitalize">{activeScene.transition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Text Style</span>
                  <span className="text-slate-700 dark:text-white capitalize">{activeScene.textStyle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <PreviewPlayer
                scenes={userScenes}
                templateScenes={template.scenes}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Preview Player Component
function PreviewPlayer({
  scenes,
  templateScenes
}: {
  scenes: UserScene[]
  templateScenes: SceneTemplate[]
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto-advance scenes
  useState(() => {
    if (!isPlaying) return

    const currentDuration = templateScenes[currentIndex]?.duration || 3
    const timer = setTimeout(() => {
      if (currentIndex < scenes.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        setCurrentIndex(0) // Loop
      }
    }, currentDuration * 1000)

    return () => clearTimeout(timer)
  })

  const currentScene = scenes[currentIndex]
  const currentTemplate = templateScenes[currentIndex]

  return (
    <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          {currentScene.imageUrl ? (
            <img
              src={currentScene.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-slate-600" />
            </div>
          )}

          {/* Text overlay */}
          <div className={`absolute inset-x-0 ${
            currentTemplate.textPosition === 'top' ? 'top-8' :
            currentTemplate.textPosition === 'bottom' ? 'bottom-8' : 'top-1/2 -translate-y-1/2'
          } px-4`}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xl font-bold text-white bg-black/50 px-4 py-2 rounded-lg"
            >
              {currentScene.script}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex gap-1">
          {scenes.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full ${
                idx === currentIndex ? 'bg-white' :
                idx < currentIndex ? 'bg-white/60' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Play/Pause */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
      >
        {isPlaying ? (
          <Pause className="w-8 h-8 text-white" />
        ) : (
          <Play className="w-8 h-8 text-white ml-1" />
        )}
      </button>
    </div>
  )
}

export default TemplateEditor
