'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  Package,
  Search,
  Lightbulb,
  Layout,
  Wand2,
  Download,
  Play,
  ChevronRight,
  Calendar,
  TrendingUp,
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
  Eye
} from 'lucide-react'
import {
  VIDEO_TEMPLATES,
  VideoTemplateStructure,
  UserProject,
  UserScene,
  getTodaysRecommendedTemplates,
  getCurrentDayName,
  getTemplateById
} from '@/types/templates'
import { TemplateEditor } from '@/components/TemplateEditor'
import { TimelineEditor } from '@/components/TimelineEditor'
import { ExportPanel } from '@/components/ExportPanel'

// Workflow Steps
type WorkflowStep = 'product' | 'research' | 'template' | 'edit' | 'export'

// Mock product data
interface Product {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
}

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
  }
]

export default function EditorPage() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('product')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isResearching, setIsResearching] = useState(false)
  const [research, setResearch] = useState<{
    insights: string[]
    hooks: string[]
    keywords: string[]
  } | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplateStructure | null>(null)
  const [project, setProject] = useState<UserProject | null>(null)
  const [showExport, setShowExport] = useState(false)
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0)

  const todaysTemplates = getTodaysRecommendedTemplates()
  const today = getCurrentDayName()

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setResearch({
      insights: [
        `${selectedProduct.name} is trending in the tech/lifestyle category`,
        'Best performing content type today: Educational videos',
        'Recommended video length: 15-30 seconds',
        'Peak engagement time: 6-8 PM'
      ],
      hooks: [
        `Stop scrolling if you want better ${selectedProduct.name.toLowerCase().split(' ')[0]}!`,
        `I wish I knew about ${selectedProduct.name} sooner...`,
        `Here's why everyone is talking about this ${selectedProduct.name.toLowerCase().split(' ').pop()}`,
        `${selectedProduct.name} changed everything for me`
      ],
      keywords: ['viral', 'musthave', 'review', 'unboxing', selectedProduct.name.toLowerCase().replace(/\s+/g, '')]
    })
    setIsResearching(false)
    setCurrentStep('template')
  }

  // Handle template selection
  const handleSelectTemplate = (template: VideoTemplateStructure) => {
    setSelectedTemplate(template)
    setCurrentStep('edit')
  }

  // Handle scene changes from timeline
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

  // Progress steps
  const steps = [
    { id: 'product', name: 'Product', icon: Package },
    { id: 'research', name: 'Research', icon: Search },
    { id: 'template', name: 'Template', icon: Layout },
    { id: 'edit', name: 'Edit', icon: Wand2 },
    { id: 'export', name: 'Export', icon: Download }
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 dark:text-white">Content Creator</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedProduct ? selectedProduct.name : 'Select a product to start'}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-2">
              {steps.map((step, idx) => {
                const isActive = step.id === currentStep
                const isCompleted = idx < currentStepIndex
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex items-center">
                    <motion.button
                      onClick={() => {
                        if (isCompleted) {
                          setCurrentStep(step.id as WorkflowStep)
                        }
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : isCompleted
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                      whileHover={isCompleted ? { scale: 1.02 } : {}}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{step.name}</span>
                    </motion.button>
                    {idx < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-1" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Product Selection */}
          {currentStep === 'product' && (
            <motion.div
              key="product"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                    <Package className="w-4 h-4" />
                    Step 1 of 5
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Select Your Product
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Choose the product you want to create content for
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {MOCK_PRODUCTS.map((product) => (
                    <motion.button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-xl mb-3"
                      />
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {product.price}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: AI Research */}
          {currentStep === 'research' && selectedProduct && (
            <motion.div
              key="research"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                    <Search className="w-4 h-4" />
                    Step 2 of 5
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    AI Research
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Let AI analyze your product and find the best content strategy
                  </p>
                </div>

                {/* Product Summary */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedProduct.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Research Button or Results */}
                {!research ? (
                  <div className="text-center">
                    <motion.button
                      onClick={handleResearch}
                      disabled={isResearching}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg flex items-center gap-3 mx-auto hover:shadow-xl transition-all disabled:opacity-70"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                      AI will analyze trends, competitors, and optimal content strategies
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Insights */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        AI Insights
                      </h3>
                      <ul className="space-y-2">
                        {research.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-purple-800 dark:text-purple-200">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-500" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Hooks */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Viral Hooks
                      </h3>
                      <div className="space-y-2">
                        {research.hooks.map((hook, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-300">
                            "{hook}"
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                        Trending Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {research.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Continue Button */}
                    <div className="text-center">
                      <motion.button
                        onClick={() => setCurrentStep('template')}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg flex items-center gap-3 mx-auto hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Choose Template
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Template Selection */}
          {currentStep === 'template' && (
            <motion.div
              key="template"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
                    <Layout className="w-4 h-4" />
                    Step 3 of 5
                  </div>
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
                      <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">
                        Best conversion
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {todaysTemplates.slice(0, 3).map((template) => (
                        <motion.button
                          key={template.id}
                          onClick={() => handleSelectTemplate(template)}
                          className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 text-left hover:shadow-lg transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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
                          <div className="flex items-center gap-1 mt-3">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-slate-500">Top pick for today</span>
                          </div>
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
                  <div className="grid md:grid-cols-4 gap-4">
                    {VIDEO_TEMPLATES.map((template) => (
                      <motion.button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl mb-2 block">{template.emoji}</span>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                          {template.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
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
              </div>
            </motion.div>
          )}

          {/* Step 4: Edit */}
          {currentStep === 'edit' && selectedTemplate && project && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
                    <Wand2 className="w-4 h-4" />
                    Step 4 of 5
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Create Your Content
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Replace placeholders with your images, edit scripts, and generate speech
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
                    onScenesChange={handleScenesChange}
                    onSceneSelect={setSelectedSceneIndex}
                    selectedSceneIndex={selectedSceneIndex}
                    onDurationChange={handleDurationChange}
                  />
                </div>

                {/* Export Button */}
                <div className="text-center">
                  <motion.button
                    onClick={() => setShowExport(true)}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-lg flex items-center gap-3 mx-auto hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-5 h-5" />
                    Export Project
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Panel */}
      <AnimatePresence>
        {showExport && project && selectedTemplate && (
          <ExportPanel
            project={project}
            template={selectedTemplate}
            onClose={() => setShowExport(false)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
