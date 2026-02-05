'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image as ImageIcon,
  Type,
  Square,
  Circle,
  Trash2,
  Copy,
  Layers,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Upload,
  Palette,
  Wand2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Scissors,
  Sparkles,
  RefreshCw,
  Check,
  X,
  AlertCircle
} from 'lucide-react'
import { IMAGE_EXPORT_PRESETS, ImageLayer, ShadowConfig, GradientBackground } from '@/types/content'

interface ImageEditorProps {
  productImage?: string
  productName?: string
  onExport?: (dataUrl: string, format: string) => void
}

const FONTS = [
  'Inter', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman',
  'Verdana', 'Impact', 'Comic Sans MS', 'Courier New', 'Trebuchet MS'
]

const BACKGROUND_COLORS = [
  '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA',
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#000000', '#1a1a2e', '#16213e', '#0f3460', '#533483',
  'transparent'
]

const GRADIENT_PRESETS: GradientBackground[] = [
  { type: 'linear', colors: ['#667eea', '#764ba2'], angle: 135 },
  { type: 'linear', colors: ['#f093fb', '#f5576c'], angle: 135 },
  { type: 'linear', colors: ['#4facfe', '#00f2fe'], angle: 135 },
  { type: 'linear', colors: ['#43e97b', '#38f9d7'], angle: 135 },
  { type: 'linear', colors: ['#fa709a', '#fee140'], angle: 135 },
  { type: 'linear', colors: ['#a8edea', '#fed6e3'], angle: 135 },
  { type: 'radial', colors: ['#667eea', '#764ba2'] },
  { type: 'radial', colors: ['#ffecd2', '#fcb69f'] },
]

