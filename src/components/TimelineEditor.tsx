'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, Reorder, useDragControls } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Scissors,
  Copy,
  Trash2,
  GripVertical,
  Clock,
  Music,
  Type,
  Image as ImageIcon,
  Mic,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react'
import { UserScene, SceneTemplate } from '@/types/templates'

interface TimelineEditorProps {
  scenes: UserScene[]
  templateScenes: SceneTemplate[]
  selectedMusic?: {
    id: string
    title: string
    artist: string
    duration: number
    url?: string
  }
  onScenesChange: (scenes: UserScene[]) => void
  onSceneSelect: (index: number) => void
  selectedSceneIndex: number
  onDurationChange: (index: number, duration: number) => void
}

export function TimelineEditor({
  scenes,
  templateScenes,
  selectedMusic,
  onScenesChange,
  onSceneSelect,
  selectedSceneIndex,
  onDurationChange
}: TimelineEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [zoom, setZoom] = useState(1) // pixels per second
  const [isMuted, setIsMuted] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const playheadRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Calculate total duration
  const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0)

  // Calculate scene start times
  const sceneStartTimes = scenes.reduce<number[]>((acc, scene, idx) => {
    if (idx === 0) return [0]
    return [...acc, acc[idx - 1] + scenes[idx - 1].duration]
  }, [0])

  // Pixels per second for timeline
  const pxPerSecond = 40 * zoom

  // Play/Pause animation
  useEffect(() => {
    if (isPlaying) {
      const startTime = performance.now() - (currentTime * 1000)

      const animate = () => {
        const elapsed = (performance.now() - startTime) / 1000
        if (elapsed >= totalDuration) {
          setCurrentTime(0)
          setIsPlaying(false)
          return
        }
        setCurrentTime(elapsed)
        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, totalDuration])

  // Find current scene based on time
  const getCurrentSceneIndex = useCallback(() => {
    let accTime = 0
    for (let i = 0; i < scenes.length; i++) {
      accTime += scenes[i].duration
      if (currentTime < accTime) return i
    }
    return scenes.length - 1
  }, [currentTime, scenes])

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const time = x / pxPerSecond
    setCurrentTime(Math.max(0, Math.min(time, totalDuration)))
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 10)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`
  }

  // Reorder scenes
  const handleReorder = (newOrder: UserScene[]) => {
    onScenesChange(newOrder)
  }

  // Duplicate scene
  const duplicateScene = (index: number) => {
    const sceneToDuplicate = scenes[index]
    const newScene: UserScene = {
      ...sceneToDuplicate,
      id: `${sceneToDuplicate.id}-copy-${Date.now()}`
    }
    const newScenes = [...scenes]
    newScenes.splice(index + 1, 0, newScene)
    onScenesChange(newScenes)
  }

  // Delete scene
  const deleteScene = (index: number) => {
    if (scenes.length <= 1) return
    const newScenes = scenes.filter((_, i) => i !== index)
    onScenesChange(newScenes)
    if (selectedSceneIndex >= newScenes.length) {
      onSceneSelect(newScenes.length - 1)
    }
  }

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden">
      {/* Timeline Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentTime(0)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={() => setCurrentTime(totalDuration)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 font-mono text-sm">
            <span className="text-white">{formatTime(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTime(totalDuration)}</span>
          </div>

          {/* Volume */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Ruler */}
      <div className="px-4 py-2 border-b border-slate-800 overflow-x-auto">
        <div
          className="relative h-6"
          style={{ width: `${totalDuration * pxPerSecond}px`, minWidth: '100%' }}
        >
          {/* Time markers */}
          {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${i * pxPerSecond}px` }}
            >
              <div className="w-px h-3 bg-slate-600" />
              <span className="text-[10px] text-slate-500 mt-0.5">{i}s</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Tracks */}
      <div
        ref={timelineRef}
        className="relative px-4 py-4 overflow-x-auto cursor-pointer"
        onClick={handleTimelineClick}
        style={{ minHeight: '200px' }}
      >
        <div
          className="relative"
          style={{ width: `${totalDuration * pxPerSecond}px`, minWidth: '100%' }}
        >
          {/* Video Track */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-slate-400">Scenes</span>
            </div>
            <Reorder.Group
              axis="x"
              values={scenes}
              onReorder={handleReorder}
              className="flex gap-1"
            >
              {scenes.map((scene, idx) => {
                const template = templateScenes[idx]
                return (
                  <Reorder.Item
                    key={scene.id}
                    value={scene}
                    className="relative"
                    style={{ width: `${scene.duration * pxPerSecond}px` }}
                  >
                    <motion.div
                      onClick={(e) => {
                        e.stopPropagation()
                        onSceneSelect(idx)
                      }}
                      className={`h-20 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedSceneIndex === idx
                          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900'
                          : 'hover:ring-2 hover:ring-slate-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      {scene.imageUrl ? (
                        <img
                          src={scene.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-slate-500" />
                        </div>
                      )}
                      {/* Scene overlay info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="absolute bottom-1 left-1 right-1">
                          <p className="text-[10px] font-medium text-white truncate">
                            {template?.name || `Scene ${idx + 1}`}
                          </p>
                          <p className="text-[9px] text-slate-400">{scene.duration}s</p>
                        </div>
                      </div>
                      {/* Drag handle */}
                      <div className="absolute top-1 left-1 p-0.5 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-3 h-3 text-white" />
                      </div>
                    </motion.div>

                    {/* Duration handle */}
                    <div
                      className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/50 transition-colors"
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        const startX = e.clientX
                        const startDuration = scene.duration

                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const diff = (moveEvent.clientX - startX) / pxPerSecond
                          const newDuration = Math.max(1, Math.round((startDuration + diff) * 2) / 2)
                          onDurationChange(idx, newDuration)
                        }

                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove)
                          document.removeEventListener('mouseup', handleMouseUp)
                        }

                        document.addEventListener('mousemove', handleMouseMove)
                        document.addEventListener('mouseup', handleMouseUp)
                      }}
                    />
                  </Reorder.Item>
                )
              })}
            </Reorder.Group>
          </div>

          {/* Audio Track */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-medium text-slate-400">Speech</span>
            </div>
            <div className="flex gap-1">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  className={`h-10 rounded-lg ${
                    scene.speechUrl
                      ? 'bg-gradient-to-r from-orange-500/30 to-orange-600/30 border border-orange-500/50'
                      : 'bg-slate-800/50 border border-slate-700'
                  }`}
                  style={{ width: `${scene.duration * pxPerSecond}px` }}
                >
                  {scene.speechUrl && (
                    <div className="h-full px-2 flex items-center">
                      <div className="flex gap-0.5 h-4">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-orange-400/60 rounded-full"
                            style={{ height: `${20 + Math.random() * 80}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Music Track */}
          {selectedMusic && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-slate-400">Music</span>
              </div>
              <div
                className="h-10 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/50"
                style={{ width: `${Math.min(selectedMusic.duration, totalDuration) * pxPerSecond}px` }}
              >
                <div className="h-full px-2 flex items-center gap-2">
                  <Music className="w-3 h-3 text-purple-400" />
                  <span className="text-[10px] text-purple-300 truncate">
                    {selectedMusic.title} - {selectedMusic.artist}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Playhead */}
          <div
            ref={playheadRef}
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
            style={{ left: `${currentTime * pxPerSecond}px` }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Scene Actions */}
      {selectedSceneIndex >= 0 && (
        <div className="px-4 py-3 border-t border-slate-700 flex items-center gap-2">
          <span className="text-xs text-slate-500 mr-2">Scene {selectedSceneIndex + 1}</span>
          <button
            onClick={() => duplicateScene(selectedSceneIndex)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3 h-3" />
            Duplicate
          </button>
          <button
            onClick={() => deleteScene(selectedSceneIndex)}
            disabled={scenes.length <= 1}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Duration:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDurationChange(selectedSceneIndex, Math.max(1, scenes[selectedSceneIndex].duration - 0.5))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-10 text-center text-sm text-white font-mono">
                {scenes[selectedSceneIndex].duration}s
              </span>
              <button
                onClick={() => onDurationChange(selectedSceneIndex, scenes[selectedSceneIndex].duration + 0.5)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimelineEditor
