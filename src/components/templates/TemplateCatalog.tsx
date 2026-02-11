'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  X,
  Edit3,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Scissors,
  Mic,
  MicOff,
  Check,
  ChevronDown,
  Search,
  Clapperboard,
  Video,
  LayoutGrid,
  BookOpen,
  Megaphone,
  Grid,
  Link,
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  Heart,
  Layers,
} from 'lucide-react'
import {
  FavoriteTemplate,
  TemplateSource,
  TemplateCategory,
  TemplateCutStructure,
  TEMPLATE_SOURCES,
  TEMPLATE_CATEGORIES,
} from '@/types/pipeline'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TemplateCatalogProps {
  onSelectTemplate?: (template: FavoriteTemplate) => void
  selectionMode?: boolean
}

// ---------------------------------------------------------------------------
// Category icon map
// ---------------------------------------------------------------------------

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Clapperboard,
  Video,
  LayoutGrid,
  BookOpen,
  Megaphone,
  Grid,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ALL_TAB = { value: 'all' as const, label: 'All', iconName: 'Layers' }
const TABS = [ALL_TAB, ...TEMPLATE_CATEGORIES]

function categoryIcon(iconName: string) {
  if (iconName === 'Layers') return Layers
  return CATEGORY_ICONS[iconName] ?? Grid
}

function sourceColor(source: TemplateSource) {
  return source === 'capcut'
    ? 'bg-[#A8E6E1]/20 text-[#5bb8b0] dark:text-[#A8E6E1]'
    : 'bg-[#F9B4C4]/20 text-[#d4839a] dark:text-[#F9B4C4]'
}

function sourceDotColor(source: TemplateSource) {
  return source === 'capcut' ? 'bg-[#A8E6E1]' : 'bg-[#F9B4C4]'
}

// ---------------------------------------------------------------------------
// Blank form state
// ---------------------------------------------------------------------------