export function ImageEditor({ productImage, productName, onExport }: ImageEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 })
  const [zoom, setZoom] = useState(0.4)
  const [background, setBackground] = useState<string | GradientBackground>('#FFFFFF')

  // Layers state
  const [layers, setLayers] = useState<ImageLayer[]>([])
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)

  // Tool state
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'shape'>('select')
  const [activePanel, setActivePanel] = useState<'layers' | 'background' | 'effects' | 'export'>('layers')

  // Background removal state
  const [isRemovingBg, setIsRemovingBg] = useState(false)
  const [bgRemovalProgress, setBgRemovalProgress] = useState(0)

  // Export state
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  // Dragging state
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Selected layer
  const selectedLayer = layers.find(l => l.id === selectedLayerId)

  // Add product image as first layer
  const addProductImage = useCallback(() => {
    if (!productImage) return
    const newLayer: ImageLayer = {
      id: `layer-${Date.now()}`,
      type: 'image',
      x: canvasSize.width / 2 - 200,
      y: canvasSize.height / 2 - 200,
      width: 400,
      height: 400,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      src: productImage
    }
    setLayers(prev => [...prev, newLayer])
    setSelectedLayerId(newLayer.id)
  }, [productImage, canvasSize])

  // Add custom image from file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const src = event.target?.result as string
      const newLayer: ImageLayer = {
        id: `layer-${Date.now()}`,
        type: 'image',
        x: canvasSize.width / 2 - 150,
        y: canvasSize.height / 2 - 150,
        width: 300,
        height: 300,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        src
      }
      setLayers(prev => [...prev, newLayer])
      setSelectedLayerId(newLayer.id)
    }
    reader.readAsDataURL(file)
  }

  // Add text layer
  const addTextLayer = () => {
    const newLayer: ImageLayer = {
      id: `layer-${Date.now()}`,
      type: 'text',
      x: canvasSize.width / 2 - 100,
      y: canvasSize.height / 2 - 25,
      width: 200,
      height: 50,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      text: 'Your Text Here',
      fontFamily: 'Inter',
      fontSize: 32,
      fontWeight: 'bold',
      fontColor: '#000000',
      textAlign: 'center'
    }
    setLayers(prev => [...prev, newLayer])
    setSelectedLayerId(newLayer.id)
  }

  // Add shape layer
  const addShapeLayer = (shape: 'rectangle' | 'circle') => {
    const newLayer: ImageLayer = {
      id: `layer-${Date.now()}`,
      type: 'shape',
      x: canvasSize.width / 2 - 75,
      y: canvasSize.height / 2 - 75,
      width: 150,
      height: 150,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      shape,
      fillColor: '#4ECDC4',
      strokeColor: '#000000',
      strokeWidth: 0
    }
    setLayers(prev => [...prev, newLayer])
    setSelectedLayerId(newLayer.id)
  }

  // Update layer
  const updateLayer = (id: string, updates: Partial<ImageLayer>) => {
    setLayers(prev => prev.map(layer =>
      layer.id === id ? { ...layer, ...updates } : layer
    ))
  }

  // Delete layer
  const deleteLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id))
    if (selectedLayerId === id) setSelectedLayerId(null)
  }

  // Duplicate layer
  const duplicateLayer = (id: string) => {
    const layer = layers.find(l => l.id === id)
    if (!layer) return
    const newLayer = {
      ...layer,
      id: `layer-${Date.now()}`,
      x: layer.x + 20,
      y: layer.y + 20
    }
    setLayers(prev => [...prev, newLayer])
    setSelectedLayerId(newLayer.id)
  }

  // Move layer order
  const moveLayerOrder = (id: string, direction: 'up' | 'down') => {
    setLayers(prev => {
      const index = prev.findIndex(l => l.id === id)
      if (index === -1) return prev
      const newLayers = [...prev]
      const newIndex = direction === 'up' ? index + 1 : index - 1
      if (newIndex < 0 || newIndex >= newLayers.length) return prev
      ;[newLayers[index], newLayers[newIndex]] = [newLayers[newIndex], newLayers[index]]
      return newLayers
    })
  }

  // State for background removal tools modal
  const [showBgToolsModal, setShowBgToolsModal] = useState(false)

  // Free background removal tools
  const FREE_BG_REMOVAL_TOOLS = [
    { id: 'removebg', name: 'Remove.bg', url: 'https://www.remove.bg', freeCredits: '1 free HD/month', bestFor: 'Best quality, one-click' },
    { id: 'photoroom', name: 'PhotoRoom Web', url: 'https://www.photoroom.com/background-remover', freeCredits: 'Unlimited (watermark)', bestFor: 'Quick, no signup' },
    { id: 'adobe', name: 'Adobe Express', url: 'https://www.adobe.com/express/feature/image/remove-background', freeCredits: 'Free tier available', bestFor: 'Professional quality' },
    { id: 'canva', name: 'Canva BG Remover', url: 'https://www.canva.com/features/background-remover/', freeCredits: 'Free (Pro for HD)', bestFor: 'If you use Canva' },
    { id: 'pixlr', name: 'Pixlr BG Remover', url: 'https://pixlr.com/remove-background/', freeCredits: 'Unlimited', bestFor: 'Fast, no login' },
  ]

  // Download image for external processing
  const downloadForBgRemoval = () => {
    if (!selectedLayer || selectedLayer.type !== 'image' || !selectedLayer.src) return

    const link = document.createElement('a')
    link.href = selectedLayer.src
    link.download = `image-for-bg-removal-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Open background removal tools modal
  const removeBackground = () => {
    if (!selectedLayer || selectedLayer.type !== 'image' || !selectedLayer.src) return
    setShowBgToolsModal(true)
  }

  // Handle re-upload of processed image
  const handleBgRemovedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedLayer) return

    const reader = new FileReader()
    reader.onload = (event) => {
      updateLayer(selectedLayer.id, { src: event.target?.result as string })
      setShowBgToolsModal(false)
    }
    reader.readAsDataURL(file)
    e.target.value = '' // Reset input
  }

  // Get background style
  const getBackgroundStyle = () => {
    if (background === 'transparent') {
      return {
        backgroundImage: 'repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%)',
        backgroundSize: '20px 20px'
      }
    }
    if (typeof background === 'string') {
      return { backgroundColor: background }
    }
    const gradient = background as GradientBackground
    if (gradient.type === 'linear') {
      return {
        background: `linear-gradient(${gradient.angle || 135}deg, ${gradient.colors.join(', ')})`
      }
    }
    return {
      background: `radial-gradient(circle, ${gradient.colors.join(', ')})`
    }
  }

  // Export canvas as image
  const handleExport = async (preset: typeof IMAGE_EXPORT_PRESETS[0]) => {
    if (!canvasRef.current) return

    setIsExporting(true)

    try {
      // Dynamic import html2canvas
      const html2canvas = (await import('html2canvas')).default

      // Temporarily set zoom to 1 for export
      const originalZoom = zoom
      setZoom(1)

      // Wait for re-render
      await new Promise(resolve => setTimeout(resolve, 100))

      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: background === 'transparent' ? null : undefined,
        scale: preset.width / canvasSize.width,
        useCORS: true,
        allowTaint: true,
        width: canvasSize.width,
        height: canvasSize.height
      })

      // Restore zoom
      setZoom(originalZoom)

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0)

      // Download
      const link = document.createElement('a')
      link.download = `${productName || 'design'}-${preset.id}.png`
      link.href = dataUrl
      link.click()

      if (onExport) {
        onExport(dataUrl, 'png')
      }

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 2000)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Export all sizes
  const exportAllSizes = async () => {
    for (const preset of IMAGE_EXPORT_PRESETS) {
      setCanvasSize({ width: preset.width, height: preset.height })
      await new Promise(resolve => setTimeout(resolve, 200))
      await handleExport(preset)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // Handle mouse down on layer (start drag)
  const handleLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
    const layer = layers.find(l => l.id === layerId)
    if (!layer || layer.locked) return

    setSelectedLayerId(layerId)
    setDraggedLayer(layerId)

    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  // Handle mouse move (dragging)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedLayer || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const newX = (e.clientX - canvasRect.left - dragOffset.x) / zoom
    const newY = (e.clientY - canvasRect.top - dragOffset.y) / zoom

    updateLayer(draggedLayer, { x: newX, y: newY })
  }, [draggedLayer, dragOffset, zoom])

  // Handle mouse up (end drag)
  const handleMouseUp = useCallback(() => {
    setDraggedLayer(null)
  }, [])

  // Add/remove event listeners for dragging
  useEffect(() => {
    if (draggedLayer) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggedLayer, handleMouseMove, handleMouseUp])

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px] bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden">
      {/* Left Toolbar */}
      <div className="w-16 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-4 gap-2">
        <button
          onClick={() => setActiveTool('select')}
          className={`p-3 rounded-xl transition-colors ${
            activeTool === 'select'
              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}
          title="Select & Move"
        >
          <Move className="w-5 h-5" />
        </button>

        <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 my-2" />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
          title="Upload Image"
        >
          <Upload className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {productImage && (
          <button
            onClick={addProductImage}
            className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            title="Add Product Image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={addTextLayer}
          className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
          title="Add Text"
        >
          <Type className="w-5 h-5" />
        </button>

        <button
          onClick={() => addShapeLayer('rectangle')}
          className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
          title="Add Rectangle"
        >
          <Square className="w-5 h-5" />
        </button>

        <button
          onClick={() => addShapeLayer('circle')}
          className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
          title="Add Circle"
        >
          <Circle className="w-5 h-5" />
        </button>

        <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 my-2" />

        <button
          onClick={() => setActivePanel('background')}
          className={`p-3 rounded-xl transition-colors ${
            activePanel === 'background'
              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}
          title="Background"
        >
          <Palette className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActivePanel('effects')}
          className={`p-3 rounded-xl transition-colors ${
            activePanel === 'effects'
              ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-600'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}
          title="Effects & AI"
        >
          <Wand2 className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setActivePanel('export')}
          className={`p-3 rounded-xl transition-colors ${
            activePanel === 'export'
              ? 'bg-green-100 dark:bg-green-900/50 text-green-600'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}
          title="Export"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="relative">
          {/* Zoom Controls */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(0.4)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="relative shadow-2xl rounded-lg overflow-hidden"
            style={{
              width: canvasSize.width * zoom,
              height: canvasSize.height * zoom,
              ...getBackgroundStyle()
            }}
          >
            {/* Layers */}
            {layers.filter(l => l.visible).map(layer => (
              <div
                key={layer.id}
                onMouseDown={(e) => handleLayerMouseDown(e, layer.id)}
                className={`absolute ${layer.locked ? 'cursor-not-allowed' : 'cursor-move'} ${
                  selectedLayerId === layer.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: layer.x * zoom,
                  top: layer.y * zoom,
                  width: layer.width * zoom,
                  height: layer.height * zoom,
                  transform: `rotate(${layer.rotation}deg)`,
                  opacity: layer.opacity,
                  filter: layer.shadow?.enabled
                    ? `drop-shadow(${layer.shadow.offsetX}px ${layer.shadow.offsetY}px ${layer.shadow.blur}px ${layer.shadow.color})`
                    : undefined
                }}
              >
                {layer.type === 'image' && layer.src && (
                  <img
                    src={layer.src}
                    alt=""
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                )}

                {layer.type === 'text' && (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      fontFamily: layer.fontFamily,
                      fontSize: (layer.fontSize || 16) * zoom,
                      fontWeight: layer.fontWeight,
                      color: layer.fontColor,
                      textAlign: layer.textAlign
                    }}
                  >
                    {layer.text}
                  </div>
                )}

                {layer.type === 'shape' && (
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundColor: layer.fillColor,
                      border: layer.strokeWidth ? `${layer.strokeWidth}px solid ${layer.strokeColor}` : 'none',
                      borderRadius: layer.shape === 'circle' ? '50%' : 0
                    }}
                  />
                )}

                {/* Selection handles */}
                {selectedLayerId === layer.id && !layer.locked && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full" />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Canvas Size Indicator */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-500">
            {canvasSize.width} x {canvasSize.height}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 overflow-y-auto">
        {/* Panel Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {['layers', 'background', 'effects', 'export'].map(panel => (
            <button
              key={panel}
              onClick={() => setActivePanel(panel as typeof activePanel)}
              className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${
                activePanel === panel
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {panel}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* Layers Panel */}
          {activePanel === 'layers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Layers</h3>
                <span className="text-xs text-slate-500">{layers.length} layers</span>
              </div>

              {layers.length === 0 ? (
                <div className="text-center py-8">
                  <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No layers yet</p>
                  <p className="text-xs text-slate-400 mt-1">Add images, text, or shapes</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {[...layers].reverse().map(layer => (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        selectedLayerId === layer.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                          : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                          {layer.type === 'image' && layer.src && (
                            <img src={layer.src} alt="" className="w-full h-full object-cover" />
                          )}
                          {layer.type === 'text' && <Type className="w-5 h-5 text-slate-400" />}
                          {layer.type === 'shape' && layer.shape === 'rectangle' && (
                            <Square className="w-5 h-5" style={{ color: layer.fillColor }} />
                          )}
                          {layer.type === 'shape' && layer.shape === 'circle' && (
                            <Circle className="w-5 h-5" style={{ color: layer.fillColor }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                            {layer.type === 'text' ? layer.text : `${layer.type} layer`}
                          </p>
                          <p className="text-xs text-slate-400 capitalize">{layer.type}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateLayer(layer.id, { visible: !layer.visible })
                            }}
                            className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded"
                          >
                            {layer.visible ? (
                              <Eye className="w-4 h-4 text-slate-400" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateLayer(layer.id, { locked: !layer.locked })
                            }}
                            className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded"
                          >
                            {layer.locked ? (
                              <Lock className="w-4 h-4 text-slate-400" />
                            ) : (
                              <Unlock className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {selectedLayerId === layer.id && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 flex items-center gap-1">
                          <button
                            onClick={() => moveLayerOrder(layer.id, 'up')}
                            className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-500"
                            title="Move Up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveLayerOrder(layer.id, 'down')}
                            className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-500"
                            title="Move Down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => duplicateLayer(layer.id)}
                            className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded text-slate-500"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <div className="flex-1" />
                          <button
                            onClick={() => deleteLayer(layer.id)}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Layer Properties */}
              {selectedLayer && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Properties</h4>

                  {/* Position & Size */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Width</label>
                      <input
                        type="number"
                        value={Math.round(selectedLayer.width)}
                        onChange={(e) => updateLayer(selectedLayer.id, { width: parseInt(e.target.value) || 100 })}
                        className="w-full px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Height</label>
                      <input
                        type="number"
                        value={Math.round(selectedLayer.height)}
                        onChange={(e) => updateLayer(selectedLayer.id, { height: parseInt(e.target.value) || 100 })}
                        className="w-full px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                      />
                    </div>
                  </div>

                  {/* Opacity */}
                  <div className="mb-3">
                    <label className="text-xs text-slate-500 mb-1 block">Opacity: {Math.round(selectedLayer.opacity * 100)}%</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedLayer.opacity}
                      onChange={(e) => updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Rotation */}
                  <div className="mb-3">
                    <label className="text-xs text-slate-500 mb-1 block">Rotation: {selectedLayer.rotation}°</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={selectedLayer.rotation}
                      onChange={(e) => updateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Text specific properties */}
                  {selectedLayer.type === 'text' && (
                    <>
                      <div className="mb-3">
                        <label className="text-xs text-slate-500 mb-1 block">Text</label>
                        <input
                          type="text"
                          value={selectedLayer.text || ''}
                          onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="text-xs text-slate-500 mb-1 block">Font</label>
                        <select
                          value={selectedLayer.fontFamily}
                          onChange={(e) => updateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                        >
                          {FONTS.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="text-xs text-slate-500 mb-1 block">Font Size</label>
                        <input
                          type="number"
                          value={selectedLayer.fontSize || 16}
                          onChange={(e) => updateLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="text-xs text-slate-500 mb-1 block">Color</label>
                        <input
                          type="color"
                          value={selectedLayer.fontColor || '#000000'}
                          onChange={(e) => updateLayer(selectedLayer.id, { fontColor: e.target.value })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </>
                  )}

                  {/* Shape specific properties */}
                  {selectedLayer.type === 'shape' && (
                    <>
                      <div className="mb-3">
                        <label className="text-xs text-slate-500 mb-1 block">Fill Color</label>
                        <input
                          type="color"
                          value={selectedLayer.fillColor || '#4ECDC4'}
                          onChange={(e) => updateLayer(selectedLayer.id, { fillColor: e.target.value })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="text-xs text-slate-500 mb-1 block">Stroke Width</label>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={selectedLayer.strokeWidth || 0}
                          onChange={(e) => updateLayer(selectedLayer.id, { strokeWidth: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Background Panel */}
          {activePanel === 'background' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Background</h3>

              {/* Solid Colors */}
              <div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Solid Colors</h4>
                <div className="grid grid-cols-5 gap-2">
                  {BACKGROUND_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setBackground(color)}
                      className={`w-full aspect-square rounded-lg border-2 transition-all ${
                        background === color
                          ? 'border-blue-500 scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: color === 'transparent' ? undefined : color,
                        backgroundImage: color === 'transparent'
                          ? 'repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%)'
                          : undefined,
                        backgroundSize: color === 'transparent' ? '10px 10px' : undefined
                      }}
                      title={color === 'transparent' ? 'Transparent' : color}
                    />
                  ))}
                </div>
              </div>

              {/* Gradients */}
              <div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Gradients</h4>
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENT_PRESETS.map((gradient, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBackground(gradient)}
                      className={`w-full aspect-square rounded-lg border-2 transition-all ${
                        JSON.stringify(background) === JSON.stringify(gradient)
                          ? 'border-blue-500 scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{
                        background: gradient.type === 'linear'
                          ? `linear-gradient(${gradient.angle || 135}deg, ${gradient.colors.join(', ')})`
                          : `radial-gradient(circle, ${gradient.colors.join(', ')})`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Canvas Size Presets */}
              <div>
                <h4 className="text-xs font-medium text-slate-500 mb-2">Canvas Size</h4>
                <div className="grid grid-cols-2 gap-2">
                  {IMAGE_EXPORT_PRESETS.slice(0, 6).map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setCanvasSize({ width: preset.width, height: preset.height })}
                      className={`p-2 rounded-lg text-left transition-all ${
                        canvasSize.width === preset.width && canvasSize.height === preset.height
                          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-500'
                          : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-medium truncate">{preset.name}</p>
                      <p className="text-[10px] text-slate-400">{preset.ratio}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Effects Panel */}
          {activePanel === 'effects' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Effects & AI</h3>

              {!selectedLayer ? (
                <div className="text-center py-8">
                  <Wand2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Select a layer to apply effects</p>
                </div>
              ) : (
                <>
                  {/* Remove Background - Only for images */}
                  {selectedLayer.type === 'image' && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                        <Scissors className="w-4 h-4" />
                        Remove Background
                      </h4>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">
                        AI-powered background removal (runs locally, 100% free)
                      </p>
                      <button
                        onClick={removeBackground}
                        disabled={isRemovingBg}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-70"
                      >
                        {isRemovingBg ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Processing... {bgRemovalProgress}%
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Remove Background
                          </>
                        )}
                      </button>
                      {isRemovingBg && (
                        <div className="mt-2 w-full h-2 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 transition-all"
                            style={{ width: `${bgRemovalProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shadow */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Drop Shadow</span>
                      <input
                        type="checkbox"
                        checked={selectedLayer.shadow?.enabled || false}
                        onChange={(e) => updateLayer(selectedLayer.id, {
                          shadow: {
                            ...selectedLayer.shadow,
                            enabled: e.target.checked,
                            color: selectedLayer.shadow?.color || '#000000',
                            blur: selectedLayer.shadow?.blur || 10,
                            offsetX: selectedLayer.shadow?.offsetX || 5,
                            offsetY: selectedLayer.shadow?.offsetY || 5
                          } as ShadowConfig
                        })}
                        className="rounded"
                      />
                    </div>
                    {selectedLayer.shadow?.enabled && (
                      <div className="space-y-2 mt-3">
                        <div>
                          <label className="text-xs text-slate-500">Blur: {selectedLayer.shadow.blur}px</label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={selectedLayer.shadow.blur}
                            onChange={(e) => updateLayer(selectedLayer.id, {
                              shadow: { ...selectedLayer.shadow!, blur: parseInt(e.target.value) }
                            })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Offset X: {selectedLayer.shadow.offsetX}px</label>
                          <input
                            type="range"
                            min="-30"
                            max="30"
                            value={selectedLayer.shadow.offsetX}
                            onChange={(e) => updateLayer(selectedLayer.id, {
                              shadow: { ...selectedLayer.shadow!, offsetX: parseInt(e.target.value) }
                            })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Offset Y: {selectedLayer.shadow.offsetY}px</label>
                          <input
                            type="range"
                            min="-30"
                            max="30"
                            value={selectedLayer.shadow.offsetY}
                            onChange={(e) => updateLayer(selectedLayer.id, {
                              shadow: { ...selectedLayer.shadow!, offsetY: parseInt(e.target.value) }
                            })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-500">Color</label>
                          <input
                            type="color"
                            value={selectedLayer.shadow.color}
                            onChange={(e) => updateLayer(selectedLayer.id, {
                              shadow: { ...selectedLayer.shadow!, color: e.target.value }
                            })}
                            className="w-full h-8 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Export Panel */}
          {activePanel === 'export' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Export</h3>

              {exportSuccess && (
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-300">Exported successfully!</span>
                </div>
              )}

              <div className="space-y-2">
                {IMAGE_EXPORT_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleExport(preset)}
                    disabled={isExporting}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                          {preset.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {preset.width} x {preset.height} ({preset.ratio})
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={exportAllSizes}
                disabled={isExporting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download All Sizes
                  </>
                )}
              </button>

              <p className="text-xs text-slate-400 text-center">
                Images are exported as PNG with transparency support
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Background Removal Tools Modal */}
      <AnimatePresence>
        {showBgToolsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBgToolsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                    <Wand2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Remove Background</h3>
                    <p className="text-sm text-slate-500">Use free tools to remove the background</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBgToolsModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Step 1: Download */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                  <span className="font-medium text-slate-900 dark:text-white">Download your image</span>
                </div>
                <button
                  onClick={downloadForBgRemoval}
                  className="w-full p-4 bg-blue-50 dark:bg-blue-900/30 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-medium">Download Image</span>
                </button>
              </div>

              {/* Step 2: Choose a tool */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                  <span className="font-medium text-slate-900 dark:text-white">Remove background with a free tool</span>
                </div>
                <div className="space-y-2">
                  {FREE_BG_REMOVAL_TOOLS.map((tool) => (
                    <a
                      key={tool.id}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{tool.name}</div>
                          <div className="text-xs text-slate-500">{tool.bestFor}</div>
                        </div>
                        <div className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                          {tool.freeCredits}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Step 3: Upload processed image */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                  <span className="font-medium text-slate-900 dark:text-white">Upload the result</span>
                </div>
                <label className="block w-full p-4 bg-green-50 dark:bg-green-900/30 border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">Upload Processed Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBgRemovedUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="mt-4 text-xs text-slate-500 text-center">
                All these tools are 100% free to use. Just upload your image, download the result, and upload it here.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
