'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileVideo,
  Image as ImageIcon,
  Loader2,
  Mic,
  MicOff,
  Music,
  Package,
  Play,
  Plus,
  RefreshCw,
  Save,
  Send,
  Settings,
  Sparkles,
  Square,
  Upload,
  Volume2,
  VolumeX,
  Wand2,
  X,
  Instagram,
  Youtube,
  Facebook,
} from 'lucide-react'
import {
  PipelineProject,
  CutPrompts,
  CutAssets,
  FavoriteTemplate,
  VideoStructureType,
  VIDEO_STRUCTURES,
  EXTERNAL_TOOLS,
  SOCIAL_PLATFORMS,
  ProductCaptions,
  PlatformCaption,
} from '@/types/pipeline'
import { ShopifyProduct } from '@/types'

// ============================================
// TYPES & CONSTANTS
// ============================================

interface ContentPipelineProps {
  products: ShopifyProduct[]
  onBack?: () => void
}

type PipelineStep = 'config' | 'prompts' | 'assets' | 'publish'

const STEPS: { key: PipelineStep; label: string; number: number }[] = [
  { key: 'config', label: 'Config', number: 1 },
  { key: 'prompts', label: 'Prompts', number: 2 },
  { key: 'assets', label: 'Assets', number: 3 },
  { key: 'publish', label: 'Publish', number: 4 },
]

const stepVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
}

