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
    title: 'Serum Vitamina C Premium',
    description: 'Serum facial con vitamina C pura al 20%. Ilumina, hidrata y protege tu piel de los radicales libres. Resultados visibles en 2 semanas.',
    handle: 'serum-vitamina-c',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
          altText: 'Serum Vitamina C'
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
    title: 'Auriculares Bluetooth Pro',
    description: 'Auriculares inalámbricos con cancelación de ruido activa. 30 horas de batería, sonido Hi-Fi y conexión multipunto.',
    handle: 'auriculares-bluetooth',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
          altText: 'Auriculares Bluetooth'
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
    title: 'Botella Térmica Eco',
    description: 'Botella de acero inoxidable de 750ml. Mantiene bebidas frías 24h o calientes 12h. Libre de BPA y eco-friendly.',
    handle: 'botella-termica',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
          altText: 'Botella Térmica'
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
    title: 'Zapatillas Running Ultra',
    description: 'Zapatillas deportivas con tecnología de amortiguación avanzada. Ultraligeras, transpirables y con soporte para arco.',
    handle: 'zapatillas-running',
    images: {
      edges: [{
        node: {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          altText: 'Zapatillas Running'
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
    title: 'Smartwatch Fitness Plus',
    description: 'Reloj inteligente con monitor de salud 24/7. Mide ritmo cardíaco, oxígeno en sangre, sueño y más de 100 modos deportivos.',
    handle: 'smartwatch-fitness',
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
    <div className="glass-card p-4">
      {useDemo && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200">
          <span className="font-medium">Modo Demo:</span> Conecta tu tienda Shopify en la configuración para ver tus productos reales.
        </div>
      )}

      {/* Selected Product Display */}
      {selectedProduct ? (
        <div className="flex items-center gap-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-4">
          <img
            src={getImageUrl(selectedProduct)}
            alt={selectedProduct.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{selectedProduct.title}</h3>
            <p className="text-sm text-white/60">
              ${selectedProduct.priceRange.minVariantPrice.amount} {selectedProduct.priceRange.minVariantPrice.currencyCode}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-white/60"
        >
          <span className="text-2xl block mb-2">📦</span>
          Click para seleccionar un producto
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
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glass mb-4"
            />

            {/* Products List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  No se encontraron productos
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
                        ? 'bg-purple-500/20 border border-purple-500/30'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={getImageUrl(product)}
                      alt={product.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-medium truncate">{product.title}</h4>
                      <p className="text-sm text-white/50">
                        ${product.priceRange.minVariantPrice.amount}
                      </p>
                    </div>
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
