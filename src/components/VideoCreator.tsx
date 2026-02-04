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
  GripVertical
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

interface VideoCreatorProps {
  productImage?: string
  productName?: string
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

export function VideoCreator({ productImage, productName, onExport }: VideoCreatorProps) {
  // Project state
  const [scenes, setScenes] = useState<VideoScene[]>([
    createEmptyVideoScene(0),
    createEmptyVideoScene(1),
    createEmptyVideoScene(2),
  ])
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  // UI state
  const [activeTab, setActiveTab] = useState<'edit' | 'prompts' | 'upload'>('edit')
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const selectedScene = scenes[selectedSceneIndex]
  const totalDuration = calculateTotalDuration(scenes)

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
      if (updates.motionType || updates.duration) {
        updated.videoPrompts = generateVideoPrompts(
          updated.script,
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
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500" />
              Video Creator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {scenes.length} scenes - {totalDuration}s total
            </p>
          </div>
          <div className="flex items-center gap-2">
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

      <div className="flex">
        {/* Scenes List (Left) */}
        <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Scenes</span>
            <button
              onClick={addScene}
              className="p-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
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
                      ? 'bg-white dark:bg-slate-800 shadow-md border-2 border-blue-500'
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
                      {/* Status badge */}
                      <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                        status.color === 'green' ? 'bg-green-500' :
                        status.color === 'blue' ? 'bg-blue-500' : 'bg-slate-400'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Scene {index + 1}
                        </span>
                        <span className="text-xs text-slate-400">{scene.duration}s</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {scene.script || 'No script yet'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          status.color === 'green' ? 'bg-green-100 text-green-700' :
                          status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        </div>

        {/* Main Editor (Center) */}
        <div className="flex-1 p-4">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { id: 'edit', label: 'Edit Scene', icon: Wand2 },
              { id: 'prompts', label: 'Video Prompts', icon: Zap },
              { id: 'upload', label: 'Upload Video', icon: Upload },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Edit Tab */}
            {activeTab === 'edit' && (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Image Section */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Image Preview/Upload */}
                  <div className="aspect-[9/16] max-h-[400px] rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                    {selectedScene.imageUrl ? (
                      <img
                        src={selectedScene.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500">No image yet</p>
                      </div>
                    )}

                    {/* Upload overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
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

                  {/* Scene Settings */}
                  <div className="space-y-4">
                    {/* Script */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Script / Text
                      </label>
                      <textarea
                        value={selectedScene.script}
                        onChange={(e) => updateScene(selectedSceneIndex, { script: e.target.value })}
                        placeholder="Write the script for this scene..."
                        className="w-full h-24 px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 resize-none"
                      />
                      <button className="mt-2 text-xs text-blue-500 flex items-center gap-1 hover:underline">
                        <Sparkles className="w-3 h-3" />
                        Generate with AI
                      </button>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Duration: {selectedScene.duration}s
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={selectedScene.duration}
                        onChange={(e) => updateScene(selectedSceneIndex, { duration: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>1s</span>
                        <span>5s</span>
                        <span>10s</span>
                      </div>
                    </div>

                    {/* Motion Type */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Motion Type
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {MOTION_TYPES.map(motion => (
                          <button
                            key={motion.id}
                            onClick={() => updateScene(selectedSceneIndex, { motionType: motion.id })}
                            className={`p-2 rounded-lg text-center transition-all ${
                              selectedScene.motionType === motion.id
                                ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500'
                                : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                            title={motion.name}
                          >
                            <span className="text-lg">{motion.icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cut Type */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Transition
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {CUT_TYPES.map(cut => (
                          <button
                            key={cut.id}
                            onClick={() => updateScene(selectedSceneIndex, { cutType: cut.id as VideoScene['cutType'] })}
                            className={`p-2 rounded-lg text-xs font-medium transition-all ${
                              selectedScene.cutType === cut.id
                                ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500 text-blue-600'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {cut.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scene Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => duplicateScene(selectedSceneIndex)}
                      className="px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => deleteScene(selectedSceneIndex)}
                      disabled={scenes.length <= 1}
                      className="px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveTab('prompts')}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium flex items-center gap-2"
                  >
                    Get Video Prompts
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Prompts Tab */}
            {activeTab === 'prompts' && (
              <motion.div
                key="prompts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {!selectedScene.imageUrl ? (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      Upload an image first
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      You need to add an image before generating video prompts
                    </p>
                    <button
                      onClick={() => setActiveTab('edit')}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
                    >
                      Go to Edit
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Video Prompts for Scene {selectedSceneIndex + 1}
                      </h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Copy these prompts to generate videos in free tools
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {FREE_VIDEO_TOOLS.map(tool => (
                        <div
                          key={tool.id}
                          className="p-4 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                {tool.name}
                                <a
                                  href={tool.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-600"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </h4>
                              <p className="text-xs text-slate-500">
                                {tool.freeCredits} - {tool.bestFor}
                              </p>
                            </div>
                            <button
                              onClick={() => copyPrompt(tool.id, selectedScene.videoPrompts[tool.id as keyof typeof selectedScene.videoPrompts])}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                                copiedPrompt === tool.id
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              {copiedPrompt === tool.id ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 font-mono">
                            {selectedScene.videoPrompts[tool.id as keyof typeof selectedScene.videoPrompts]}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <button
                        onClick={() => setActiveTab('edit')}
                        className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Edit
                      </button>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium flex items-center gap-2"
                      >
                        Upload Generated Video
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Video for Scene {selectedSceneIndex + 1}
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Upload the video you created using the free tools
                  </p>
                </div>

                {/* Current Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Source Image</span>
                    </div>
                    {selectedScene.imageUrl ? (
                      <img
                        src={selectedScene.imageUrl}
                        alt=""
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-slate-400">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Generated Video</span>
                    </div>
                    {selectedScene.videoUrl ? (
                      <video
                        src={selectedScene.videoUrl}
                        controls
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                    ) : (
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full aspect-video bg-slate-100 dark:bg-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500">Click to upload video</span>
                      </div>
                    )}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Upload Zone */}
                {!selectedScene.videoUrl && (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                  >
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      Drop your video here or click to upload
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      MP4, MOV, or WebM
                    </p>
                  </div>
                )}

                {selectedScene.videoUrl && (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => updateScene(selectedSceneIndex, { videoUrl: null, videoFile: undefined, status: 'image_ready' })}
                      className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Video
                    </button>
                    <button
                      onClick={() => videoInputRef.current?.click()}
                      className="px-4 py-2 text-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Replace Video
                    </button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setActiveTab('prompts')}
                    className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Prompts
                  </button>
                  {selectedSceneIndex < scenes.length - 1 ? (
                    <button
                      onClick={() => {
                        setSelectedSceneIndex(selectedSceneIndex + 1)
                        setActiveTab('edit')
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium flex items-center gap-2"
                    >
                      Next Scene
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onExport?.({
                        id: `project-${Date.now()}`,
                        name: productName || 'Video Project',
                        type: 'video',
                        productName,
                        productImage,
                        aspectRatio: '9:16',
                        scenes,
                        totalDuration,
                        status: 'ready',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      })}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Project
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-blue-500 text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
            00:00 / {String(Math.floor(totalDuration / 60)).padStart(2, '0')}:{String(totalDuration % 60).padStart(2, '0')}
          </span>
        </div>

        {/* Timeline Bar */}
        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex">
          {scenes.map((scene, index) => {
            const widthPercent = (scene.duration / totalDuration) * 100
            const status = getSceneStatus(scene)
            return (
              <div
                key={scene.id}
                onClick={() => setSelectedSceneIndex(index)}
                className={`h-full relative cursor-pointer transition-all ${
                  selectedSceneIndex === index ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ width: `${widthPercent}%` }}
              >
                <div className={`h-full ${
                  status.color === 'green' ? 'bg-green-500' :
                  status.color === 'blue' ? 'bg-blue-500' : 'bg-slate-400'
                }`}>
                  {scene.imageUrl && (
                    <img
                      src={scene.imageUrl}
                      alt=""
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-xs text-white font-medium">
                    {scene.duration}s
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
