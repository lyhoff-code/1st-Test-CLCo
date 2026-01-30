'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Image,
  Cloud,
  X,
  Check,
  Trash2,
  Monitor,
  HardDrive,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface BrandUploaderProps {
  onBrandUpdate?: (brand: BrandData | null) => void
  initialBrand?: BrandData | null
}

export interface BrandData {
  logoUrl: string
  logoName: string
  brandName?: string
  brandColor?: string
  uploadedAt: string
  source: 'local' | 'drive'
}

// Google Drive Icon SVG
const GoogleDriveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M7.71 3.5L1.15 15l3.43 6L11.14 9.5 7.71 3.5zm1.14 0l6.43 6L8.85 21h6.86l6.43-6-6.43-12H8.85zm7.43 6l6.43 12h-6.86l-6.43-12h6.86z" />
  </svg>
)

export function BrandUploader({ onBrandUpdate, initialBrand }: BrandUploaderProps) {
  const [brand, setBrand] = useState<BrandData | null>(initialBrand || null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [brandName, setBrandName] = useState(initialBrand?.brandName || '')
  const [brandColor, setBrandColor] = useState(initialBrand?.brandColor || '#4FB3A9')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load brand from localStorage on mount
  useEffect(() => {
    const savedBrand = localStorage.getItem('tada-brand')
    if (savedBrand) {
      const parsed = JSON.parse(savedBrand)
      setBrand(parsed)
      setBrandName(parsed.brandName || '')
      setBrandColor(parsed.brandColor || '#4FB3A9')
    }
  }, [])

  // Save brand to localStorage and notify parent
  const saveBrand = useCallback((newBrand: BrandData | null) => {
    setBrand(newBrand)
    if (newBrand) {
      localStorage.setItem('tada-brand', JSON.stringify(newBrand))
    } else {
      localStorage.removeItem('tada-brand')
    }
    onBrandUpdate?.(newBrand)
  }, [onBrandUpdate])

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, SVG, WebP)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Convert to base64 for localStorage storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string
        const newBrand: BrandData = {
          logoUrl,
          logoName: file.name,
          brandName: brandName || undefined,
          brandColor: brandColor || undefined,
          uploadedAt: new Date().toISOString(),
          source: 'local'
        }
        saveBrand(newBrand)
        setIsUploading(false)
      }
      reader.onerror = () => {
        setError('Failed to read file')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to upload file')
      setIsUploading(false)
    }
  }, [brandName, brandColor, saveBrand])

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  // File input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  // Google Drive Picker
  const handleGoogleDrivePick = useCallback(async () => {
    setError(null)

    // Check if Google API is loaded
    if (typeof window === 'undefined') return

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

    if (!clientId || !apiKey) {
      setError('Google Drive integration not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID and NEXT_PUBLIC_GOOGLE_API_KEY to your environment.')
      return
    }

    setIsUploading(true)

    try {
      // Load Google API scripts dynamically
      const loadGoogleApi = () => {
        return new Promise<void>((resolve, reject) => {
          if ((window as any).gapi) {
            resolve()
            return
          }

          const script = document.createElement('script')
          script.src = 'https://apis.google.com/js/api.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Google API'))
          document.body.appendChild(script)
        })
      }

      const loadGooglePicker = () => {
        return new Promise<void>((resolve, reject) => {
          if ((window as any).google?.picker) {
            resolve()
            return
          }

          const script = document.createElement('script')
          script.src = 'https://apis.google.com/js/picker.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Google Picker'))
          document.body.appendChild(script)
        })
      }

      await Promise.all([loadGoogleApi(), loadGooglePicker()])

      // Initialize gapi
      await new Promise<void>((resolve) => {
        (window as any).gapi.load('auth2', resolve)
      })

      // Auth with Google
      const auth2 = await (window as any).gapi.auth2.init({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.readonly'
      })

      const user = await auth2.signIn()
      const accessToken = user.getAuthResponse().access_token

      // Create and show picker
      const google = (window as any).google
      const picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS_IMAGES)
        .setOAuthToken(accessToken)
        .setDeveloperKey(apiKey)
        .setCallback(async (data: any) => {
          if (data.action === google.picker.Action.PICKED) {
            const file = data.docs[0]

            // Fetch file content
            const response = await fetch(
              `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              }
            )

            if (!response.ok) {
              throw new Error('Failed to download file from Google Drive')
            }

            const blob = await response.blob()
            const reader = new FileReader()
            reader.onload = (e) => {
              const logoUrl = e.target?.result as string
              const newBrand: BrandData = {
                logoUrl,
                logoName: file.name,
                brandName: brandName || undefined,
                brandColor: brandColor || undefined,
                uploadedAt: new Date().toISOString(),
                source: 'drive'
              }
              saveBrand(newBrand)
              setIsUploading(false)
            }
            reader.readAsDataURL(blob)
          } else if (data.action === google.picker.Action.CANCEL) {
            setIsUploading(false)
          }
        })
        .build()

      picker.setVisible(true)
    } catch (err) {
      console.error('Google Drive error:', err)
      setError('Failed to connect to Google Drive. Make sure you have the correct API credentials.')
      setIsUploading(false)
    }
  }, [brandName, brandColor, saveBrand])

  // Update brand name/color
  const handleUpdateBrandInfo = useCallback(() => {
    if (!brand) return

    const updatedBrand: BrandData = {
      ...brand,
      brandName: brandName || undefined,
      brandColor: brandColor || undefined
    }
    saveBrand(updatedBrand)
  }, [brand, brandName, brandColor, saveBrand])

  // Remove brand
  const handleRemoveBrand = useCallback(() => {
    saveBrand(null)
    setBrandName('')
    setBrandColor('#4FB3A9')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [saveBrand])

  return (
    <div className="space-y-4">
      {/* Brand Info Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
            Brand Name
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            onBlur={handleUpdateBrandInfo}
            placeholder="Your brand name"
            className="w-full px-3 py-2.5 rounded-xl text-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
            Brand Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              onBlur={handleUpdateBrandInfo}
              className="w-10 h-10 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              onBlur={handleUpdateBrandInfo}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 uppercase"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-800/50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area or Preview */}
      <AnimatePresence mode="wait">
        {brand ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-4">
              {/* Logo Preview */}
              <div
                className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: brandColor + '20' }}
              >
                <img
                  src={brand.logoUrl}
                  alt={brand.logoName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Brand Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 dark:text-white truncate">
                  {brand.brandName || brand.logoName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    brand.source === 'drive'
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  }`}>
                    {brand.source === 'drive' ? (
                      <>
                        <GoogleDriveIcon />
                        Google Drive
                      </>
                    ) : (
                      <>
                        <Monitor className="w-3 h-3" />
                        Local
                      </>
                    )}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(brand.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                {brand.brandColor && (
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: brand.brandColor }}
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                      {brand.brandColor}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Change logo"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRemoveBrand}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  title="Remove brand"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Success indicator */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                isDragging
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 hover:border-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-900/10'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Uploading...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    isDragging
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}>
                    <Cloud className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {isDragging ? 'Drop your logo here' : 'Drag & drop your logo'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      or click to browse files
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    PNG, JPG, SVG, WebP up to 5MB
                  </p>
                </div>
              )}
            </div>

            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <Monitor className="w-4 h-4" />
                From Computer
              </button>
              <button
                onClick={handleGoogleDrivePick}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 font-semibold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
              >
                <GoogleDriveIcon />
                Google Drive
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
