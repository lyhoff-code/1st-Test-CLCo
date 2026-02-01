'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Package,
  Search,
  Layout,
  Wand2,
  Download,
  Play,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Star,
  Zap,
  RefreshCw,
  Image as ImageIcon,
  Type,
  Music,
  Mic,
  Settings,
  Eye,
  Lightbulb,
  ArrowRight,
  ChefHat,
  Flame
} from 'lucide-react'
import {
  VIDEO_TEMPLATES,
  VideoTemplateStructure,
  UserProject,
  UserScene,
  getTodaysRecommendedTemplates,
  getCurrentDayName
} from '@/types/templates'
import { TemplateEditor } from '@/components/TemplateEditor'
import { TimelineEditor } from '@/components/TimelineEditor'
import { ExportPanel } from '@/components/ExportPanel'
import { MusicLibrary, Track } from '@/components/MusicLibrary'
import { CaptionStyles, CaptionStyle } from '@/components/CaptionStyles'
import { ThemeToggle } from '@/components/HeaderControls'
import { UserMenu } from '@/components/UserMenu'

// Workflow Steps
type WorkflowStep = 'product' | 'research' | 'template' | 'edit' | 'extras' | 'export'

// Product interface
interface Product {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
}

// Mock products (will be replaced with Shopify data)
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality noise-cancelling headphones with 40-hour battery life',
    price: '$199.99',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness with advanced sensors',
    price: '$299.99',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'
  },
  {
    id: '3',
    name: 'Organic Skincare Set',
    description: 'Natural skincare routine with premium ingredients',
    price: '$89.99',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300'
  },
  {
    id: '4',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° sound and 24-hour battery',
    price: '$149.99',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300'
  }
]

// Step configuration
const STEPS = [
  { id: 'product', name: 'Product', icon: Package, color: 'blue' },
  { id: 'research', name: 'AI Research', icon: Search, color: 'purple' },
  { id: 'template', name: 'Template', icon: Layout, color: 'green' },
  { id: 'edit', name: 'Create', icon: Wand2, color: 'orange' },
  { id: 'extras', name: 'Extras', icon: Music, color: 'pink' },
  { id: 'export', name: 'Export', icon: Download, color: 'emerald' }
]