function blankForm(): Omit<FavoriteTemplate, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: '',
    source: 'capcut',
    category: 'reel',
    previewImage: '',
    cuts: [],
    totalCuts: 0,
    hasVoice: false,
    externalLink: '',
    notes: '',
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TemplateCatalog({
  onSelectTemplate,
  selectionMode = false,
}: TemplateCatalogProps) {
  // ---- State ----
  const [templates, setTemplates] = useState<FavoriteTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [search, setSearch] = useState('')

  // Modal / form state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(blankForm())
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Image upload ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ------------------------------------------------------------------
  // Fetch templates
  // ------------------------------------------------------------------

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/templates')
      if (!res.ok) throw new Error(`Failed to fetch templates (${res.status})`)
      const data = await res.json()
      setTemplates(Array.isArray(data) ? data : data.templates ?? [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error fetching templates'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // ------------------------------------------------------------------
  // Filtered list
  // ------------------------------------------------------------------

  const filtered = templates.filter((t) => {
    const matchesTab = activeTab === 'all' || t.category === activeTab
    const matchesSearch =
      search.trim() === '' ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.notes?.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  // ------------------------------------------------------------------
  // CRUD helpers
  // ------------------------------------------------------------------

  async function handleSubmit() {
    if (!form.name.trim()) {
      setFormError('Template name is required.')
      return
    }
    if (!form.externalLink.trim()) {
      setFormError('External link is required.')
      return
    }

    try {
      setSubmitting(true)
      setFormError(null)

      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { ...form, id: editingId } : form

      const res = await fetch('/api/templates', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error ?? `Request failed (${res.status})`)
      }

      await fetchTemplates()
      closeModal()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save template'
      setFormError(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeleting(true)
      const res = await fetch('/api/templates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Delete failed')
      await fetchTemplates()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete template'
      setError(message)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  // ------------------------------------------------------------------
  // Modal helpers
  // ------------------------------------------------------------------

  function openAddModal() {
    setEditingId(null)
    setForm(blankForm())
    setFormError(null)
    setModalOpen(true)
  }

  function openEditModal(template: FavoriteTemplate) {
    setEditingId(template.id)
    setForm({
      name: template.name,
      source: template.source,
      category: template.category,
      previewImage: template.previewImage ?? '',
      cuts: template.cuts,
      totalCuts: template.totalCuts,
      hasVoice: template.hasVoice,
      externalLink: template.externalLink,
      notes: template.notes ?? '',
    })
    setFormError(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setForm(blankForm())
    setFormError(null)
  }

  // ------------------------------------------------------------------
  // Cut management in form
  // ------------------------------------------------------------------

  function handleTotalCutsChange(value: number) {
    const clamped = Math.max(0, Math.min(value, 30))
    const newCuts: TemplateCutStructure[] = Array.from({ length: clamped }, (_, i) => ({
      index: i,
      name: form.cuts[i]?.name ?? `Cut ${i + 1}`,
      description: form.cuts[i]?.description ?? '',
    }))
    setForm((prev) => ({ ...prev, totalCuts: clamped, cuts: newCuts }))
  }

  function updateCut(index: number, field: 'name' | 'description', value: string) {
    setForm((prev) => {
      const updated = [...prev.cuts]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, cuts: updated }
    })
  }

  // ------------------------------------------------------------------
  // Preview image (base64 for simplicity)
  // ------------------------------------------------------------------

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, previewImage: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  // ====================================================================
  // RENDER
  // ====================================================================

  return (
    <div className="w-full space-y-6">
      {/* -------------------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Template Catalog
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your favorite CapCut &amp; Canva templates
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm
            bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] text-slate-800
            shadow-lg shadow-[#A8E6E1]/20 hover:shadow-xl hover:shadow-[#A8E6E1]/30
            transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </motion.button>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Search bar */}
      {/* -------------------------------------------------------------- */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm
            bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
            border border-slate-200/60 dark:border-slate-700/60
            text-slate-800 dark:text-white
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-[#A8E6E1]/50
            transition-all"
        />
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Category tabs */}
      {/* -------------------------------------------------------------- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {TABS.map((tab) => {
          const Icon = categoryIcon(tab.iconName)
          const isActive = activeTab === tab.value
          return (
            <motion.button
              key={tab.value}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold
                transition-colors ${
                  isActive
                    ? 'bg-[#A8E6E1]/30 text-[#3d9e96] dark:text-[#A8E6E1] dark:bg-[#A8E6E1]/20 shadow-sm'
                    : 'bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700/60'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </motion.button>
          )
        })}
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Error banner */}
      {/* -------------------------------------------------------------- */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl
              bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40
              text-red-600 dark:text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------- */}
      {/* Loading state */}
      {/* -------------------------------------------------------------- */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#A8E6E1] animate-spin" />
        </div>
      )}

      {/* -------------------------------------------------------------- */}
      {/* Empty state */}
      {/* -------------------------------------------------------------- */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#A8E6E1]/20 dark:bg-[#A8E6E1]/10 flex items-center justify-center mb-4">
            <Heart className="w-7 h-7 text-[#A8E6E1]" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">
            {search.trim() || activeTab !== 'all'
              ? 'No templates match your filters.'
              : 'No templates saved yet.'}
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
            Click &quot;Add Template&quot; to save your first CapCut or Canva template.
          </p>
        </motion.div>
      )}

      {/* -------------------------------------------------------------- */}
      {/* Template grid */}
      {/* -------------------------------------------------------------- */}
      {!loading && filtered.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((template, idx) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={idx}
                selectionMode={selectionMode}
                onSelect={() => onSelectTemplate?.(template)}
                onEdit={() => openEditModal(template)}
                onDelete={() => setDeleteId(template.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* -------------------------------------------------------------- */}
      {/* Delete confirmation modal */}
      {/* -------------------------------------------------------------- */}
      <AnimatePresence>
        {deleteId && (
          <ModalOverlay onClose={() => !deleting && setDeleteId(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className="w-full max-w-sm p-6 rounded-2xl
                bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
                border border-slate-200/60 dark:border-slate-700/60
                shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                Delete Template?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                This action cannot be undone. The template will be permanently removed.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  disabled={deleting}
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium
                    text-slate-600 dark:text-slate-300
                    hover:bg-slate-100 dark:hover:bg-slate-700
                    transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={deleting}
                  onClick={() => handleDelete(deleteId)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                    bg-red-500 text-white hover:bg-red-600
                    disabled:opacity-60 transition-colors"
                >
                  {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------- */}
      {/* Add / Edit modal */}
      {/* -------------------------------------------------------------- */}
      <AnimatePresence>
        {modalOpen && (
          <ModalOverlay onClose={() => !submitting && closeModal()}>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl
                bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
                border border-slate-200/60 dark:border-slate-700/60
                shadow-2xl p-6 sm:p-8 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                  {editingId ? 'Edit Template' : 'Add New Template'}
                </h3>
                <button
                  onClick={closeModal}
                  disabled={submitting}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                    hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl
                      bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40
                      text-red-600 dark:text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {formError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ---- Name ---- */}
              <FormField label="Template Name" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Aesthetic Zoom Reel"
                  className="form-input"
                />
              </FormField>

              {/* ---- Source toggle ---- */}
              <FormField label="Source">
                <div className="flex items-center gap-2">
                  {TEMPLATE_SOURCES.map((src) => {
                    const active = form.source === src.value
                    return (
                      <motion.button
                        key={src.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setForm((p) => ({ ...p, source: src.value }))}
                        type="button"
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                          transition-all border ${
                            active
                              ? src.color === 'turquoise'
                                ? 'bg-[#A8E6E1]/20 border-[#A8E6E1] text-[#3d9e96] dark:text-[#A8E6E1]'
                                : 'bg-[#F9B4C4]/20 border-[#F9B4C4] text-[#d4839a] dark:text-[#F9B4C4]'
                              : 'bg-white/60 dark:bg-slate-700/40 border-slate-200/60 dark:border-slate-600/60 text-slate-500 dark:text-slate-400'
                          }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        {src.label}
                      </motion.button>
                    )
                  })}
                </div>
              </FormField>

              {/* ---- Category ---- */}
              <FormField label="Category">
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value as TemplateCategory }))
                    }
                    className="form-input appearance-none pr-10 cursor-pointer"
                  >
                    {TEMPLATE_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </FormField>

              {/* ---- Number of cuts ---- */}
              <FormField label="Number of Cuts">
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={form.totalCuts}
                  onChange={(e) => handleTotalCutsChange(Number(e.target.value))}
                  className="form-input"
                />
              </FormField>

              {/* ---- Cut details ---- */}
              <AnimatePresence>
                {form.cuts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Cut Details
                    </p>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {form.cuts.map((cut, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-start gap-2 p-3 rounded-xl
                            bg-slate-50/80 dark:bg-slate-700/40 border border-slate-200/40 dark:border-slate-600/30"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#A8E6E1]/20 text-[#3d9e96] dark:text-[#A8E6E1]
                            flex items-center justify-center text-xs font-bold mt-1">
                            {i + 1}
                          </span>
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder={`Cut ${i + 1} name`}
                              value={cut.name}
                              onChange={(e) => updateCut(i, 'name', e.target.value)}
                              className="form-input-sm"
                            />
                            <input
                              type="text"
                              placeholder="Description (optional)"
                              value={cut.description}
                              onChange={(e) => updateCut(i, 'description', e.target.value)}
                              className="form-input-sm"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ---- Has voice toggle ---- */}
              <FormField label="Has Voice">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForm((p) => ({ ...p, hasVoice: !p.hasVoice }))}
                  type="button"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                    transition-all border ${
                      form.hasVoice
                        ? 'bg-[#A8E6E1]/20 border-[#A8E6E1] text-[#3d9e96] dark:text-[#A8E6E1]'
                        : 'bg-white/60 dark:bg-slate-700/40 border-slate-200/60 dark:border-slate-600/60 text-slate-400'
                    }`}
                >
                  {form.hasVoice ? (
                    <Mic className="w-4 h-4" />
                  ) : (
                    <MicOff className="w-4 h-4" />
                  )}
                  {form.hasVoice ? 'Yes, has voice' : 'No voice'}
                </motion.button>
              </FormField>

              {/* ---- External link ---- */}
              <FormField label="External Link" required>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={form.externalLink}
                    onChange={(e) => setForm((p) => ({ ...p, externalLink: e.target.value }))}
                    placeholder="https://www.capcut.com/template/..."
                    className="form-input pl-10"
                  />
                </div>
              </FormField>

              {/* ---- Preview image ---- */}
              <FormField label="Preview Image">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                      bg-white/60 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60
                      text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700
                      transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </motion.button>
                  {form.previewImage && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-600/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setForm((p) => ({ ...p, previewImage: '' }))}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white
                          flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </FormField>

              {/* ---- Notes ---- */}
              <FormField label="Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Optional notes about this template..."
                  rows={3}
                  className="form-input resize-none"
                />
              </FormField>

              {/* ---- Submit ---- */}
              <div className="flex items-center gap-3 justify-end pt-2">
                <button
                  disabled={submitting}
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium
                    text-slate-600 dark:text-slate-300
                    hover:bg-slate-100 dark:hover:bg-slate-700
                    transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                    bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] text-slate-800
                    shadow-lg shadow-[#A8E6E1]/20 hover:shadow-xl hover:shadow-[#A8E6E1]/30
                    disabled:opacity-60 transition-all"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Add Template'}
                </motion.button>
              </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* -------------------------------------------------------------- */}
      {/* Scoped styles for inputs */}
      {/* -------------------------------------------------------------- */}
      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(203, 213, 225, 0.6);
          color: #1e293b;
          outline: none;
          transition: all 0.15s ease;
        }
        .form-input:focus {
          box-shadow: 0 0 0 2px rgba(168, 230, 225, 0.4);
          border-color: #A8E6E1;
        }
        .form-input::placeholder {
          color: #94a3b8;
        }
        :is(.dark) .form-input {
          background: rgba(51, 65, 85, 0.4);
          border-color: rgba(71, 85, 105, 0.6);
          color: #f1f5f9;
        }
        :is(.dark) .form-input:focus {
          box-shadow: 0 0 0 2px rgba(168, 230, 225, 0.3);
          border-color: #A8E6E1;
        }
        :is(.dark) .form-input::placeholder {
          color: #64748b;
        }
        .form-input-sm {
          width: 100%;
          padding: 0.375rem 0.625rem;
          border-radius: 0.5rem;
          font-size: 0.8125rem;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(203, 213, 225, 0.4);
          color: #1e293b;
          outline: none;
          transition: all 0.15s ease;
        }
        .form-input-sm:focus {
          box-shadow: 0 0 0 2px rgba(168, 230, 225, 0.3);
          border-color: #A8E6E1;
        }
        .form-input-sm::placeholder {
          color: #94a3b8;
        }
        :is(.dark) .form-input-sm {
          background: rgba(51, 65, 85, 0.5);
          border-color: rgba(71, 85, 105, 0.4);
          color: #f1f5f9;
        }
        :is(.dark) .form-input-sm:focus {
          box-shadow: 0 0 0 2px rgba(168, 230, 225, 0.25);
          border-color: #A8E6E1;
        }
        :is(.dark) .form-input-sm::placeholder {
          color: #64748b;
        }
      `}</style>
    </div>
  )
}

// ======================================================================
// Sub-components
// ======================================================================

// ---------------------------------------------------------------------------
// FormField
// ---------------------------------------------------------------------------

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
        {label}
        {required && <span className="text-[#F9B4C4] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ModalOverlay
// ---------------------------------------------------------------------------

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/40 backdrop-blur-sm"
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// TemplateCard
// ---------------------------------------------------------------------------

function TemplateCard({
  template,
  index,
  selectionMode,
  onSelect,
  onEdit,
  onDelete,
}: {
  template: FavoriteTemplate
  index: number
  selectionMode: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const CatIcon =
    categoryIcon(
      TEMPLATE_CATEGORIES.find((c) => c.value === template.category)?.iconName ?? 'Grid'
    )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, type: 'spring', duration: 0.45 }}
      className="group relative rounded-2xl overflow-hidden
        bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
        border border-slate-200/60 dark:border-slate-700/60
        shadow-sm hover:shadow-lg hover:shadow-[#A8E6E1]/10
        transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      {/* Preview image or placeholder */}
      <div className="relative h-36 bg-gradient-to-br from-[#A8E6E1]/20 to-[#F9B4C4]/20 overflow-hidden">
        {template.previewImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={template.previewImage}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
        )}

        {/* Source badge */}
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide
            backdrop-blur-md ${sourceColor(template.source)}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${sourceDotColor(template.source)}`} />
          {template.source === 'capcut' ? 'CapCut' : 'Canva'}
        </span>

        {/* Action buttons (visible on hover) */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1
            opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
              text-slate-600 dark:text-slate-300 hover:text-[#A8E6E1]
              shadow-sm transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
              text-slate-600 dark:text-slate-300 hover:text-red-500
              shadow-sm transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
          {template.externalLink && (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={template.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
                text-slate-600 dark:text-slate-300 hover:text-[#F9B4C4]
                shadow-sm transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Name + category */}
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">
            {template.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <CatIcon className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {TEMPLATE_CATEGORIES.find((c) => c.value === template.category)?.label ??
                template.category}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Scissors className="w-3 h-3" />
            {template.totalCuts} cut{template.totalCuts !== 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center gap-1">
            {template.hasVoice ? (
              <>
                <Mic className="w-3 h-3 text-[#A8E6E1]" />
                <span className="text-[#3d9e96] dark:text-[#A8E6E1]">Voice</span>
              </>
            ) : (
              <>
                <MicOff className="w-3 h-3" />
                No voice
              </>
            )}
          </span>
        </div>

        {/* Notes preview */}
        {template.notes && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
            {template.notes}
          </p>
        )}

        {/* Select button (selection mode) */}
        {selectionMode && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
              bg-gradient-to-r from-[#A8E6E1] to-[#F9B4C4] text-slate-800
              shadow-md shadow-[#A8E6E1]/15 hover:shadow-lg hover:shadow-[#A8E6E1]/25
              transition-shadow"
          >
            <Check className="w-3.5 h-3.5" />
            Select Template
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
