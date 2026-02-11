'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ChefHat, Settings } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/HeaderControls'
import { UserMenu } from '@/components/UserMenu'
import ContentPipeline from '@/components/pipeline/ContentPipeline'
import { ShopifyProduct } from '@/types'

// Demo products fallback
const DEMO_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'demo-1',
    title: 'Premium Wireless Headphones',
    description: 'High-quality noise-cancelling headphones with 40-hour battery life. Crystal clear sound and comfortable fit for all-day wear.',
    handle: 'wireless-headphones',
    images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', altText: 'Wireless Headphones' } }] },
    priceRange: { minVariantPrice: { amount: '199.99', currencyCode: 'USD' } },
    variants: { edges: [] }
  },
  {
    id: 'demo-2',
    title: 'Smart Fitness Watch',
    description: 'Track your health and fitness with advanced sensors. Heart rate, GPS, sleep tracking and 100+ workout modes.',
    handle: 'fitness-watch',
    images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', altText: 'Smart Watch' } }] },
    priceRange: { minVariantPrice: { amount: '299.99', currencyCode: 'USD' } },
    variants: { edges: [] }
  },
  {
    id: 'demo-3',
    title: 'Organic Skincare Set',
    description: 'Natural skincare routine with premium organic ingredients. Vegan, cruelty-free and eco-friendly packaging.',
    handle: 'skincare-set',
    images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', altText: 'Skincare Set' } }] },
    priceRange: { minVariantPrice: { amount: '89.99', currencyCode: 'USD' } },
    variants: { edges: [] }
  },
  {
    id: 'demo-4',
    title: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° immersive sound. 24-hour battery life, perfect for outdoor adventures.',
    handle: 'bluetooth-speaker',
    images: { edges: [{ node: { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', altText: 'Bluetooth Speaker' } }] },
    priceRange: { minVariantPrice: { amount: '149.99', currencyCode: 'USD' } },
    variants: { edges: [] }
  }
]

export default function PipelinePage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/shopify/products')
      if (response.ok) {
        const data = await response.json()
        if (data.products && data.products.length > 0) {
          setProducts(data.products)
        } else {
          setProducts(DEMO_PRODUCTS)
        }
      } else {
        setProducts(DEMO_PRODUCTS)
      }
    } catch {
      setProducts(DEMO_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-slate-900 dark:text-white">
                    DataBake<span className="text-pink-500">.media</span>
                  </h1>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Content Pipeline
                  </p>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700">
                <Link
                  href="/"
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                </Link>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Content Pipeline
                </span>
              </div>
            </div>

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

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-24"
          >
            <div className="w-12 h-12 border-4 border-databake-turquoise border-t-transparent rounded-full animate-spin" />
          </motion.div>
        ) : (
          <ContentPipeline products={products} onBack={() => window.history.back()} />
        )}
      </div>
    </main>
  )
}