function createEmptyProject(): PipelineProject {
  return {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    product: null,
    template: null,
    totalCuts: 0,
    videoStructure: null,
    cutPrompts: [],
    cutAssets: [],
    status: 'config',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function getProductImage(product: ShopifyProduct): string {
  return product.images?.edges?.[0]?.node?.url || ''
}

function getProductPrice(product: ShopifyProduct): string {
  const amount = product.priceRange?.minVariantPrice?.amount || '0'
  const currency = product.priceRange?.minVariantPrice?.currencyCode || 'USD'
  return `${parseFloat(amount).toFixed(2)} ${currency}`
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ContentPipeline({ products, onBack }: ContentPipelineProps) {
  // --- Global State ---
  const [currentStep, setCurrentStep] = useState<PipelineStep>('config')
  const [project, setProject] = useState<PipelineProject>(createEmptyProject)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // --- Step 1 State ---
  const [savedTemplates, setSavedTemplates] = useState<FavoriteTemplate[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualCuts, setManualCuts] = useState(4)
  const [manualCutNames, setManualCutNames] = useState<string[]>([])

  // --- Step 2 State ---
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [expandedCuts, setExpandedCuts] = useState<Record<number, boolean>>({})
  const [editingField, setEditingField] = useState<{ cutIndex: number; field: string } | null>(null)
  const [copiedField, setCopiedField] = useState<{ cutIndex: number; field: string } | null>(null)

  // --- Step 3 State ---
  const [generatingAudio, setGeneratingAudio] = useState<Record<number, boolean>>({})
  const [audioPlayers, setAudioPlayers] = useState<Record<number, string>>({})
  const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const videoInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  // --- Step 4 State ---
  const [productCaptions, setProductCaptions] = useState<ProductCaptions | null>(null)
  const [loadingCaptions, setLoadingCaptions] = useState(false)
  const [finalVideoFile, setFinalVideoFile] = useState<File | null>(null)
  const [finalVideoPreview, setFinalVideoPreview] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const finalVideoInputRef = useRef<HTMLInputElement | null>(null)

  // --- Toast Helper ---
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // --- Fetch templates on mount ---
  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const res = await fetch('/api/templates')
      const data = await res.json()
      setSavedTemplates(data.templates || [])
    } catch {
      setSavedTemplates([])
    } finally {
      setLoadingTemplates(false)
    }
  }

  // --- Step helpers ---
  const currentStepIndex = STEPS.findIndex(s => s.key === currentStep)

  const goToStep = (step: PipelineStep) => {
    setCurrentStep(step)
    setProject(prev => ({ ...prev, status: step, updatedAt: new Date().toISOString() }))
  }

  const canProceedFromConfig = () => {
    return (
      project.product !== null &&
      (project.totalCuts > 0) &&
      (project.videoStructure !== null)
    )
  }

  // --- Manual cut names ---
  useEffect(() => {
    if (manualMode) {
      const names = Array.from({ length: manualCuts }, (_, i) => {
        if (manualCutNames[i]) return manualCutNames[i]
        if (i === 0) return 'Hook'
        if (i === manualCuts - 1) return 'CTA'
        return `Cut ${i + 1}`
      })
      setManualCutNames(names)
    }
  }, [manualCuts, manualMode])

  // ============================================
  // STEP 1 HANDLERS
  // ============================================

  const selectProduct = (product: ShopifyProduct) => {
    setProject(prev => ({ ...prev, product, productId: product.id }))
  }

  const selectTemplate = (template: FavoriteTemplate) => {
    setManualMode(false)
    const cutNames = template.cuts.map(c => c.name)
    setProject(prev => ({
      ...prev,
      template,
      templateId: template.id,
      totalCuts: template.totalCuts,
    }))
    setManualCutNames(cutNames)
  }

  const selectVideoStructure = (structure: VideoStructureType) => {
    const label = VIDEO_STRUCTURES.find(v => v.value === structure)?.label || structure
    setProject(prev => ({
      ...prev,
      videoStructure: structure,
      videoStructureLabel: label,
    }))
  }

  const handleManualModeToggle = () => {
    setManualMode(true)
    setProject(prev => ({
      ...prev,
      template: null,
      templateId: undefined,
      totalCuts: manualCuts,
    }))
  }

  const updateManualCuts = (n: number) => {
    const clamped = Math.max(2, Math.min(12, n))
    setManualCuts(clamped)
    setProject(prev => ({ ...prev, totalCuts: clamped }))
  }

  const handleGeneratePrompts = async () => {
    if (!canProceedFromConfig()) return

    const product = project.product!
    const totalCuts = manualMode ? manualCuts : (project.template?.totalCuts || manualCuts)
    const cutNames = manualMode
      ? manualCutNames.slice(0, totalCuts)
      : (project.template?.cuts.map(c => c.name) || manualCutNames.slice(0, totalCuts))

    setProject(prev => ({ ...prev, totalCuts }))
    goToStep('prompts')
    setIsGeneratingPrompts(true)
    setGenerationProgress(0)

    // Animate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90 }
        return prev + Math.random() * 15
      })
    }, 400)

    try {
      const res = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.title,
          productDescription: product.description,
          totalCuts,
          videoStructure: project.videoStructure || 'other',
          cutNames,
          hasVoice: project.template?.hasVoice ?? true,
        }),
      })

      const data = await res.json()
      clearInterval(progressInterval)
      setGenerationProgress(100)

      if (data.prompts && Array.isArray(data.prompts)) {
        const prompts: CutPrompts[] = data.prompts.map((p: CutPrompts, i: number) => ({
          cutIndex: i,
          cutName: p.cutName || cutNames[i] || `Cut ${i + 1}`,
          imagePrompt: p.imagePrompt || '',
          animationPrompt: p.animationPrompt || '',
          speechText: p.speechText || '',
          hasVoice: p.hasVoice ?? true,
        }))

        const assets: CutAssets[] = prompts.map((_, i) => ({
          cutIndex: i,
          audioGenerated: false,
          imageUploaded: false,
          videoUploaded: false,
        }))

        setProject(prev => ({
          ...prev,
          cutPrompts: prompts,
          cutAssets: assets,
          totalCuts: prompts.length,
        }))

        // Expand all cuts
        const expanded: Record<number, boolean> = {}
        prompts.forEach((_, i) => { expanded[i] = true })
        setExpandedCuts(expanded)
      }

      setTimeout(() => setIsGeneratingPrompts(false), 500)
    } catch (error) {
      clearInterval(progressInterval)
      setIsGeneratingPrompts(false)
      showToast('Failed to generate prompts. Please try again.', 'error')
      goToStep('config')
    }
  }

  // ============================================
  // STEP 2 HANDLERS
  // ============================================

  const toggleCutExpanded = (index: number) => {
    setExpandedCuts(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const updateCutPrompt = (cutIndex: number, field: keyof CutPrompts, value: string | boolean) => {
    setProject(prev => ({
      ...prev,
      cutPrompts: prev.cutPrompts.map(cp =>
        cp.cutIndex === cutIndex ? { ...cp, [field]: value } : cp
      ),
    }))
  }

  const copyToClipboard = async (text: string, cutIndex: number, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField({ cutIndex, field })
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      showToast('Failed to copy', 'error')
    }
  }

  const openExternalTool = (prompt: string) => {
    window.open(EXTERNAL_TOOLS.grokImagine, '_blank')
  }

  // ============================================
  // STEP 3 HANDLERS
  // ============================================

  const handleImageUpload = (cutIndex: number, file: File) => {
    const url = URL.createObjectURL(file)
    setProject(prev => ({
      ...prev,
      cutAssets: prev.cutAssets.map(ca =>
        ca.cutIndex === cutIndex
          ? { ...ca, imageFile: url, imageUploaded: true }
          : ca
      ),
    }))
    showToast(`Image uploaded for Cut ${cutIndex + 1}`)
  }

  const handleVideoUpload = (cutIndex: number, file: File) => {
    const url = URL.createObjectURL(file)
    setProject(prev => ({
      ...prev,
      cutAssets: prev.cutAssets.map(ca =>
        ca.cutIndex === cutIndex
          ? { ...ca, videoFile: url, videoUploaded: true }
          : ca
      ),
    }))
    showToast(`Video uploaded for Cut ${cutIndex + 1}`)
  }

  const handleGenerateAudio = async (cutIndex: number) => {
    const cut = project.cutPrompts.find(c => c.cutIndex === cutIndex)
    if (!cut || !cut.speechText) return

    setGeneratingAudio(prev => ({ ...prev, [cutIndex]: true }))

    try {
      const res = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cut.speechText }),
      })

      const data = await res.json()

      if (data.audioUrl) {
        setAudioPlayers(prev => ({ ...prev, [cutIndex]: data.audioUrl }))
        setProject(prev => ({
          ...prev,
          cutAssets: prev.cutAssets.map(ca =>
            ca.cutIndex === cutIndex
              ? { ...ca, audioUrl: data.audioUrl, audioGenerated: true }
              : ca
          ),
        }))
        showToast(`Audio generated for Cut ${cutIndex + 1}`)
      } else if (data.useBrowserTTS) {
        // Fallback: use browser TTS
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(cut.speechText)
          window.speechSynthesis.speak(utterance)
        }
        setProject(prev => ({
          ...prev,
          cutAssets: prev.cutAssets.map(ca =>
            ca.cutIndex === cutIndex
              ? { ...ca, audioGenerated: true }
              : ca
          ),
        }))
        showToast('Audio generated using browser TTS (ElevenLabs not configured)')
      }
    } catch {
      showToast('Failed to generate audio', 'error')
    } finally {
      setGeneratingAudio(prev => ({ ...prev, [cutIndex]: false }))
    }
  }

  const getCutCompletionStatus = (cutIndex: number) => {
    const asset = project.cutAssets.find(a => a.cutIndex === cutIndex)
    if (!asset) return { image: false, video: false, audio: false, total: 0, max: 3 }
    const prompt = project.cutPrompts.find(p => p.cutIndex === cutIndex)
    const needsAudio = prompt?.hasVoice ?? true
    const total = (asset.imageUploaded ? 1 : 0) + (asset.videoUploaded ? 1 : 0) + (!needsAudio || asset.audioGenerated ? 1 : 0)
    return {
      image: asset.imageUploaded,
      video: asset.videoUploaded,
      audio: !needsAudio || asset.audioGenerated,
      total,
      max: 3,
    }
  }

  const getOverallAssetProgress = () => {
    if (project.cutAssets.length === 0) return 0
    let completed = 0
    let total = 0
    project.cutAssets.forEach((_, i) => {
      const status = getCutCompletionStatus(i)
      completed += status.total
      total += status.max
    })
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const allVideosUploaded = () => {
    return project.cutAssets.every(a => a.videoUploaded)
  }

  // ============================================
  // STEP 4 HANDLERS
  // ============================================

  useEffect(() => {
    if (currentStep === 'publish' && project.product) {
      loadCaptions()
    }
  }, [currentStep, project.product])

  const loadCaptions = async () => {
    if (!project.product) return
    setLoadingCaptions(true)
    try {
      const res = await fetch('/api/captions')
      const data = await res.json()
      const captions = (data.captions || []) as ProductCaptions[]
      const match = captions.find(c => c.productId === project.product?.id)
      if (match) {
        setProductCaptions(match)
      }
    } catch {
      // No captions available
    } finally {
      setLoadingCaptions(false)
    }
  }

  const handleFinalVideoUpload = (file: File) => {
    setFinalVideoFile(file)
    setFinalVideoPreview(URL.createObjectURL(file))
    showToast('Final video uploaded')
  }

  const handlePublish = async () => {
    setPublishing(true)
    // Simulate publishing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPublishing(false)
    showToast('Published to all networks successfully!')
  }

  const downloadAsset = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  // ============================================
  // PROGRESS BAR COMPONENT
  // ============================================

  const ProgressBar = () => (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-[#A8E6E1] transition-all duration-700 ease-out"
          style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex
          const isActive = idx === currentStepIndex
          const isFuture = idx > currentStepIndex

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center cursor-pointer"
              onClick={() => {
                if (isCompleted || isActive) goToStep(step.key)
              }}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#A8E6E1] text-gray-900'
                    : isActive
                    ? 'bg-[#A8E6E1]/20 border-2 border-[#A8E6E1] text-[#A8E6E1]'
                    : 'bg-white/5 border border-white/20 text-white/40'
                }`}
                whileHover={!isFuture ? { scale: 1.1 } : {}}
                whileTap={!isFuture ? { scale: 0.95 } : {}}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-[#A8E6E1]'
                    : isCompleted
                    ? 'text-[#A8E6E1]/70'
                    : 'text-white/40'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ============================================
  // STEP 1 — CONFIGURATION
  // ============================================

  const StepConfig = () => (
    <motion.div
      key="step-config"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-8"
    >
      {/* Section: Select Product */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#A8E6E1]" />
          Select Product
        </h3>
        <p className="text-white/50 text-sm mb-4">Choose the product for today&apos;s content</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map(prod => {
            const isSelected = project.product?.id === prod.id
            const imgUrl = getProductImage(prod)

            return (
              <motion.button
                key={prod.id}
                onClick={() => selectProduct(prod)}
                className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-[#A8E6E1] bg-[#A8E6E1]/10 ring-1 ring-[#A8E6E1]/30'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#A8E6E1] flex items-center justify-center">
                    <Check className="w-3 h-3 text-gray-900" />
                  </div>
                )}
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={prod.title}
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full aspect-square bg-white/5 rounded-lg mb-2 flex items-center justify-center">
                    <Package className="w-8 h-8 text-white/20" />
                  </div>
                )}
                <p className="text-sm font-medium text-white truncate">{prod.title}</p>
                <p className="text-xs text-[#A8E6E1] mt-0.5">{getProductPrice(prod)}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Section: Select Template or Manual Mode */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#F9B4C4]" />
          Template / Cuts
        </h3>
        <p className="text-white/50 text-sm mb-4">
          Select a saved template or configure cuts manually
        </p>

        {/* Toggle: Templates vs Manual */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setManualMode(false) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !manualMode
                ? 'bg-[#A8E6E1]/20 text-[#A8E6E1] border border-[#A8E6E1]/40'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            From Templates
          </button>
          <button
            onClick={handleManualModeToggle}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              manualMode
                ? 'bg-[#F9B4C4]/20 text-[#F9B4C4] border border-[#F9B4C4]/40'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            Manual Mode
          </button>
        </div>

        {!manualMode ? (
          <div>
            {loadingTemplates ? (
              <div className="flex items-center gap-2 text-white/50 py-8 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading templates...</span>
              </div>
            ) : savedTemplates.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                <p className="mb-2">No saved templates yet.</p>
                <button
                  onClick={handleManualModeToggle}
                  className="text-[#A8E6E1] text-sm underline hover:no-underline"
                >
                  Use manual mode instead
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedTemplates.map(tpl => {
                  const isSelected = project.template?.id === tpl.id
                  return (
                    <motion.button
                      key={tpl.id}
                      onClick={() => selectTemplate(tpl)}
                      className={`relative p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#A8E6E1] bg-[#A8E6E1]/10 ring-1 ring-[#A8E6E1]/30'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#A8E6E1] flex items-center justify-center">
                          <Check className="w-3 h-3 text-gray-900" />
                        </div>
                      )}
                      {tpl.previewImage && (
                        <img
                          src={tpl.previewImage}
                          alt={tpl.name}
                          className="w-full h-24 object-cover rounded-lg mb-3"
                        />
                      )}
                      <p className="font-medium text-white text-sm">{tpl.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          tpl.source === 'capcut'
                            ? 'bg-[#A8E6E1]/20 text-[#A8E6E1]'
                            : 'bg-[#F9B4C4]/20 text-[#F9B4C4]'
                        }`}>
                          {tpl.source === 'capcut' ? 'CapCut' : 'Canva'}
                        </span>
                        <span className="text-xs text-white/40">{tpl.totalCuts} cuts</span>
                        {tpl.hasVoice && <Mic className="w-3 h-3 text-white/40" />}
                      </div>
                      {tpl.cuts.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tpl.cuts.map(cut => (
                            <span key={cut.index} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                              {cut.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* Manual Mode */
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Number of Cuts</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateManualCuts(manualCuts - 1)}
                  className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                >
                  -
                </button>
                <span className="text-xl font-bold text-white w-8 text-center">{manualCuts}</span>
                <button
                  onClick={() => updateManualCuts(manualCuts + 1)}
                  className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Cut Names</label>
              <div className="grid grid-cols-2 gap-2">
                {manualCutNames.slice(0, manualCuts).map((name, i) => (
                  <input
                    key={i}
                    value={name}
                    onChange={e => {
                      const updated = [...manualCutNames]
                      updated[i] = e.target.value
                      setManualCutNames(updated)
                    }}
                    placeholder={`Cut ${i + 1}`}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#A8E6E1]/50"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section: Video Structure */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#A8E6E1]" />
          Video Structure
        </h3>
        <p className="text-white/50 text-sm mb-4">How should the video be structured?</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {VIDEO_STRUCTURES.map(vs => {
            const isSelected = project.videoStructure === vs.value
            return (
              <motion.button
                key={vs.value}
                onClick={() => selectVideoStructure(vs.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#A8E6E1] bg-[#A8E6E1]/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-sm font-medium text-white">{vs.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{vs.description}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-end pt-4">
        <motion.button
          onClick={handleGeneratePrompts}
          disabled={!canProceedFromConfig()}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            canProceedFromConfig()
              ? 'bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] text-gray-900 hover:shadow-lg hover:shadow-[#A8E6E1]/20'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
          whileHover={canProceedFromConfig() ? { scale: 1.03 } : {}}
          whileTap={canProceedFromConfig() ? { scale: 0.97 } : {}}
        >
          <Wand2 className="w-4 h-4" />
          Generate Prompts
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )

  // ============================================
  // STEP 2 — PROMPTS REVIEW
  // ============================================

  const StepPrompts = () => (
    <motion.div
      key="step-prompts"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Generated Prompts</h3>
          <p className="text-white/50 text-sm">
            Review, edit, and copy prompts for each cut
          </p>
        </div>
        <button
          onClick={() => goToStep('config')}
          className="text-sm text-white/50 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Config
        </button>
      </div>

      {/* Loading State */}
      {isGeneratingPrompts && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center gap-4"
        >
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#A8E6E1]/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-t-[#F9B4C4] border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#A8E6E1]" />
            </div>
          </div>
          <p className="text-white font-medium">Generating prompts with AI...</p>
          <div className="w-full max-w-xs">
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${generationProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-white/40 mt-1 text-center">
              {Math.round(generationProgress)}%
            </p>
          </div>
        </motion.div>
      )}

      {/* Prompts Cards */}
      {!isGeneratingPrompts && project.cutPrompts.length > 0 && (
        <div className="space-y-4">
          {project.cutPrompts.map((cut, idx) => {
            const isExpanded = expandedCuts[idx] ?? false

            return (
              <motion.div
                key={cut.cutIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
              >
                {/* Cut Header */}
                <button
                  onClick={() => toggleCutExpanded(idx)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A8E6E1]/20 flex items-center justify-center text-[#A8E6E1] text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium text-sm">
                        Corte {idx + 1} &mdash; {cut.cutName}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  )}
                </button>

                {/* Cut Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4">
                        {/* Image Prompt */}
                        <PromptField
                          icon={<ImageIcon className="w-4 h-4" />}
                          label="Image Prompt"
                          value={cut.imagePrompt}
                          cutIndex={idx}
                          field="imagePrompt"
                          onUpdate={(val) => updateCutPrompt(idx, 'imagePrompt', val)}
                          onCopy={() => copyToClipboard(cut.imagePrompt, idx, 'imagePrompt')}
                          onOpenExternal={() => openExternalTool(cut.imagePrompt)}
                          isCopied={copiedField?.cutIndex === idx && copiedField?.field === 'imagePrompt'}
                          isEditing={editingField?.cutIndex === idx && editingField?.field === 'imagePrompt'}
                          onEditToggle={() =>
                            setEditingField(
                              editingField?.cutIndex === idx && editingField?.field === 'imagePrompt'
                                ? null
                                : { cutIndex: idx, field: 'imagePrompt' }
                            )
                          }
                        />

                        {/* Animation Prompt */}
                        <PromptField
                          icon={<FileVideo className="w-4 h-4" />}
                          label="Animation Prompt"
                          value={cut.animationPrompt}
                          cutIndex={idx}
                          field="animationPrompt"
                          onUpdate={(val) => updateCutPrompt(idx, 'animationPrompt', val)}
                          onCopy={() => copyToClipboard(cut.animationPrompt, idx, 'animationPrompt')}
                          onOpenExternal={() => openExternalTool(cut.animationPrompt)}
                          isCopied={copiedField?.cutIndex === idx && copiedField?.field === 'animationPrompt'}
                          isEditing={editingField?.cutIndex === idx && editingField?.field === 'animationPrompt'}
                          onEditToggle={() =>
                            setEditingField(
                              editingField?.cutIndex === idx && editingField?.field === 'animationPrompt'
                                ? null
                                : { cutIndex: idx, field: 'animationPrompt' }
                            )
                          }
                        />

                        {/* Speech Text */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/70">
                              <Volume2 className="w-4 h-4" />
                              <span className="text-xs font-medium uppercase tracking-wider">Speech</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateCutPrompt(idx, 'hasVoice', !cut.hasVoice)}
                                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                                  cut.hasVoice
                                    ? 'bg-[#A8E6E1]/20 text-[#A8E6E1]'
                                    : 'bg-white/5 text-white/40'
                                }`}
                              >
                                {cut.hasVoice ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                                {cut.hasVoice ? 'Voice ON' : 'Voice OFF'}
                              </button>
                              <button
                                onClick={() =>
                                  setEditingField(
                                    editingField?.cutIndex === idx && editingField?.field === 'speechText'
                                      ? null
                                      : { cutIndex: idx, field: 'speechText' }
                                  )
                                }
                                className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => copyToClipboard(cut.speechText, idx, 'speechText')}
                                className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
                              >
                                {copiedField?.cutIndex === idx && copiedField?.field === 'speechText' ? (
                                  <Check className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          {editingField?.cutIndex === idx && editingField?.field === 'speechText' ? (
                            <textarea
                              value={cut.speechText}
                              onChange={e => updateCutPrompt(idx, 'speechText', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[#A8E6E1]/30 text-white text-sm resize-none focus:outline-none focus:border-[#A8E6E1]"
                              autoFocus
                            />
                          ) : (
                            <p className="text-sm text-white/60 bg-white/5 rounded-lg p-3 leading-relaxed">
                              {cut.speechText || <span className="italic text-white/30">No speech text</span>}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {/* Continue Button */}
          <div className="flex justify-between pt-4">
            <button
              onClick={() => goToStep('config')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <motion.button
              onClick={() => goToStep('assets')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] text-gray-900 hover:shadow-lg hover:shadow-[#A8E6E1]/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Continue to Assets
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )

  // ============================================
  // PROMPT FIELD SUB-COMPONENT
  // ============================================

  const PromptField = ({
    icon,
    label,
    value,
    cutIndex,
    field,
    onUpdate,
    onCopy,
    onOpenExternal,
    isCopied,
    isEditing,
    onEditToggle,
  }: {
    icon: React.ReactNode
    label: string
    value: string
    cutIndex: number
    field: string
    onUpdate: (val: string) => void
    onCopy: () => void
    onOpenExternal: () => void
    isCopied: boolean
    isEditing: boolean
    onEditToggle: () => void
  }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/70">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEditToggle}
            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onCopy}
            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
            title="Copy to clipboard"
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={onOpenExternal}
            className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
            title="Open Grok Imagine"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {isEditing ? (
        <textarea
          value={value}
          onChange={e => onUpdate(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[#A8E6E1]/30 text-white text-sm resize-none focus:outline-none focus:border-[#A8E6E1]"
          autoFocus
        />
      ) : (
        <p className="text-sm text-white/60 bg-white/5 rounded-lg p-3 leading-relaxed">
          {value || <span className="italic text-white/30">Empty</span>}
        </p>
      )}
    </div>
  )

  // ============================================
  // STEP 3 — ASSET GENERATION
  // ============================================

  const StepAssets = () => {
    const overallProgress = getOverallAssetProgress()

    return (
      <motion.div
        key="step-assets"
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Asset Generation</h3>
            <p className="text-white/50 text-sm">
              Upload images, videos, and generate audio for each cut
            </p>
          </div>
          <button
            onClick={() => goToStep('prompts')}
            className="text-sm text-white/50 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prompts
          </button>
        </div>

        {/* Overall Progress */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Overall Progress</span>
            <span className="text-sm font-bold text-[#A8E6E1]">{overallProgress}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Template Link */}
        {project.template?.externalLink && (
          <a
            href={project.template.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-xl border border-[#A8E6E1]/20 bg-[#A8E6E1]/5 text-[#A8E6E1] text-sm hover:bg-[#A8E6E1]/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open Template in {project.template.source === 'capcut' ? 'CapCut' : 'Canva'}
          </a>
        )}

        {/* Cut Asset Cards */}
        <div className="space-y-4">
          {project.cutPrompts.map((cut, idx) => {
            const asset = project.cutAssets.find(a => a.cutIndex === idx)
            const status = getCutCompletionStatus(idx)
            const isAudioGenerating = generatingAudio[idx] || false

            return (
              <motion.div
                key={cut.cutIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 space-y-4"
              >
                {/* Cut Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A8E6E1]/20 flex items-center justify-center text-[#A8E6E1] text-sm font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-white font-medium text-sm">
                      Corte {idx + 1} &mdash; {cut.cutName}
                    </p>
                  </div>
                  {/* Mini progress */}
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${status.image ? 'bg-[#A8E6E1]' : 'bg-white/20'}`} />
                    <span className={`w-2 h-2 rounded-full ${status.video ? 'bg-[#A8E6E1]' : 'bg-white/20'}`} />
                    <span className={`w-2 h-2 rounded-full ${status.audio ? 'bg-[#A8E6E1]' : 'bg-white/20'}`} />
                  </div>
                </div>

                {/* Image Row */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white/70">Image</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(cut.imagePrompt, idx, 'assetImage')}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {copiedField?.cutIndex === idx && copiedField?.field === 'assetImage' ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy Prompt
                    </button>
                    <a
                      href={EXTERNAL_TOOLS.grokImagine}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Grok
                    </a>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={el => { imageInputRefs.current[idx] = el }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(idx, file)
                      }}
                    />
                    <button
                      onClick={() => imageInputRefs.current[idx]?.click()}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                        status.image
                          ? 'bg-[#A8E6E1]/20 text-[#A8E6E1]'
                          : 'bg-[#F9B4C4]/20 text-[#F9B4C4] hover:bg-[#F9B4C4]/30'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      {status.image ? 'Replace' : 'Upload'}
                    </button>
                    {status.image ? (
                      <CheckCircle2 className="w-4 h-4 text-[#A8E6E1]" />
                    ) : (
                      <Square className="w-4 h-4 text-white/20" />
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                {asset?.imageFile && (
                  <div className="px-3">
                    <img
                      src={asset.imageFile}
                      alt={`Cut ${idx + 1} image`}
                      className="w-32 h-32 object-cover rounded-lg border border-white/10"
                    />
                  </div>
                )}

                {/* Video Row */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <FileVideo className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white/70">Video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(cut.animationPrompt, idx, 'assetVideo')}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {copiedField?.cutIndex === idx && copiedField?.field === 'assetVideo' ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy Prompt
                    </button>
                    <a
                      href={EXTERNAL_TOOLS.grokImagine}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Grok
                    </a>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      ref={el => { videoInputRefs.current[idx] = el }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleVideoUpload(idx, file)
                      }}
                    />
                    <button
                      onClick={() => videoInputRefs.current[idx]?.click()}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                        status.video
                          ? 'bg-[#A8E6E1]/20 text-[#A8E6E1]'
                          : 'bg-[#F9B4C4]/20 text-[#F9B4C4] hover:bg-[#F9B4C4]/30'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      {status.video ? 'Replace' : 'Upload'}
                    </button>
                    {status.video ? (
                      <CheckCircle2 className="w-4 h-4 text-[#A8E6E1]" />
                    ) : (
                      <Square className="w-4 h-4 text-white/20" />
                    )}
                  </div>
                </div>

                {/* Video Preview */}
                {asset?.videoFile && (
                  <div className="px-3">
                    <video
                      src={asset.videoFile}
                      controls
                      className="w-48 rounded-lg border border-white/10"
                    />
                  </div>
                )}

                {/* Audio Row */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-white/50" />
                    <span className="text-sm text-white/70">Audio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cut.hasVoice ? (
                      <>
                        <button
                          onClick={() => handleGenerateAudio(idx)}
                          disabled={isAudioGenerating || !cut.speechText}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all ${
                            isAudioGenerating
                              ? 'bg-white/5 text-white/40 cursor-wait'
                              : status.audio
                              ? 'bg-[#A8E6E1]/20 text-[#A8E6E1] hover:bg-[#A8E6E1]/30'
                              : 'bg-[#F9B4C4]/20 text-[#F9B4C4] hover:bg-[#F9B4C4]/30'
                          }`}
                        >
                          {isAudioGenerating ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                          {isAudioGenerating
                            ? 'Generating...'
                            : status.audio
                            ? 'Regenerate'
                            : 'Generate with ElevenLabs'
                          }
                        </button>
                        {status.audio ? (
                          <CheckCircle2 className="w-4 h-4 text-[#A8E6E1]" />
                        ) : (
                          <Square className="w-4 h-4 text-white/20" />
                        )}
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <MicOff className="w-3 h-3" />
                        No Voice
                      </span>
                    )}
                  </div>
                </div>

                {/* Audio Player */}
                {audioPlayers[idx] && (
                  <div className="px-3">
                    <audio src={audioPlayers[idx]} controls className="w-full h-8" />
                  </div>
                )}

                {/* Cut Progress Summary */}
                <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                  <span className="text-xs text-white/40">Progress:</span>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs ${status.image ? 'text-[#A8E6E1]' : 'text-white/30'}`}>
                      {status.image ? <CheckCircle2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      Image
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${status.video ? 'text-[#A8E6E1]' : 'text-white/30'}`}>
                      {status.video ? <CheckCircle2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      Video
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${status.audio ? 'text-[#A8E6E1]' : 'text-white/30'}`}>
                      {status.audio ? <CheckCircle2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      Audio
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Template External Link (Bottom) */}
        {overallProgress === 100 && project.template?.externalLink && (
          <motion.a
            href={project.template.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[#A8E6E1]/30 bg-[#A8E6E1]/10 text-[#A8E6E1] font-medium hover:bg-[#A8E6E1]/20 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Open Template in {project.template.source === 'capcut' ? 'CapCut' : 'Canva'}
          </motion.a>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => goToStep('prompts')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <motion.button
            onClick={() => goToStep('publish')}
            disabled={!allVideosUploaded()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              allVideosUploaded()
                ? 'bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] text-gray-900 hover:shadow-lg hover:shadow-[#A8E6E1]/20'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
            whileHover={allVideosUploaded() ? { scale: 1.03 } : {}}
            whileTap={allVideosUploaded() ? { scale: 0.97 } : {}}
          >
            Continue to Publish
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // ============================================
  // STEP 4 — SUMMARY & PUBLISH
  // ============================================

  const StepPublish = () => (
    <motion.div
      key="step-publish"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Summary & Publish</h3>
          <p className="text-white/50 text-sm">
            Review assets, add final video, and publish
          </p>
        </div>
        <button
          onClick={() => goToStep('assets')}
          className="text-sm text-white/50 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assets
        </button>
      </div>

      {/* Product Info Card */}
      {project.product && (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          {getProductImage(project.product) ? (
            <img
              src={getProductImage(project.product)}
              alt={project.product.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center">
              <Package className="w-6 h-6 text-white/20" />
            </div>
          )}
          <div>
            <p className="text-white font-medium">{project.product.title}</p>
            <p className="text-sm text-[#A8E6E1]">{getProductPrice(project.product)}</p>
            <p className="text-xs text-white/40 mt-0.5">
              {project.totalCuts} cuts &middot; {project.videoStructureLabel || project.videoStructure}
              {project.template ? ` &middot; Template: ${project.template.name}` : ''}
            </p>
          </div>
        </div>
      )}

      {/* Assets Summary */}
      <div>
        <h4 className="text-sm font-semibold text-white/80 mb-3">Generated Assets</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {project.cutPrompts.map((cut, idx) => {
            const asset = project.cutAssets.find(a => a.cutIndex === idx)
            const status = getCutCompletionStatus(idx)

            return (
              <div
                key={cut.cutIndex}
                className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">
                    Corte {idx + 1} &mdash; {cut.cutName}
                  </p>
                  <span className="text-xs text-[#A8E6E1]">
                    {status.total}/{status.max}
                  </span>
                </div>

                {/* Thumbnails / Previews */}
                <div className="flex items-center gap-2">
                  {asset?.imageFile && (
                    <div className="relative group">
                      <img
                        src={asset.imageFile}
                        alt={`Cut ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        onClick={() => downloadAsset(asset.imageFile!, `cut-${idx + 1}-image.png`)}
                        className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                  {asset?.videoFile && (
                    <div className="relative group">
                      <video
                        src={asset.videoFile}
                        className="w-16 h-16 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        onClick={() => downloadAsset(asset.videoFile!, `cut-${idx + 1}-video.mp4`)}
                        className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                  {asset?.audioUrl && (
                    <button
                      onClick={() => downloadAsset(asset.audioUrl!, `cut-${idx + 1}-audio.mp3`)}
                      className="w-16 h-16 rounded-lg border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-[#A8E6E1]" />
                      <Download className="w-3 h-3 text-white/40" />
                    </button>
                  )}
                </div>

                {/* Status indicators */}
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-[10px] ${status.image ? 'text-[#A8E6E1]' : 'text-white/30'}`}>
                    {status.image ? <CheckCircle2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                    IMG
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] ${status.video ? 'text-[#A8E6E1]' : 'text-white/30'}`}>
                    {status.video ? <CheckCircle2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                    VID
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] ${status.audio ? 'text-[#A8E6E1]' : 'text-white/30'}`}>
                    {status.audio ? <CheckCircle2 className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                    AUD
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Template Link */}
      {project.template?.externalLink && (
        <a
          href={project.template.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[#A8E6E1]/20 bg-[#A8E6E1]/5 text-[#A8E6E1] font-medium hover:bg-[#A8E6E1]/10 transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          Open Template in {project.template.source === 'capcut' ? 'CapCut' : 'Canva'}
        </a>
      )}

      {/* Upload Final Video */}
      <div>
        <h4 className="text-sm font-semibold text-white/80 mb-3">Final Edited Video</h4>
        <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
          {finalVideoPreview ? (
            <div className="space-y-3">
              <video
                src={finalVideoPreview}
                controls
                className="w-full max-w-md rounded-lg border border-white/10 mx-auto"
              />
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-[#A8E6E1] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {finalVideoFile?.name}
                </span>
                <button
                  onClick={() => {
                    setFinalVideoFile(null)
                    setFinalVideoPreview(null)
                  }}
                  className="text-sm text-white/40 hover:text-white underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => finalVideoInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 py-8 text-white/40 hover:text-white/60 transition-colors"
            >
              <Upload className="w-8 h-8" />
              <span className="text-sm">Click to upload your final edited video</span>
              <span className="text-xs text-white/30">MP4, MOV, WebM</span>
            </button>
          )}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={finalVideoInputRef}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFinalVideoUpload(file)
            }}
          />
        </div>
      </div>

      {/* Captions Preview */}
      <div>
        <h4 className="text-sm font-semibold text-white/80 mb-3">Product Captions</h4>
        {loadingCaptions ? (
          <div className="flex items-center gap-2 text-white/40 py-4 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading captions...</span>
          </div>
        ) : productCaptions ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {productCaptions.captions.map(cap => {
              const platformInfo = SOCIAL_PLATFORMS.find(p => p.value === cap.platform)
              return (
                <div
                  key={cap.platform}
                  className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                      {cap.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-400" />}
                      {cap.platform === 'youtube' && <Youtube className="w-4 h-4 text-red-500" />}
                      {cap.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-500" />}
                      {cap.platform === 'tiktok' && <Music className="w-4 h-4 text-white" />}
                      {platformInfo?.label || cap.platform}
                    </span>
                    <button
                      onClick={() => copyToClipboard(cap.caption, -1, cap.platform)}
                      className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
                    >
                      {copiedField?.field === cap.platform ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-white/50 line-clamp-4 leading-relaxed">
                    {cap.caption || 'No caption saved'}
                  </p>
                  {cap.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cap.hashtags.slice(0, 5).map(tag => (
                        <span key={tag} className="text-[10px] text-[#A8E6E1]/70">
                          #{tag}
                        </span>
                      ))}
                      {cap.hashtags.length > 5 && (
                        <span className="text-[10px] text-white/30">
                          +{cap.hashtags.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                  <div className="text-[10px] text-white/30">
                    {cap.currentLength}/{cap.charLimit} chars
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-white/40 text-sm">
            No saved captions found for this product.
          </div>
        )}
      </div>

      {/* Publish Button */}
      <div className="flex justify-between pt-4 border-t border-white/10">
        <button
          onClick={() => goToStep('assets')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <motion.button
          onClick={handlePublish}
          disabled={publishing}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
            publishing
              ? 'bg-white/10 text-white/40 cursor-wait'
              : 'bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] text-gray-900 hover:shadow-lg hover:shadow-[#A8E6E1]/20'
          }`}
          whileHover={!publishing ? { scale: 1.03 } : {}}
          whileTap={!publishing ? { scale: 0.97 } : {}}
        >
          {publishing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Publish to All Networks
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">Content Pipeline</h2>
            <p className="text-sm text-white/40">Create daily video content step by step</p>
          </div>
        </div>
        {project.product && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            {getProductImage(project.product) && (
              <img
                src={getProductImage(project.product)}
                alt=""
                className="w-6 h-6 rounded object-cover"
              />
            )}
            <span className="text-sm text-white/70 max-w-[150px] truncate">
              {project.product.title}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <ProgressBar />

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'config' && <StepConfig />}
        {currentStep === 'prompts' && <StepPrompts />}
        {currentStep === 'assets' && <StepAssets />}
        {currentStep === 'publish' && <StepPublish />}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-xl border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-[#A8E6E1]/20 border-[#A8E6E1]/30 text-[#A8E6E1]'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
