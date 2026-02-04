'use client'

import { useState, useRef, useCallback } from 'react'
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
  Sun,
  Contrast,
  Droplet,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Minus,
  Plus,
  Scissors,
  Sparkles,
  Grid3X3
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
  '#000000', '#1a1a2e', '#16213e', '#0f3460', '#533483'
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

  // Canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 })
  const [zoom, setZoom] = useState(0.5)
  const [background, setBackground] = useState<string | GradientBackground>('#FFFFFF')

  // Layers state
  const [layers, setLayers] = useState<ImageLayer[]>([])
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)

  // Tool state
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'shape'>('select')
  const [activePanel, setActivePanel] = useState<'layers' | 'background' | 'effects' | 'export'>('layers')

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

  // Get background style
  const getBackgroundStyle = () => {
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

  // Export canvas
  const handleExport = (preset: typeof IMAGE_EXPORT_PRESETS[0]) => {
    // In a real implementation, this would use html2canvas or similar
    if (onExport) {
      onExport('data:image/png;base64,...', 'png')
    }
  }

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
          title="Select"
        >
          <Move className="w-5 h-5" />
        </button>

        <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 my-2" />

        <button
          onClick={addProductImage}
          className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
          title="Add Product Image"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

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
          title="Effects"
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
              onClick={() => setZoom(0.5)}
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
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                backgroundSize: `${50 * zoom}px ${50 * zoom}px`
              }} />
            </div>

            {/* Layers */}
            {layers.filter(l => l.visible).map(layer => (
              <div
                key={layer.id}
                onClick={() => !layer.locked && setSelectedLayerId(layer.id)}
                className={`absolute cursor-pointer ${
                  selectedLayerId === layer.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: layer.x * zoom,
                  top: layer.y * zoom,
                  width: layer.width * zoom,
                  height: layer.height * zoom,
                  transform: `rotate(${layer.rotation}deg)`,
                  opacity: layer.opacity
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
                {selectedLayerId === layer.id && (
                  <>
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-ne-resize" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-sw-resize" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-se-resize" />
                  </>
                )}
              </div>
            ))}
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

                  {/* Opacity */}
                  <div className="mb-3">
                    <label className="text-xs text-slate-500 mb-1 block">Opacity</label>
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
                      style={{ backgroundColor: color }}
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

              {/* Remove Background */}
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                <Scissors className="w-4 h-4" />
                Remove Background (AI)
              </button>
            </div>
          )}

          {/* Effects Panel */}
          {activePanel === 'effects' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Effects</h3>

              {!selectedLayer ? (
                <div className="text-center py-8">
                  <Wand2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Select a layer to apply effects</p>
                </div>
              ) : (
                <>
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
                          <label className="text-xs text-slate-500">Blur</label>
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
                      </div>
                    )}
                  </div>

                  {/* AI Enhance */}
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                    <Sparkles className="w-4 h-4" />
                    AI Enhance
                  </button>
                </>
              )}
            </div>
          )}

          {/* Export Panel */}
          {activePanel === 'export' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Export</h3>

              <div className="space-y-2">
                {IMAGE_EXPORT_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setCanvasSize({ width: preset.width, height: preset.height })
                      handleExport(preset)
                    }}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
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

              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                <Download className="w-5 h-5" />
                Download All Sizes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
