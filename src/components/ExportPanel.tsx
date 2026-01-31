'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Image as ImageIcon,
  FileText,
  Music,
  Mic,
  Package,
  Check,
  Loader2,
  FolderDown,
  Video,
  ExternalLink,
  Copy,
  CheckCircle2,
  FileJson
} from 'lucide-react'
import { UserProject, VideoTemplateStructure, UserScene } from '@/types/templates'
import JSZip from 'jszip'

interface ExportPanelProps {
  project: UserProject
  template: VideoTemplateStructure
  selectedMusic?: {
    id: string
    title: string
    artist: string
    url?: string
  }
  onClose: () => void
}

type ExportFormat = 'zip' | 'individual' | 'capcut' | 'pictory'

export function ExportPanel({
  project,
  template,
  selectedMusic,
  onClose
}: ExportPanelProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('zip')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)

  // Generate full script
  const fullScript = project.scenes.map((scene, idx) => {
    const templateScene = template.scenes[idx]
    return `[Scene ${idx + 1}: ${templateScene?.name || 'Scene'} - ${scene.duration}s]\n${scene.script}`
  }).join('\n\n')

  // Export to ZIP
  const exportToZip = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      const zip = new JSZip()

      // Create folders
      const imagesFolder = zip.folder('images')
      const audioFolder = zip.folder('audio')
      const scriptsFolder = zip.folder('scripts')

      // Add images
      for (let i = 0; i < project.scenes.length; i++) {
        const scene = project.scenes[i]
        if (scene.imageUrl) {
          // Convert base64 to blob if needed
          if (scene.imageUrl.startsWith('data:')) {
            const response = await fetch(scene.imageUrl)
            const blob = await response.blob()
            imagesFolder?.file(`scene_${i + 1}.jpg`, blob)
          }
        }
        setExportProgress(((i + 1) / project.scenes.length) * 50)
      }

      // Add speech files
      for (let i = 0; i < project.scenes.length; i++) {
        const scene = project.scenes[i]
        if (scene.speechUrl) {
          const response = await fetch(scene.speechUrl)
          const blob = await response.blob()
          audioFolder?.file(`speech_scene_${i + 1}.mp3`, blob)
        }
        setExportProgress(50 + ((i + 1) / project.scenes.length) * 25)
      }

      // Add full script
      scriptsFolder?.file('full_script.txt', fullScript)

      // Add scene-by-scene scripts
      project.scenes.forEach((scene, idx) => {
        const templateScene = template.scenes[idx]
        scriptsFolder?.file(`scene_${idx + 1}_${templateScene?.type || 'scene'}.txt`, scene.script)
      })

      // Add project metadata
      const metadata = {
        projectId: project.id,
        templateId: template.id,
        templateName: template.name,
        productName: project.productName,
        totalDuration: project.scenes.reduce((acc, s) => acc + s.duration, 0),
        scenesCount: project.scenes.length,
        createdAt: project.createdAt,
        exportedAt: new Date().toISOString(),
        scenes: project.scenes.map((scene, idx) => ({
          index: idx + 1,
          name: template.scenes[idx]?.name,
          type: template.scenes[idx]?.type,
          duration: scene.duration,
          script: scene.script,
          hasImage: !!scene.imageUrl,
          hasSpeech: !!scene.speechUrl
        })),
        music: selectedMusic ? {
          title: selectedMusic.title,
          artist: selectedMusic.artist
        } : null
      }
      zip.file('project.json', JSON.stringify(metadata, null, 2))

      // Add README
      const readme = `# ${project.productName || 'Video'} - ${template.name}

## Project Info
- Template: ${template.name}
- Total Duration: ${metadata.totalDuration}s
- Scenes: ${metadata.scenesCount}
- Created: ${new Date(project.createdAt).toLocaleString()}

## Folder Structure
- /images - Scene images (scene_1.jpg, scene_2.jpg, etc.)
- /audio - Speech files (speech_scene_1.mp3, etc.)
- /scripts - Script files
  - full_script.txt - Complete script
  - scene_X_type.txt - Individual scene scripts
- project.json - Project metadata

## Scenes
${project.scenes.map((scene, idx) => {
  const t = template.scenes[idx]
  return `${idx + 1}. ${t?.name} (${scene.duration}s) - ${t?.type}`
}).join('\n')}

## How to Edit
1. Import images to your video editor (CapCut, Premiere, etc.)
2. Add speech audio files to match each scene
3. Add music track
4. Apply transitions as specified in project.json

## Suggested Music
${selectedMusic ? `${selectedMusic.title} by ${selectedMusic.artist}` : 'No music selected'}

---
Created with DataBake.media
`
      zip.file('README.md', readme)

      setExportProgress(90)

      // Generate ZIP
      const content = await zip.generateAsync({ type: 'blob' })

      // Download
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.productName || 'video'}_${template.id}_${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportProgress(100)
      setExportComplete(true)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Copy script to clipboard
  const copyScript = async () => {
    await navigator.clipboard.writeText(fullScript)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 2000)
  }

  // Generate Pictory format
  const exportToPictory = () => {
    // Pictory accepts script with scene markers
    const pictoryScript = project.scenes.map((scene, idx) => {
      return `[Scene ${idx + 1}]\n${scene.script}`
    }).join('\n\n---\n\n')

    const blob = new Blob([pictoryScript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pictory_script_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Export Project</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {template.name} • {project.scenes.length} scenes
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Export Format Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Export Format
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat('zip')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  exportFormat === 'zip'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Package className={`w-6 h-6 mb-2 ${
                  exportFormat === 'zip' ? 'text-green-600' : 'text-slate-400'
                }`} />
                <p className="font-semibold text-slate-800 dark:text-white">ZIP Package</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All assets organized in folders
                </p>
              </button>

              <button
                onClick={() => setExportFormat('pictory')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  exportFormat === 'pictory'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Video className={`w-6 h-6 mb-2 ${
                  exportFormat === 'pictory' ? 'text-green-600' : 'text-slate-400'
                }`} />
                <p className="font-semibold text-slate-800 dark:text-white">Pictory Script</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Script formatted for Pictory AI
                </p>
              </button>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              What's Included
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-white">
                    {project.scenes.filter(s => s.imageUrl).length} Images
                  </p>
                  <p className="text-xs text-slate-500">Scene visuals</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-white">
                    {project.scenes.filter(s => s.speechUrl).length} Speech Files
                  </p>
                  <p className="text-xs text-slate-500">Voiceovers</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-white">
                    {project.scenes.length + 1} Scripts
                  </p>
                  <p className="text-xs text-slate-500">Full + per scene</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FileJson className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-white">
                    Project Data
                  </p>
                  <p className="text-xs text-slate-500">Metadata & settings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Script Copy */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Quick Script Copy
              </h3>
              <button
                onClick={copyScript}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {copiedScript ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy Script
                  </>
                )}
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 max-h-32 overflow-y-auto">
              <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono">
                {fullScript.slice(0, 300)}...
              </pre>
            </div>
          </div>

          {/* Export Progress */}
          <AnimatePresence>
            {isExporting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Preparing export...
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Export Complete */}
          <AnimatePresence>
            {exportComplete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-300">
                      Export Complete!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Your files have been downloaded
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={exportFormat === 'zip' ? exportToZip : exportToPictory}
              disabled={isExporting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FolderDown className="w-5 h-5" />
                  Export {exportFormat === 'zip' ? 'ZIP' : 'Script'}
                </>
              )}
            </button>
          </div>

          {/* External Editor Links */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              After exporting, edit in your favorite tool:
            </p>
            <div className="flex gap-2">
              <a
                href="https://www.capcut.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                CapCut <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.canva.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Canva <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://pictory.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Pictory <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExportPanel
