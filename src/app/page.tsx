'use client'

import { useState } from 'react'
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
  Play,
  Home as HomeIcon,
  Layers,
  Film,
  Megaphone,
  Plus,
  Clock,
  TrendingUp,
  Star,
  ChevronLeft,
  X
} from 'lucide-react'
import { ThemeToggle } from '@/components/HeaderControls'
import { UserMenu } from '@/components/UserMenu'
import { ImageEditor } from '@/components/ImageEditor'
import { VideoCreator } from '@/components/VideoCreator'
import { StoriesCreator } from '@/components/StoriesCreator'
import { AdGenerator } from '@/components/AdGenerator'

// Content types / Modules
type ContentModule = 'dashboard' | 'image-editor' | 'video-creator' | 'stories' | 'ads'

// Product interface
interface Product {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  features?: string[]
}

// Mock products
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality noise-cancelling headphones with 40-hour battery life',
    price: '$199.99',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    features: ['Noise Cancelling', '40h Battery', 'Premium Sound']
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness with advanced sensors',
    price: '$299.99',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    features: ['Heart Rate', 'GPS', 'Water Resistant']
  },
  {
    id: '3',
    name: 'Organic Skincare Set',
    description: 'Natural skincare routine with premium ingredients',
    price: '$89.99',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300',
    features: ['100% Natural', 'Vegan', 'Eco-Friendly']
  },
  {
    id: '4',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° sound and 24-hour battery',
    price: '$149.99',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
    features: ['Waterproof', '360° Sound', '24h Battery']
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
    description: 'Create videos scene by scene',
    icon: Video,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    features: ['Scene Editor', 'Free Tool Prompts', 'Upload Videos']
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

export default function Home() {
  // Module state
  const [activeModule, setActiveModule] = useState<ContentModule>('dashboard')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductSelector, setShowProductSelector] = useState(false)

  // Handle module selection with product check
  const handleModuleClick = (moduleId: ContentModule) => {
    if (moduleId === 'dashboard') {
      setActiveModule('dashboard')
      return
    }
    // Show product selector first
    setShowProductSelector(true)
    setActiveModule(moduleId)
  }

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setShowProductSelector(false)
  }

  // Go back to dashboard
  const goBack = () => {
    setActiveModule('dashboard')
    setSelectedProduct(null)
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
                      <span className="text-sm text-slate-500">{selectedProduct.name}</span>
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
                  onClick={() => setShowProductSelector(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-4 grid sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                {MOCK_PRODUCTS.map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-all hover:shadow-md"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {product.price}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <button
                  onClick={() => {
                    setSelectedProduct(null)
                    setShowProductSelector(false)
                  }}
                  className="w-full py-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  Continue without product
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

              {/* Recent Products */}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-500" />
                  Your Products
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_PRODUCTS.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                    >
                      <div className="relative mb-3 overflow-hidden rounded-xl">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                          {product.price}
                        </span>
                        <div className="flex gap-1">
                          {MODULES.slice(0, 3).map(module => {
                            const Icon = module.icon
                            return (
                              <button
                                key={module.id}
                                onClick={() => {
                                  setSelectedProduct(product)
                                  setActiveModule(module.id as ContentModule)
                                }}
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
              </div>

              {/* Workflow Summary */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                  Video Creation Workflow
                </h3>
                <div className="grid md:grid-cols-5 gap-4">
                  {[
                    { step: 1, title: 'Generate Image', desc: 'AI creates scene image' },
                    { step: 2, title: 'Get Prompts', desc: 'Copy prompts for Grok/Pika' },
                    { step: 3, title: 'Create Video', desc: 'Use free tools externally' },
                    { step: 4, title: 'Upload Back', desc: 'Import video to platform' },
                    { step: 5, title: 'Export', desc: 'Download final project' },
                  ].map((item, idx) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      {idx < 4 && (
                        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 hidden md:block ml-auto" />
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
                productImage={selectedProduct?.imageUrl}
                productName={selectedProduct?.name}
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
                productImage={selectedProduct?.imageUrl}
                productName={selectedProduct?.name}
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
                productImage={selectedProduct?.imageUrl}
                productName={selectedProduct?.name}
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
                productImage={selectedProduct?.imageUrl}
                productName={selectedProduct?.name}
                productPrice={selectedProduct?.price}
                productFeatures={selectedProduct?.features}
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
