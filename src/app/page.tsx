'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChefHat,
  Image as ImageIcon,
  Video,
  Sparkles,
  Zap,
  Package,
  Settings,
  ArrowRight,
  Home as HomeIcon,
  Layers,
  Film,
  Megaphone,
  ChevronLeft,
  X,
  Search,
  RefreshCw,
  Info,
  Loader2,
  Download,
  FileText,
  Workflow,
  LayoutTemplate,
  MessageSquareText,
  Scissors,
  Send
} from 'lucide-react'
import { ThemeToggle } from '@/components/HeaderControls'
import { UserMenu } from '@/components/UserMenu'
import { ImageEditor } from '@/components/ImageEditor'
import { VideoCreator } from '@/components/VideoCreator'
import { StoriesCreator } from '@/components/StoriesCreator'
import { AdGenerator } from '@/components/AdGenerator'
import { ShopifyProduct } from '@/types'
import { VideoProject } from '@/types/content'

// Content types / Modules
type ContentModule = 'dashboard' | 'image-editor' | 'video-creator' | 'stories' | 'ads'

// Demo products for when Shopify is not connected
const DEMO_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'demo-1',
    title: 'Premium Wireless Headphones',
    description: 'High-quality noise-cancelling headphones with 40-hour battery life. Crystal clear sound and comfortable fit for all-day wear.',
    handle: 'wireless-headphones',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          altText: 'Wireless Headphones'
        }
      }]
    },
    priceRange: {
      minVariantPrice: { amount: '199.99', currencyCode: 'USD' }
    },
    variants: { edges: [] }
  },
  {
    id: 'demo-2',
    title: 'Smart Fitness Watch',
    description: 'Track your health and fitness with advanced sensors. Heart rate, GPS, sleep tracking and 100+ workout modes.',
    handle: 'fitness-watch',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
          altText: 'Smart Watch'
        }
      }]
    },
    priceRange: {
      minVariantPrice: { amount: '299.99', currencyCode: 'USD' }
    },
    variants: { edges: [] }
  },
  {
    id: 'demo-3',
    title: 'Organic Skincare Set',
    description: 'Natural skincare routine with premium organic ingredients. Vegan, cruelty-free and eco-friendly packaging.',
    handle: 'skincare-set',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
          altText: 'Skincare Set'
        }
      }]
    },
    priceRange: {
      minVariantPrice: { amount: '89.99', currencyCode: 'USD' }
    },
    variants: { edges: [] }
  },
  {
    id: 'demo-4',
    title: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° immersive sound. 24-hour battery life, perfect for outdoor adventures.',
    handle: 'bluetooth-speaker',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
          altText: 'Bluetooth Speaker'
        }
      }]
    },
    priceRange: {
      minVariantPrice: { amount: '149.99', currencyCode: 'USD' }
    },
    variants: { edges: [] }
  }
]

// Module cards for dashboard
const MODULES = [
  {
    id: 'image-editor',
    name: 'Image Editor',
    description: 'Edit product photos like Photoroom',
    icon: ImageIcon,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    features: ['Remove Background', 'Add Effects', 'Export All Sizes']
  },
  {
    id: 'video-creator',
    name: 'Video Creator',
    description: 'Create videos with AI scripts',
    icon: Video,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    features: ['AI Scripts', 'Voice & Music', 'Free Tool Prompts']
  },
  {
    id: 'stories',
    name: 'Stories & Reels',
    description: 'Animated stories like Instories',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    features: ['Animated Templates', 'Stickers', 'Filters']
  },
  {
    id: 'ads',
    name: 'Ad Generator',
    description: 'Product ads like Amazon',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    features: ['Product Animations', 'Badges', 'Multi-Platform']
  }
]

// Quick stats
const QUICK_STATS = [
  { label: 'Projects Created', value: '12', icon: Layers, color: 'text-blue-500' },
  { label: 'Videos Generated', value: '48', icon: Film, color: 'text-purple-500' },
  { label: 'Ads Created', value: '24', icon: Megaphone, color: 'text-orange-500' },
]

// Helper to get product image URL
const getProductImageUrl = (product: ShopifyProduct) => {
  return product.images.edges[0]?.node.url || 'https://via.placeholder.com/300'
}

// Helper to get product price formatted
const getProductPrice = (product: ShopifyProduct) => {
  const price = product.priceRange.minVariantPrice
  return `$${price.amount}`
}

