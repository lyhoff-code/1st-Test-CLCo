'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Hash,
  Lightbulb,
  Target,
  Loader2,
  ChevronDown,
  ChevronUp,
  Zap,
  RefreshCw
} from 'lucide-react'
import { ShopifyProduct, ProductResearch } from '@/types'

interface ResearchPanelProps {
  product: ShopifyProduct
  research: ProductResearch | null
  isLoading: boolean
  onResearch: () => void
  onSelectHook: (hook: string) => void
  selectedHook: string | null
}

export function ResearchPanel({
  product,
  research,
  isLoading,
  onResearch,
  onSelectHook,
  selectedHook
}: ResearchPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['hooks', 'viralAngles'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  if (!research && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-databake-turquoise/20 to-databake-pink/20 flex items-center justify-center">
            <Search className="w-8 h-8 text-databake-turquoise-dark" />
          </div>
          <h3 className="font-semibold text-databake-text dark:text-gray-100 mb-2">
            AI Product Research
          </h3>
          <p className="text-sm text-databake-text-light dark:text-gray-400 mb-4">
            Get real-time insights, trends, and viral angles for <strong>{product.title}</strong>
          </p>
          <button
            onClick={onResearch}
            className="btn-primary py-3 px-6 inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Research Product
          </button>
        </div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-databake-turquoise/20 to-databake-pink/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-databake-turquoise-dark animate-spin" />
          </div>
          <h3 className="font-semibold text-databake-text dark:text-gray-100 mb-2">
            Researching {product.title}...
          </h3>
          <p className="text-sm text-databake-text-light dark:text-gray-400">
            Analyzing trends, competitors, and viral angles
          </p>
          <div className="mt-4 flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-databake-turquoise"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-databake-turquoise to-databake-pink flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-databake-text dark:text-gray-100">Research Complete</h3>
            <p className="text-xs text-databake-text-light dark:text-gray-400">Select a hook to use</p>
          </div>
        </div>
        <button
          onClick={onResearch}
          className="btn-ghost p-2"
          title="Refresh research"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Hooks Section - Primary */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-databake-pink/10 to-databake-pink/5 border border-databake-pink/20">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-databake-pink-dark" />
          <span className="font-medium text-sm text-databake-text dark:text-gray-100">Viral Hooks</span>
          <span className="text-[10px] px-2 py-0.5 bg-databake-pink/20 text-databake-pink-dark rounded-full">
            Select one
          </span>
        </div>
        <div className="space-y-2">
          {research?.hooks.map((hook, idx) => (
            <button
              key={idx}
              onClick={() => onSelectHook(hook)}
              className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
                selectedHook === hook
                  ? 'bg-databake-pink/20 border-2 border-databake-pink text-databake-text dark:text-gray-100'
                  : 'bg-white/50 dark:bg-gray-800/50 border-2 border-transparent hover:border-databake-pink/30 text-databake-text-light dark:text-gray-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                  selectedHook === hook
                    ? 'bg-databake-pink text-white'
                    : 'bg-white/70 dark:bg-gray-700/70 text-databake-text-light'
                }`}>
                  {idx + 1}
                </span>
                <span className="leading-snug">{hook}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Viral Angles */}
      <CollapsibleSection
        title="Viral Angles"
        icon={<Lightbulb className="w-4 h-4" />}
        color="turquoise"
        isExpanded={expandedSections.includes('viralAngles')}
        onToggle={() => toggleSection('viralAngles')}
      >
        <div className="flex flex-wrap gap-2">
          {research?.viralAngles.map((angle, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 text-xs rounded-lg bg-databake-turquoise/10 text-databake-turquoise-dark border border-databake-turquoise/20"
            >
              {angle}
            </span>
          ))}
        </div>
      </CollapsibleSection>

      {/* Trends */}
      <CollapsibleSection
        title="Current Trends"
        icon={<TrendingUp className="w-4 h-4" />}
        color="pink"
        isExpanded={expandedSections.includes('trends')}
        onToggle={() => toggleSection('trends')}
      >
        <ul className="space-y-1.5">
          {research?.trends.map((trend, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-databake-text-light dark:text-gray-300">
              <TrendingUp className="w-3 h-3 text-databake-pink-dark mt-1 shrink-0" />
              {trend}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Pain Points */}
      <CollapsibleSection
        title="Pain Points"
        icon={<AlertCircle className="w-4 h-4" />}
        color="turquoise"
        isExpanded={expandedSections.includes('painPoints')}
        onToggle={() => toggleSection('painPoints')}
      >
        <ul className="space-y-1.5">
          {research?.painPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-databake-text-light dark:text-gray-300">
              <AlertCircle className="w-3 h-3 text-amber-500 mt-1 shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Target Audience */}
      <CollapsibleSection
        title="Target Audience"
        icon={<Target className="w-4 h-4" />}
        color="pink"
        isExpanded={expandedSections.includes('audience')}
        onToggle={() => toggleSection('audience')}
      >
        <p className="text-sm text-databake-text-light dark:text-gray-300 leading-relaxed">
          {research?.targetAudience}
        </p>
      </CollapsibleSection>

      {/* Hashtags */}
      <CollapsibleSection
        title="Hashtags"
        icon={<Hash className="w-4 h-4" />}
        color="turquoise"
        isExpanded={expandedSections.includes('hashtags')}
        onToggle={() => toggleSection('hashtags')}
      >
        <div className="flex flex-wrap gap-1.5">
          {research?.hashtags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </CollapsibleSection>
    </motion.div>
  )
}

function CollapsibleSection({
  title,
  icon,
  color,
  isExpanded,
  onToggle,
  children
}: {
  title: string
  icon: React.ReactNode
  color: 'turquoise' | 'pink'
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={color === 'turquoise' ? 'text-databake-turquoise-dark' : 'text-databake-pink-dark'}>
            {icon}
          </span>
          <span className="font-medium text-sm text-databake-text dark:text-gray-200">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-databake-text-light" />
        ) : (
          <ChevronDown className="w-4 h-4 text-databake-text-light" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
