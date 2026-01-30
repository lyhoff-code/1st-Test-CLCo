'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  AlertCircle,
  Flame,
  Lightbulb,
  Sparkles,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  ImagePlus,
  Edit3,
  Check,
  X,
  Loader2,
  Clock,
  RefreshCw
} from 'lucide-react'
import { StorytellingScene, StorytellingSceneType } from '@/types'

interface SceneCardProps {
  scene: StorytellingScene
  index: number
  onUpdateScript: (script: string) => void
  onGenerateAudio: () => void
  onGenerateImage: () => void
}

const SCENE_ICONS: Record<StorytellingSceneType, typeof Zap> = {
  hook: Zap,
  problem: AlertCircle,
  agitation: Flame,
  solution: Lightbulb,
  result: Sparkles,
  cta: MessageCircle,
}

const SCENE_COLORS: Record<StorytellingSceneType, { bg: string; border: string; icon: string; glow: string }> = {
  hook: { bg: 'bg-databake-turquoise/20', border: 'border-databake-turquoise', icon: 'text-databake-turquoise-dark', glow: 'glow-turquoise' },
  problem: { bg: 'bg-databake-pink/20', border: 'border-databake-pink', icon: 'text-databake-pink-dark', glow: 'glow-pink' },
  agitation: { bg: 'bg-orange-100', border: 'border-orange-300', icon: 'text-orange-500', glow: 'shadow-orange-200/50' },
  solution: { bg: 'bg-databake-turquoise/20', border: 'border-databake-turquoise', icon: 'text-databake-turquoise-dark', glow: 'glow-turquoise' },
  result: { bg: 'bg-databake-pink/20', border: 'border-databake-pink', icon: 'text-databake-pink-dark', glow: 'glow-pink' },
  cta: { bg: 'bg-purple-100', border: 'border-purple-300', icon: 'text-purple-500', glow: 'shadow-purple-200/50' },
}

export function SceneCard({ scene, index, onUpdateScript, onGenerateAudio, onGenerateImage }: SceneCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedScript, setEditedScript] = useState(scene.script)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const Icon = SCENE_ICONS[scene.type]
  const colors = SCENE_COLORS[scene.type]

  const handleSaveEdit = () => {
    onUpdateScript(editedScript)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedScript(scene.script)
    setIsEditing(false)
  }

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass p-5 border-l-4 ${colors.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          </div>
          <div>
            <h3 className="font-semibold text-databake-text flex items-center gap-2">
              <span className="text-databake-text-light text-sm">{index + 1}.</span>
              {scene.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-databake-text-light">
              <Clock className="w-3 h-3" />
              {scene.timeRange}
            </div>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-ghost p-2"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Script Section */}
      <div className="mb-4">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <textarea
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                className="input-field min-h-[100px] resize-none"
                placeholder="Enter the script for this scene..."
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSaveEdit}
                  className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-subtle p-4 text-sm text-databake-text leading-relaxed"
            >
              {scene.script || <span className="text-databake-text-light italic">No script generated yet</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audio Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          {scene.audioUrl ? (
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAudioPlayback}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isPlaying
                    ? 'bg-databake-pink text-white'
                    : 'bg-databake-turquoise/20 text-databake-turquoise-dark hover:bg-databake-turquoise/30'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5" fill="currentColor" />
                )}
              </button>
              <div className="flex-1">
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-databake-turquoise to-databake-pink rounded-full"
                    style={{ width: isPlaying ? '100%' : '0%', transition: 'width 3s linear' }}
                  />
                </div>
                <p className="text-xs text-databake-text-light mt-1 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  Audio ready
                </p>
              </div>
              <audio
                ref={audioRef}
                src={scene.audioUrl}
                onEnded={handleAudioEnded}
                className="hidden"
              />
            </div>
          ) : (
            <button
              onClick={onGenerateAudio}
              disabled={!scene.script || scene.isGeneratingAudio}
              className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scene.isGeneratingAudio ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating voice...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Generate Voice
                </>
              )}
            </button>
          )}
        </div>
        {scene.audioUrl && (
          <button
            onClick={onGenerateAudio}
            disabled={scene.isGeneratingAudio}
            className="btn-ghost p-2"
            title="Regenerate audio"
          >
            <RefreshCw className={`w-4 h-4 ${scene.isGeneratingAudio ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Image Section */}
      <div>
        {scene.imageUrl ? (
          <div className="relative group">
            <img
              src={scene.imageUrl}
              alt={`Scene: ${scene.title}`}
              className="w-full h-48 object-cover rounded-2xl shadow-glass"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3">
              <button
                onClick={onGenerateImage}
                disabled={scene.isGeneratingImage}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${scene.isGeneratingImage ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>
            {scene.isGeneratingImage && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-databake-turquoise" />
                  <span className="text-sm text-databake-text">Generating image...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onGenerateImage}
            disabled={!scene.script || scene.isGeneratingImage}
            className="w-full h-32 border-2 border-dashed border-databake-text-light/30 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-databake-turquoise hover:bg-databake-turquoise/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scene.isGeneratingImage ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-databake-turquoise" />
                <span className="text-sm text-databake-text-light">Generating AI image...</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-databake-text-light" />
                <span className="text-sm text-databake-text-light">Generate AI Image</span>
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}