export default function Home() {
  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('product')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Research state
  const [isResearching, setIsResearching] = useState(false)
  const [research, setResearch] = useState<{
    insights: string[]
    hooks: string[]
    keywords: string[]
    recommendedType: string
  } | null>(null)

  // Template & Project state
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplateStructure | null>(null)
  const [project, setProject] = useState<UserProject | null>(null)
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0)

  // Extras state
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<CaptionStyle | null>(null)

  // Export state
  const [showExport, setShowExport] = useState(false)

  // Get today's recommendations
  const todaysTemplates = getTodaysRecommendedTemplates()
  const today = getCurrentDayName()

  // Calculate current step index
  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep)

  // Initialize project when template is selected
  useEffect(() => {
    if (selectedTemplate && selectedProduct) {
      const userScenes: UserScene[] = selectedTemplate.scenes.map(scene => ({
        id: `user-${scene.id}`,
        templateSceneId: scene.id,
        imageUrl: null,
        script: scene.defaultText.replace('[product]', selectedProduct.name),
        duration: scene.duration,
        isEdited: false
      }))

      setProject({
        id: `project-${Date.now()}`,
        templateId: selectedTemplate.id,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        scenes: userScenes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      })
    }
  }, [selectedTemplate, selectedProduct])

  // Handle product selection
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setCurrentStep('research')
  }

  // Simulate AI research
  const handleResearch = async () => {
    if (!selectedProduct) return

    setIsResearching(true)
    await new Promise(resolve => setTimeout(resolve, 2500))

    const recommendedType = todaysTemplates[0]?.name || 'Educational'

    setResearch({
      insights: [
        `${selectedProduct.name} is trending in the lifestyle category`,
        `Best content type for ${today}: ${recommendedType}`,
        'Recommended video length: 15-30 seconds',
        'Peak engagement time: 6-8 PM',
        'Top performing hashtags identified'
      ],
      hooks: [
        `Stop scrolling if you want the best ${selectedProduct.name.split(' ').pop()?.toLowerCase()}!`,
        `I wish I knew about ${selectedProduct.name} sooner...`,
        `Here's why everyone is obsessed with this`,
        `${selectedProduct.name} changed everything for me`,
        `POV: You finally discover ${selectedProduct.name}`
      ],
      keywords: ['viral', 'musthave', 'fyp', 'review', selectedProduct.name.toLowerCase().replace(/\s+/g, '')],
      recommendedType
    })
    setIsResearching(false)
  }

  // Handle template selection
  const handleSelectTemplate = (template: VideoTemplateStructure) => {
    setSelectedTemplate(template)
    setCurrentStep('edit')
  }

  // Handle scene changes
  const handleScenesChange = (scenes: UserScene[]) => {
    if (!project) return
    setProject({
      ...project,
      scenes,
      updatedAt: new Date().toISOString()
    })
  }

  // Handle duration change
  const handleDurationChange = (index: number, duration: number) => {
    if (!project) return
    const newScenes = [...project.scenes]
    newScenes[index] = { ...newScenes[index], duration }
    setProject({
      ...project,
      scenes: newScenes,
      updatedAt: new Date().toISOString()
    })
  }

  // Handle export
  const handleExport = (exportedProject: UserProject) => {
    setProject(exportedProject)
    setShowExport(true)
  }

  // Navigation functions
  const goToStep = (step: WorkflowStep) => {
    const stepIndex = STEPS.findIndex(s => s.id === step)
    if (stepIndex <= currentStepIndex) {
      setCurrentStep(step)
    }
  }

  const goNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id as WorkflowStep)
    }
  }

  const goBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id as WorkflowStep)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 dark:text-white">
                  DataBake<span className="text-pink-500">.media</span>
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  AI Content Creator
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="hidden lg:flex items-center gap-1">
              {STEPS.map((step, idx) => {
                const isActive = step.id === currentStep
                const isCompleted = idx < currentStepIndex
                const isClickable = idx <= currentStepIndex
                const Icon = step.icon

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => isClickable && goToStep(step.id as WorkflowStep)}
                      disabled={!isClickable}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                          : isCompleted
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer'
                          : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="text-xs font-medium">{step.name}</span>
                    </button>
                    {idx < STEPS.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-0.5" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/settings"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-slate-500" />
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Progress */}
      <div className="lg:hidden px-4 py-3 bg-white/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">
            Step {currentStepIndex + 1} of {STEPS.length}
          </span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {STEPS[currentStepIndex].name}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: Product Selection */}
          {currentStep === 'product' && (
            <motion.div
              key="product"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4"
                >
                  <Package className="w-4 h-4" />
                  Step 1
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Select Your Product
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose the product you want to create viral content for
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_PRODUCTS.map((product, idx) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleSelectProduct(product)}
                    className="group p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 transition-all"
                  >
                    <div className="relative mb-3 overflow-hidden rounded-xl">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {product.price}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: AI Research */}
          {currentStep === 'research' && selectedProduct && (
            <motion.div
              key="research"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4"
                >
                  <Search className="w-4 h-4" />
                  Step 2
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  AI Research
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Let AI analyze trends and find the best content strategy
                </p>
              </div>

              {/* Selected Product Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedProduct.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep('product')}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Change
                  </button>
                </div>
              </div>

              {!research ? (
                <div className="text-center py-8">
                  <motion.button
                    onClick={handleResearch}
                    disabled={isResearching}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg flex items-center gap-3 mx-auto hover:shadow-xl hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100"
                    whileTap={{ scale: 0.95 }}
                  >
                    {isResearching ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Start AI Research
                      </>
                    )}
                  </motion.button>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                    AI will analyze trends, competitors, and find the best hooks
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Insights */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
                  >
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      AI Insights
                    </h3>
                    <ul className="space-y-2">
                      {research.insights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-purple-800 dark:text-purple-200">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Hooks */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Viral Hooks
                    </h3>
                    <div className="space-y-2">
                      {research.hooks.slice(0, 3).map((hook, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-300 border-l-4 border-yellow-400">
                          "{hook}"
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Keywords */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                      Trending Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {research.keywords.map((keyword, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Continue Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center pt-4"
                  >
                    <button
                      onClick={() => setCurrentStep('template')}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-lg flex items-center gap-3 hover:shadow-xl hover:scale-105 transition-all"
                    >
                      Choose Template
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: Template Selection */}
          {currentStep === 'template' && (
            <motion.div
              key="template"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4"
                >
                  <Layout className="w-4 h-4" />
                  Step 3
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Choose Your Template
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Select a video structure that fits your content goal
                </p>
              </div>

              {/* Today's Recommendations */}
              {todaysTemplates.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Recommended for {today}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Best conversion
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {todaysTemplates.slice(0, 3).map((template, idx) => (
                      <motion.button
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleSelectTemplate(template)}
                        className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 text-left hover:shadow-lg hover:-translate-y-1 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{template.emoji}</span>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {template.name}
                            </h4>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {template.scenes.length} scenes • {template.totalDuration}s
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {template.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* All Templates */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  All Templates
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {VIDEO_TEMPLATES.map((template, idx) => (
                    <motion.button
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelectTemplate(template)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 transition-all"
                    >
                      <span className="text-2xl mb-2 block">{template.emoji}</span>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                        {template.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{template.scenes.length} scenes</span>
                        <span>•</span>
                        <span>{template.totalDuration}s</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Edit/Create */}
          {currentStep === 'edit' && selectedTemplate && project && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4"
                >
                  <Wand2 className="w-4 h-4" />
                  Step 4
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Create Your Content
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Replace placeholders, edit scripts, and generate speech
                </p>
              </div>

              {/* Template Editor */}
              <div className="mb-8">
                <TemplateEditor
                  template={selectedTemplate}
                  product={selectedProduct ? {
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    description: selectedProduct.description,
                    imageUrl: selectedProduct.imageUrl
                  } : undefined}
                  onExport={handleExport}
                />
              </div>

              {/* Timeline Editor */}
              <div className="mb-8">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Timeline
                </h3>
                <TimelineEditor
                  scenes={project.scenes}
                  templateScenes={selectedTemplate.scenes}
                  selectedMusic={selectedTrack ? {
                    id: selectedTrack.id,
                    title: selectedTrack.title,
                    artist: selectedTrack.artist,
                    duration: 30
                  } : undefined}
                  onScenesChange={handleScenesChange}
                  onSceneSelect={setSelectedSceneIndex}
                  selectedSceneIndex={selectedSceneIndex}
                  onDurationChange={handleDurationChange}
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCurrentStep('extras')}
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Music className="w-4 h-4" />
                  Add Music & Style
                </button>
                <button
                  onClick={() => setShowExport(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export Project
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Extras (Music & Captions) */}
          {currentStep === 'extras' && (
            <motion.div
              key="extras"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm font-medium mb-4"
                >
                  <Music className="w-4 h-4" />
                  Step 5
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Add Extras
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose music and caption style for your video
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Music */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Music className="w-5 h-5 text-purple-500" />
                      Music Library
                    </h3>
                  </div>
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    <MusicLibrary
                      onSelectTrack={setSelectedTrack}
                      selectedTrackId={selectedTrack?.id}
                      compact
                    />
                  </div>
                </div>

                {/* Caption Styles */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Type className="w-5 h-5 text-yellow-500" />
                      Caption Styles
                    </h3>
                  </div>
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    <CaptionStyles
                      selectedStyle={selectedCaptionStyle}
                      onSelectStyle={setSelectedCaptionStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Selected Summary */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Selected Extras
                </h4>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedTrack ? selectedTrack.title : 'No music selected'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedCaptionStyle ? selectedCaptionStyle.name : 'No style selected'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentStep('edit')}
                  className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Editor
                </button>
                <button
                  onClick={() => setShowExport(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && project && selectedTemplate && (
          <ExportPanel
            project={project}
            template={selectedTemplate}
            selectedMusic={selectedTrack ? {
              id: selectedTrack.id,
              title: selectedTrack.title,
              artist: selectedTrack.artist
            } : undefined}
            onClose={() => setShowExport(false)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
