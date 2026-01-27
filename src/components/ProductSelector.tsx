'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Search, Info, CheckCircle2, RefreshCw } from 'lucide-react'
import { ShopifyProduct } from '@/types'

interface ProductSelectorProps {
  selectedProduct: ShopifyProduct | null
  onSelect: (product: ShopifyProduct) => void
}

// Demo products for when Shopify is not connected
const DEMO_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'demo-1',
    title: 'Premium Vitamin C Serum',
    description: 'Facial serum with pure 20% vitamin C. Brightens, hydrates and protects your skin from free radicals. Visible results in 2 weeks.',
    handle: 'vitamin-c-serum',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
          altText: 'Vitamin C Serum'
        }
      }]
    },
    priceRange: {
      minVariantPrice: { amount: '29.99', currencyCode: 'USD' }
    },
    variants: { edges: [] }
  },
  {
    id: 'demo-2',
    title: 'Pro Bluetooth Headphones',
    description: 'Wireless headphones with active noise cancellation. 30 hours battery, Hi-Fi sound and multipoint connection.',
    handle: 'bluetooth-headphones',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          altText: 'Bluetooth Headphones'
        }
      }]
    },
    priceRange: {
      minVariantPrice: { amount: '79.99', currencyCode: 'USD' }
    },
    variants: { edges: [] }
  },
  {
    id: 'demo-3',
    title: 'Eco Thermal Bottle',
    description: 'Stainless steel bottle 750ml. Keeps drinks cold 24h or hot 12h. BPA free and eco-friendly.',
    handle: 'thermal-bottle',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
          altText: 'Thermal Bottle'
        }
      }]
    },
    priceRange: {
      minVariantPrice: { amount: '24.99', currencyCode: 'USD' }
    },
    variants: { edges: [] }
  },
  {
    id: 'demo-4',
    title: 'Ultra Running Shoes',
    description: 'Sports shoes with advanced cushioning technology. Ultralight, breathable and with arch support.',
    handle: 'running-shoes',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          altText: 'Running Shoes'
        }
      }]
    },
    priceRange: {
      minVariantPrice: { amount: '89.99', currencyCode: 'USD' }
    },
    variants: { edges: [] }
  },
  {
    id: 'demo-5',
    title: 'Fitness Plus Smartwatch',
    description: 'Smart watch with 24/7 health monitor. Measures heart rate, blood oxygen, sleep and over 100 sports modes.',
    handle: 'fitness-smartwatch',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
          altText: 'Smartwatch'
        }
      }]
    },
    priceRange: {
      minVariantPrice: { amount: '149.99', currencyCode: 'USD' }
    },
    variants: { edges: [] }
  }
]

export function ProductSelector({ selectedProduct, onSelect }: ProductSelectorProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [useDemo, setUseDemo] = useState(false)

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
          setUseDemo(false)
        } else {
          setProducts(DEMO_PRODUCTS)
          setUseDemo(true)
        }
      } else {
        setProducts(DEMO_PRODUCTS)
        setUseDemo(true)
      }
    } catch {
      setProducts(DEMO_PRODUCTS)
      setUseDemo(true)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getImageUrl = (product: ShopifyProduct) => {
    return product.images.edges[0]?.node.url || 'https://via.placeholder.com/100'
  }

  return (
    <div>
      {useDemo && (
        <div className="mb-4 p-4 glass-subtle flex items-start gap-3">
          <div className="icon-turquoise flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-tada-text">
              <strong>Demo Mode:</strong> Connect your Shopify store in settings to see your real products.
            </p>
          </div>
        </div>
      )}

      {/* Selected Product Display */}
      {selectedProduct ? (
        <div className="flex items-center gap-4 p-4 glass-subtle border-2 border-tada-turquoise/30 mb-4">
          <img
            src={getImageUrl(selectedProduct)}
            alt={selectedProduct.title}
            className="w-16 h-16 rounded-xl object-cover shadow-glass-sm"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-tada-text truncate">{selectedProduct.title}</h3>
            <p className="text-sm text-tada-text-light">
              ${selectedProduct.priceRange.minVariantPrice.amount} {selectedProduct.priceRange.minVariantPrice.currencyCode}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-ghost flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-8 border-2 border-dashed border-tada-turquoise/30 rounded-2xl hover:border-tada-turquoise hover:bg-tada-turquoise/5 transition-all text-tada-text-light group"
        >
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-tada-turquoise/10 flex items-center justify-center group-hover:bg-tada-turquoise/20 transition-colors">
            <Package className="w-7 h-7 text-tada-turquoise-dark" />
          </div>
          <span className="font-medium text-tada-text">Click to select a product</span>
        </button>
      )}

      {/* Product Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4"
          >
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tada-text-muted" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>

            {/* Products List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 rounded-full spinner" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-tada-text-light">
                  No products found
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <motion.button
                    key={product.id}
                    onClick={() => {
                      onSelect(product)
                      setIsOpen(false)
                      setSearchTerm('')
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                      selectedProduct?.id === product.id
                        ? 'glass-subtle border-2 border-tada-turquoise glow-turquoise'
                        : 'bg-white/40 hover:bg-white/60 border-2 border-transparent hover:border-tada-turquoise/20'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <img
                      src={getImageUrl(product)}
                      alt={product.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-medium text-tada-text truncate">{product.title}</h4>
                      <p className="text-sm text-tada-text-light">
                        ${product.priceRange.minVariantPrice.amount}
                      </p>
                    </div>
                    {selectedProduct?.id === product.id && (
                      <CheckCircle2 className="w-5 h-5 text-tada-turquoise-dark" />
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
