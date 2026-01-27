'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
        <div className="mb-4 p-3 bg-clickboom-turquoise/10 border border-clickboom-turquoise/30 rounded-xl text-sm text-clickboom-text flex items-start gap-2">
          <svg className="w-5 h-5 text-clickboom-turquoise flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><strong>Demo Mode:</strong> Connect your Shopify store in settings to see your real products.</span>
        </div>
      )}

      {/* Selected Product Display */}
      {selectedProduct ? (
        <div className="flex items-center gap-4 p-4 bg-clickboom-turquoise/10 border border-clickboom-turquoise/30 rounded-xl mb-4">
          <img
            src={getImageUrl(selectedProduct)}
            alt={selectedProduct.title}
            className="w-16 h-16 rounded-xl object-cover shadow-soft"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-clickboom-text truncate">{selectedProduct.title}</h3>
            <p className="text-sm text-clickboom-text-light">
              ${selectedProduct.priceRange.minVariantPrice.amount} {selectedProduct.priceRange.minVariantPrice.currencyCode}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-clickboom-text font-medium"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-clickboom-turquoise hover:bg-clickboom-turquoise/5 transition-all text-clickboom-text-light group"
        >
          <svg className="w-10 h-10 mx-auto mb-2 text-gray-400 group-hover:text-clickboom-turquoise transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="font-medium">Click to select a product</span>
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
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
                <div className="text-center py-8 text-clickboom-text-light">
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
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedProduct?.id === product.id
                        ? 'bg-clickboom-turquoise/20 border-2 border-clickboom-turquoise'
                        : 'bg-gray-50 hover:bg-clickboom-turquoise/10 border-2 border-transparent hover:border-clickboom-turquoise/30'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <img
                      src={getImageUrl(product)}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-medium text-clickboom-text truncate">{product.title}</h4>
                      <p className="text-sm text-clickboom-text-light">
                        ${product.priceRange.minVariantPrice.amount}
                      </p>
                    </div>
                    {selectedProduct?.id === product.id && (
                      <svg className="w-5 h-5 text-clickboom-turquoise" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
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