// Helper to extract features from description
const extractFeatures = (description: string): string[] => {
  // Simple extraction - split by periods and take first 3 short phrases
  const sentences = description.split(/[.!]/).filter(s => s.trim().length > 0)
  return sentences.slice(0, 3).map(s => {
    const words = s.trim().split(' ').slice(0, 4)
    return words.join(' ')
  })
}

export default function Home() {
  // Products state
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Module state
  const [activeModule, setActiveModule] = useState<ContentModule>('dashboard')
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null)
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [pendingModule, setPendingModule] = useState<ContentModule | null>(null)

  // Export state
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportProject, setExportProject] = useState<VideoProject | null>(null)

  // Fetch products from Shopify on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const response = await fetch('/api/shopify/products')
      if (response.ok) {
        const data = await response.json()
        if (data.products && data.products.length > 0) {
          setProducts(data.products)
          setIsDemo(false)
        } else {
          setProducts(DEMO_PRODUCTS)
          setIsDemo(true)
        }
      } else {
        setProducts(DEMO_PRODUCTS)
        setIsDemo(true)
      }
    } catch {
      setProducts(DEMO_PRODUCTS)
      setIsDemo(true)
    } finally {
      setLoadingProducts(false)
    }
  }

  // Filter products by search
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle module selection with product check
  const handleModuleClick = (moduleId: ContentModule) => {
    if (moduleId === 'dashboard') {
      setActiveModule('dashboard')
      return
    }
    // Show product selector first
    setPendingModule(moduleId)
    setShowProductSelector(true)
  }

  // Handle product selection
  const handleProductSelect = (product: ShopifyProduct) => {
    setSelectedProduct(product)
    setShowProductSelector(false)
    if (pendingModule) {
      setActiveModule(pendingModule)
      setPendingModule(null)
    }
  }

  // Continue without product
  const continueWithoutProduct = () => {
    setSelectedProduct(null)
    setShowProductSelector(false)
    if (pendingModule) {
      setActiveModule(pendingModule)
      setPendingModule(null)
    }
  }

  // Go back to dashboard
  const goBack = () => {
    setActiveModule('dashboard')
    setSelectedProduct(null)
  }

  // Quick action - directly open module with product
  const quickAction = (product: ShopifyProduct, moduleId: ContentModule) => {
    setSelectedProduct(product)
    setActiveModule(moduleId)
  }

  // Handle export from VideoCreator
  const handleExport = (project: VideoProject) => {
    setExportProject(project)
    setShowExportModal(true)
  }

  // Download project as JSON
  const downloadProjectJson = () => {
    if (!exportProject) return
    const dataStr = JSON.stringify(exportProject, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${exportProject.name.replace(/\s+/g, '-').toLowerCase()}-project.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Download scripts as text
  const downloadScripts = () => {
    if (!exportProject) return
    const scripts = exportProject.scenes.map((scene, i) =>
      `Scene ${i + 1} (${scene.duration}s):\n${scene.script}\n`
    ).join('\n---\n\n')
    const blob = new Blob([scripts], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${exportProject.name.replace(/\s+/g, '-').toLowerCase()}-scripts.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveModule('dashboard')}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 dark:text-white">
                    DataBake<span className="text-pink-500">.media</span>
                  </h1>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Content Creation Suite
                  </p>
                </div>
              </button>

              {/* Breadcrumb when in module */}
              {activeModule !== 'dashboard' && (
                <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <button
                    onClick={goBack}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </button>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {MODULES.find(m => m.id === activeModule)?.name}
                  </span>
                  {selectedProduct && (
                    <>
                      <span className="text-slate-400">/</span>
                      <span className="text-sm text-slate-500">{selectedProduct.title}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Module Quick Access */}
            {activeModule === 'dashboard' && (
              <div className="hidden lg:flex items-center gap-1">
                {MODULES.map(module => {
                  const Icon = module.icon
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module.id as ContentModule)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{module.name}</span>
                    </button>
                  )
                })}
              </div>
            )}

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

      {/* Product Selector Modal */}
      <AnimatePresence>
        {showProductSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Select a Product</h2>
                  <p className="text-sm text-slate-500">Choose which product to work with</p>
                </div>
                <button
                  onClick={() => {
                    setShowProductSelector(false)
                    setPendingModule(null)
                  }}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Demo Mode Warning */}
              {isDemo && (
                <div className="mx-4 mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Demo Mode:</strong> Connect your Shopify store in settings to see your real products.
                    </p>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-4 pt-0 grid sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
                {loadingProducts ? (
                  <div className="col-span-2 flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-slate-500">
                    No products found
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-all hover:shadow-md border-2 border-transparent hover:border-blue-500"
                    >
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {getProductPrice(product)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                <button
                  onClick={fetchProducts}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={continueWithoutProduct}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Continue without product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && exportProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Download className="w-5 h-5 text-purple-500" />
                    Export Project
                  </h2>
                  <p className="text-sm text-slate-500">{exportProject.name}</p>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Project Summary */}
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Project Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-500">Scenes:</div>
                    <div className="text-slate-700 dark:text-slate-300">{exportProject.scenes.length}</div>
                    <div className="text-slate-500">Duration:</div>
                    <div className="text-slate-700 dark:text-slate-300">{exportProject.totalDuration}s</div>
                    <div className="text-slate-500">Type:</div>
                    <div className="text-slate-700 dark:text-slate-300 capitalize">{exportProject.type}</div>
                    {exportProject.music && (
                      <>
                        <div className="text-slate-500">Music:</div>
                        <div className="text-slate-700 dark:text-slate-300">{exportProject.music.title}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Download Options */}
                <div className="space-y-2">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Download</h3>
                  <button
                    onClick={downloadProjectJson}
                    className="w-full p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center gap-3 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-700 dark:text-slate-300">Project Data (JSON)</p>
                      <p className="text-xs text-slate-500">Complete project with all settings</p>
                    </div>
                  </button>

                  <button
                    onClick={downloadScripts}
                    className="w-full p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center gap-3 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-700 dark:text-slate-300">Scripts (TXT)</p>
                      <p className="text-xs text-slate-500">All scene scripts for voiceover</p>
                    </div>
                  </button>
                </div>

                {/* Free Tools for Editing */}
                <div className="space-y-2">
                  <h3 className="font-medium text-slate-700 dark:text-slate-300">Edit with Free Tools</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'CapCut', url: 'https://www.capcut.com', desc: 'Video editing' },
                      { name: 'Canva', url: 'https://www.canva.com', desc: 'Design & video' },
                      { name: 'DaVinci Resolve', url: 'https://www.blackmagicdesign.com/products/davinciresolve', desc: 'Pro editing' },
                      { name: 'Clipchamp', url: 'https://clipchamp.com', desc: 'Quick edits' },
                    ].map(tool => (
                      <a
                        key={tool.name}
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">{tool.name}</p>
                        <p className="text-xs text-slate-500">{tool.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Next Steps</h4>
                  <ol className="text-sm text-green-600 dark:text-green-300 space-y-1 list-decimal list-inside">
                    <li>Download your project data</li>
                    <li>Use the generated videos from Prompts tab</li>
                    <li>Import into CapCut or your preferred editor</li>
                    <li>Add the background music track</li>
                    <li>Export and share on social media!</li>
                  </ol>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {activeModule === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Welcome to DataBake
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Create professional content for your e-commerce products
                </p>
              </div>

              {/* Content Pipeline — Main CTA */}
              <Link href="/pipeline">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-databake-turquoise/20 via-white to-databake-pink/20 dark:from-databake-turquoise/10 dark:via-slate-800 dark:to-databake-pink/10 border-2 border-databake-turquoise/30 dark:border-databake-turquoise/20 hover:shadow-glow-turquoise transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-databake-turquoise to-databake-pink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Workflow className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        Content Pipeline
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Create daily video content fast — Product → Template → AI Prompts → Assets → Publish
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-databake-turquoise-dark group-hover:translate-x-2 transition-transform" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['AI Prompts per Cut', 'Grok Imagine Integration', 'ElevenLabs Audio', 'One-Click Publish'].map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/80 dark:bg-slate-700/80 text-xs font-medium text-slate-600 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Link>

              {/* Pipeline Tools Grid */}
              <div className="mb-8">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-databake-turquoise-dark" />
                  Pipeline Tools
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/pipeline">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0 }}
                      className="p-5 rounded-2xl bg-databake-turquoise/10 dark:bg-databake-turquoise/5 border border-databake-turquoise/20 dark:border-databake-turquoise/10 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-databake-turquoise to-databake-turquoise-dark flex items-center justify-center mb-3 shadow-md">
                        <LayoutTemplate className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">My Templates</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">CapCut & Canva favorites</p>
                    </motion.div>
                  </Link>
                  <Link href="/pipeline">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="p-5 rounded-2xl bg-databake-pink/10 dark:bg-databake-pink/5 border border-databake-pink/20 dark:border-databake-pink/10 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-databake-pink to-databake-pink-dark flex items-center justify-center mb-3 shadow-md">
                        <MessageSquareText className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Captions</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Fixed captions per product</p>
                    </motion.div>
                  </Link>
                  <Link href="/pipeline">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200/50 dark:border-purple-800/20 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 shadow-md">
                        <Scissors className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Video Splitter</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Split clips into parts</p>
                    </motion.div>
                  </Link>
                  <Link href="/pipeline">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="p-5 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/20 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                        <Send className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Publisher</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Post to all networks</p>
                    </motion.div>
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {QUICK_STATS.map(stat => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-700 ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {stat.value}
                        </p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Creation Modules */}
              <div className="mb-8">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  Content Creation Tools
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MODULES.map((module, idx) => {
                    const Icon = module.icon
                    return (
                      <motion.button
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleModuleClick(module.id as ContentModule)}
                        className={`p-6 rounded-2xl ${module.bgColor} border border-slate-200 dark:border-slate-700 text-left hover:shadow-xl hover:-translate-y-1 transition-all group`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                          {module.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {module.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {module.features.map((feature, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Products Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-500" />
                    Your Products
                    {isDemo && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        Demo
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={fetchProducts}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingProducts ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {loadingProducts ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                      >
                        <div className="relative mb-3 overflow-hidden rounded-xl">
                          <img
                            src={getProductImageUrl(product)}
                            alt={product.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">
                          {product.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                            {getProductPrice(product)}
                          </span>
                          <div className="flex gap-1">
                            {MODULES.slice(0, 3).map(module => {
                              const Icon = module.icon
                              return (
                                <button
                                  key={module.id}
                                  onClick={() => quickAction(product, module.id as ContentModule)}
                                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
                                  title={`Create ${module.name}`}
                                >
                                  <Icon className="w-4 h-4" />
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Workflow Summary */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-databake-turquoise/10 to-databake-pink/10 dark:from-databake-turquoise/5 dark:to-databake-pink/5 border border-databake-turquoise/20 dark:border-databake-turquoise/10">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                  Daily Content Workflow
                </h3>
                <div className="grid md:grid-cols-6 gap-4">
                  {[
                    { step: 1, title: 'Product', desc: 'Select your product' },
                    { step: 2, title: 'Template', desc: 'Pick from favorites' },
                    { step: 3, title: 'AI Prompts', desc: 'Auto-generated per cut' },
                    { step: 4, title: 'Create Assets', desc: 'Grok + ElevenLabs' },
                    { step: 5, title: 'Edit', desc: 'CapCut / Canva' },
                    { step: 6, title: 'Publish', desc: 'All networks, 1 click' },
                  ].map((item, idx) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-databake-turquoise to-databake-pink text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      {idx < 5 && (
                        <ArrowRight className="w-4 h-4 text-databake-turquoise dark:text-databake-turquoise/50 hidden md:block ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Image Editor Module */}
          {activeModule === 'image-editor' && (
            <motion.div
              key="image-editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ImageEditor
                productImage={selectedProduct ? getProductImageUrl(selectedProduct) : undefined}
                productName={selectedProduct?.title}
              />
            </motion.div>
          )}

          {/* Video Creator Module */}
          {activeModule === 'video-creator' && (
            <motion.div
              key="video-creator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VideoCreator
                productImage={selectedProduct ? getProductImageUrl(selectedProduct) : undefined}
                productName={selectedProduct?.title}
                productDescription={selectedProduct?.description}
                productPrice={selectedProduct ? getProductPrice(selectedProduct) : undefined}
                onExport={handleExport}
              />
            </motion.div>
          )}

          {/* Stories Creator Module */}
          {activeModule === 'stories' && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StoriesCreator
                productImage={selectedProduct ? getProductImageUrl(selectedProduct) : undefined}
                productName={selectedProduct?.title}
              />
            </motion.div>
          )}

          {/* Ad Generator Module */}
          {activeModule === 'ads' && (
            <motion.div
              key="ads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdGenerator
                productImage={selectedProduct ? getProductImageUrl(selectedProduct) : undefined}
                productName={selectedProduct?.title}
                productPrice={selectedProduct ? getProductPrice(selectedProduct) : undefined}
                productFeatures={selectedProduct ? extractFeatures(selectedProduct.description) : undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 lg:hidden z-40">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setActiveModule('dashboard')}
            className={`flex flex-col items-center p-2 ${
              activeModule === 'dashboard' ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          {MODULES.map(module => {
            const Icon = module.icon
            return (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module.id as ContentModule)}
                className={`flex flex-col items-center p-2 ${
                  activeModule === module.id ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{module.name.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </main>
  )
}
