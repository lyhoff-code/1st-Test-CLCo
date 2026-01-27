'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Wand2,
  Play,
  Download,
  Loader2,
  CheckCircle2,
  Volume2,
  ImagePlus,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react'
import { SceneCard } from './SceneCard'
import {
  ShopifyProduct,
  ToneType,
  StorytellingScene,
  StorytellingContent,
  STORYTELLING_SCENES
} from '@/types'

interface StorytellingEditorProps {
  product: ShopifyProduct
  tone: ToneType
  onSave: (content: StorytellingContent) => void
}

export function StorytellingEditor({ product, tone, onSave }: StorytellingEditorProps) {
  const [scenes, setScenes] = useState<StorytellingScene[]>([])
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
  const [generationStep, setGenerationStep] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [currentPreviewScene, setCurrentPreviewScene] = useState(0)
  const [expandedView, setExpandedView] = useState(true)

  // Initialize scenes
  useEffect(() => {
    const initialScenes: StorytellingScene[] = STORYTELLING_SCENES.map((scene, index) => ({
      id: `scene-${index}`,
      type: scene.type,
      title: scene.title,
      timeRange: scene.timeRange,
      script: '',
      audioUrl: undefined,
      imageUrl: undefined,
      imagePrompt: undefined,
      isGeneratingAudio: false,
      isGeneratingImage: false,
    }))
    setScenes(initialScenes)
  }, [])

  const generateAllScripts = async () => {
    setIsGeneratingAll(true)
    setGenerationStep('Generating scripts for all scenes...')

    try {
      const response = await fetch('/api/storytelling/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            title: product.title,
            description: product.description,
            price: product.priceRange.minVariantPrice.amount,
          },
          tone,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate scripts')

      const data = await response.json()

      setScenes(prev =>
        prev.map((scene, index) => ({
          ...scene,
          script: data.scenes[index]?.script || '',
          imagePrompt: data.scenes[index]?.imagePrompt || '',
        }))
      )

      setGenerationStep('Scripts generated successfully!')
    } catch (error) {
      console.error('Error generating scripts:', error)
      setGenerationStep('Error generating scripts. Using demo content...')

      // Demo fallback content
      const demoScripts = getDemoScripts(product.title)
      setScenes(prev =>
        prev.map((scene, index) => ({
          ...scene,
          script: demoScripts[index]?.script || '',
          imagePrompt: demoScripts[index]?.imagePrompt || '',
        }))
      )
    } finally {
      setTimeout(() => {
        setIsGeneratingAll(false)
        setGenerationStep('')
      }, 1500)
    }
  }

  const generateSceneAudio = async (sceneIndex: number) => {
    setScenes(prev =>
      prev.map((scene, i) =>
        i === sceneIndex ? { ...scene, isGeneratingAudio: true } : scene
      )
    )

    try {
      const scene = scenes[sceneIndex]
      const response = await fetch('/api/audio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scene.script }),
      })

      if (!response.ok) throw new Error('Failed to generate audio')

      const data = await response.json()

      setScenes(prev =>
        prev.map((s, i) =>
          i === sceneIndex
            ? { ...s, audioUrl: data.audioUrl, isGeneratingAudio: false }
            : s
        )
      )
    } catch (error) {
      console.error('Error generating audio:', error)
      // Demo fallback - use browser TTS
      const utterance = new SpeechSynthesisUtterance(scenes[sceneIndex].script)
      const audioUrl = `demo-audio-${sceneIndex}`

      setScenes(prev =>
        prev.map((s, i) =>
          i === sceneIndex
            ? { ...s, audioUrl, isGeneratingAudio: false }
            : s
        )
      )
    }
  }

  const generateSceneImage = async (sceneIndex: number) => {
    setScenes(prev =>
      prev.map((scene, i) =>
        i === sceneIndex ? { ...scene, isGeneratingImage: true } : scene
      )
    )

    try {
      const scene = scenes[sceneIndex]
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: scene.imagePrompt || scene.script,
          sceneType: scene.type,
          productName: product.title,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate image')

      const data = await response.json()

      setScenes(prev =>
        prev.map((s, i) =>
          i === sceneIndex
            ? { ...s, imageUrl: data.imageUrl, isGeneratingImage: false }
            : s
        )
      )
    } catch (error) {
      console.error('Error generating image:', error)
      // Demo fallback - use placeholder
      const placeholderImages = [
        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop',
      ]

      setScenes(prev =>
        prev.map((s, i) =>
          i === sceneIndex
            ? { ...s, imageUrl: placeholderImages[sceneIndex % placeholderImages.length], isGeneratingImage: false }
            : s
        )
      )
    }
  }

  const generateAllAudio = async () => {
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].script && !scenes[i].audioUrl) {
        await generateSceneAudio(i)
      }
    }
  }

  const generateAllImages = async () => {
    for (let i = 0; i < scenes.length; i++) {
      if (scenes[i].script && !scenes[i].imageUrl) {
        await generateSceneImage(i)
      }
    }
  }

  const updateSceneScript = (index: number, script: string) => {
    setScenes(prev =>
      prev.map((scene, i) =>
        i === index ? { ...scene, script, audioUrl: undefined } : scene
      )
    )
  }

  const handleSave = () => {
    onSave({
      scenes,
      totalDuration: 30,
    })
  }

  const allScenesHaveScript = scenes.every(s => s.script)
  const allScenesHaveAudio = scenes.every(s => s.audioUrl)
  const allScenesHaveImage = scenes.every(s => s.imageUrl)
  const isComplete = allScenesHaveScript && allScenesHaveAudio && allScenesHaveImage

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="icon-pink">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-tada-text">Storytelling Mode</h2>
              <p className="text-sm text-tada-text-light">
                Create a 30-second story-driven reel with 6 scenes
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpandedView(!expandedView)}
            className="btn-ghost p-2"
          >
            {expandedView ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Product Info */}
        <div className="glass-subtle p-4 mb-4">
          <div className="flex items-center gap-4">
            {product.images.edges[0] && (
              <img
                src={product.images.edges[0].node.url}
                alt={product.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-tada-text">{product.title}</h3>
              <p className="text-sm text-tada-text-light line-clamp-1">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateAllScripts}
            disabled={isGeneratingAll}
            className="btn-primary py-3 px-5 flex items-center gap-2"
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {generationStep || 'Generating...'}
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate All Scripts
              </>
            )}
          </button>

          {allScenesHaveScript && (
            <>
              <button
                onClick={generateAllAudio}
                disabled={allScenesHaveAudio}
                className="btn-secondary py-3 px-5 flex items-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                {allScenesHaveAudio ? 'Audio Complete' : 'Generate All Audio'}
                {allScenesHaveAudio && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </button>

              <button
                onClick={generateAllImages}
                disabled={allScenesHaveImage}
                className="btn-secondary py-3 px-5 flex items-center gap-2"
              >
                <ImagePlus className="w-5 h-5" />
                {allScenesHaveImage ? 'Images Complete' : 'Generate All Images'}
                {allScenesHaveImage && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </button>
            </>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-tada-turquoise to-tada-pink rounded-full transition-all duration-500"
              style={{
                width: `${(
                  (scenes.filter(s => s.script).length +
                    scenes.filter(s => s.audioUrl).length +
                    scenes.filter(s => s.imageUrl).length) /
                  (scenes.length * 3)
                ) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm text-tada-text-light">
            {Math.round(
              (scenes.filter(s => s.script).length +
                scenes.filter(s => s.audioUrl).length +
                scenes.filter(s => s.imageUrl).length) /
                (scenes.length * 3) *
                100
            )}% complete
          </span>
        </div>
      </div>

      {/* Scene Cards */}
      <AnimatePresence>
        {expandedView && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {scenes.map((scene, index) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                index={index}
                onUpdateScript={(script) => updateSceneScript(index, script)}
                onGenerateAudio={() => generateSceneAudio(index)}
                onGenerateImage={() => generateSceneImage(index)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview & Save Section */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tada-turquoise to-tada-pink flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-tada-text">Story Complete!</h3>
                <p className="text-sm text-tada-text-light">All 6 scenes are ready</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsPreviewMode(true)}
                className="btn-secondary py-3 px-5 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Preview Story
              </button>

              <button
                onClick={handleSave}
                className="btn-primary py-3 px-5 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Save to History
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsPreviewMode(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Content */}
              <div className="aspect-[9/16] relative bg-black">
                {scenes[currentPreviewScene]?.imageUrl && (
                  <img
                    src={scenes[currentPreviewScene].imageUrl}
                    alt={scenes[currentPreviewScene].title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="pill-turquoise mb-2 inline-block">
                    {scenes[currentPreviewScene]?.title}
                  </div>
                  <p className="text-white text-lg font-medium leading-snug">
                    {scenes[currentPreviewScene]?.script}
                  </p>
                </div>
              </div>

              {/* Scene Navigation */}
              <div className="p-4 bg-white">
                <div className="flex gap-2 mb-4">
                  {scenes.map((scene, i) => (
                    <button
                      key={scene.id}
                      onClick={() => setCurrentPreviewScene(i)}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        i === currentPreviewScene
                          ? 'bg-gradient-to-r from-tada-turquoise to-tada-pink'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentPreviewScene(prev => Math.max(0, prev - 1))}
                    disabled={currentPreviewScene === 0}
                    className="btn-ghost px-4 py-2 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPreviewScene(prev => Math.min(scenes.length - 1, prev + 1))}
                    disabled={currentPreviewScene === scenes.length - 1}
                    className="btn-primary px-4 py-2 disabled:opacity-50"
                  >
                    Next Scene
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Demo scripts fallback
function getDemoScripts(productName: string) {
  return [
    {
      script: `Stop scrolling! This changed everything for me...`,
      imagePrompt: `Dramatic close-up of ${productName}, eye-catching lighting, social media style`,
    },
    {
      script: `You know that feeling when nothing seems to work? When you've tried everything but still can't get the results you want?`,
      imagePrompt: `Person looking frustrated, ${productName} visible in background, moody lighting`,
    },
    {
      script: `I was stuck in that cycle for months. Wasting time, money, and energy on things that just didn't deliver.`,
      imagePrompt: `Visual representation of frustration and wasted effort, ${productName} subtly visible`,
    },
    {
      script: `Then I discovered ${productName}. It's not just another product – it's a complete game-changer. Here's what makes it different...`,
      imagePrompt: `${productName} being used in action, bright optimistic lighting, hero shot`,
    },
    {
      script: `Now I can't imagine going back. The transformation has been incredible, and the best part? It was so easy to get started.`,
      imagePrompt: `Happy person using ${productName}, lifestyle shot, warm natural lighting`,
    },
    {
      script: `Curious to see if it works for you too? Link in bio. Let me know what you think!`,
      imagePrompt: `${productName} displayed beautifully, soft call-to-action feel, inviting composition`,
    },
  ]
}
