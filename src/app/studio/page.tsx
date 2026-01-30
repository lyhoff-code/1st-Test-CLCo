'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  Music,
  Type,
  Layout,
  Send,
  BarChart3,
  ChevronRight,
  Zap,
  Star,
  Flame,
  Cookie,
  ChefHat,
  Utensils,
  Timer,
  Thermometer
} from 'lucide-react'
import { MusicLibrary, Track } from '@/components/MusicLibrary'
import { CaptionStyles, CaptionStyle } from '@/components/CaptionStyles'
import { TemplatesGallery, VideoTemplate } from '@/components/TemplatesGallery'
import { SocialScheduler } from '@/components/SocialScheduler'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

type StudioSection = 'music' | 'captions' | 'templates' | 'scheduler' | 'analytics'

// Animated emoji component
const AnimatedEmoji = ({ emoji, delay = 0 }: { emoji: string; delay?: number }) => (
  <motion.span
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay
    }}
    whileHover={{
      scale: 1.3,
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 }
    }}
    className="inline-block cursor-pointer"
  >
    {emoji}
  </motion.span>
)

// Floating ingredient animation
const FloatingIngredient = ({ emoji, className }: { emoji: string; className?: string }) => (
  <motion.div
    className={`absolute text-2xl pointer-events-none ${className}`}
    animate={{
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {emoji}
  </motion.div>
)

// Cooking steam animation
const Steam = () => (
  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1 h-4 bg-gradient-to-t from-white/40 to-transparent rounded-full"
        animate={{
          y: [-5, -15],
          opacity: [0.6, 0],
          scaleY: [1, 1.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "easeOut"
        }}
      />
    ))}
  </div>
)

const SECTIONS = [
  {
    id: 'templates' as const,
    name: 'Recipes',
    description: 'Ready-to-cook templates',
    icon: Cookie,
    color: 'from-amber-500 to-orange-500',
    emoji: '🍪',
    badge: '16+'
  },
  {
    id: 'music' as const,
    name: 'Ingredients',
    description: 'Trending sounds',
    icon: Music,
    color: 'from-purple-500 to-pink-500',
    emoji: '🎵',
    badge: '50+'
  },
  {
    id: 'captions' as const,
    name: 'Decoration',
    description: 'Viral text styles',
    icon: Type,
    color: 'from-yellow-500 to-orange-500',
    emoji: '✨',
    badge: '6'
  },
  {
    id: 'scheduler' as const,
    name: 'Serve',
    description: 'Publish and schedule',
    icon: Send,
    color: 'from-green-500 to-emerald-500',
    emoji: '🚀',
    badge: 'HOT'
  },
  {
    id: 'analytics' as const,
    name: 'Flavor',
    description: 'Metrics and performance',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    emoji: '📊',
    badge: 'Live'
  }
]

export default function StudioPage() {
  const [activeSection, setActiveSection] = useState<StudioSection>('templates')
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<CaptionStyle | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null)
  const [isCooking, setIsCooking] = useState(false)

  // Simulated cooking animation
  const startCooking = () => {
    setIsCooking(true)
    setTimeout(() => setIsCooking(false), 3000)
  }

  return (
    <main className="min-h-screen aurora-bg relative overflow-hidden">
      {/* Floating Background Ingredients */}
      <FloatingIngredient emoji="🎬" className="top-20 left-10 opacity-30" />
      <FloatingIngredient emoji="📱" className="top-40 right-20 opacity-30" />
      <FloatingIngredient emoji="🎨" className="bottom-40 left-20 opacity-30" />
      <FloatingIngredient emoji="💫" className="bottom-20 right-10 opacity-30" />
      <FloatingIngredient emoji="🔥" className="top-60 left-1/4 opacity-20" />
      <FloatingIngredient emoji="⭐" className="top-32 right-1/3 opacity-20" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-subtle border-b border-white/20 dark:border-gray-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-databake-text dark:text-gray-200" />
              </Link>
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  animate={isCooking ? {
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Steam />
                  <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Creator Kitchen
                    <AnimatedEmoji emoji="👨‍🍳" delay={0.2} />
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Cook viral content <AnimatedEmoji emoji="🔥" delay={0.4} />
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass-subtle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Timer className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Cooking time: <span className="text-orange-500 font-bold">2 min</span>
                </span>
              </motion.div>
              <motion.span
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flame className="w-4 h-4" />
                Pro Chef
              </motion.span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Kitchen Status Bar */}
        <motion.div
          className="mb-8 p-4 rounded-2xl glass border border-white/30 dark:border-slate-700/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Oven ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Temperature: <span className="text-red-500 font-bold">🔥 Viral</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">Selected ingredients:</span>
              <div className="flex items-center gap-1">
                {selectedTemplate && <AnimatedEmoji emoji="🍪" />}
                {selectedTrack && <AnimatedEmoji emoji="🎵" delay={0.1} />}
                {selectedCaptionStyle && <AnimatedEmoji emoji="✨" delay={0.2} />}
                {!selectedTemplate && !selectedTrack && !selectedCaptionStyle && (
                  <span className="text-sm text-slate-400 italic">None yet</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Navigation - Kitchen Menu Style */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {SECTIONS.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`relative p-5 rounded-2xl text-left transition-all overflow-hidden ${
                activeSection === section.id
                  ? 'bg-gradient-to-br ' + section.color + ' text-white shadow-xl'
                  : 'glass hover:shadow-lg border border-white/30 dark:border-slate-700/30'
              }`}
            >
              {/* Animated background pattern */}
              {activeSection === section.id && (
                <motion.div
                  className="absolute inset-0 opacity-20"
                  initial={{ backgroundPosition: '0% 0%' }}
                  animate={{ backgroundPosition: '100% 100%' }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {/* Badge */}
              <motion.span
                className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold ${
                  activeSection === section.id
                    ? 'bg-white/25 text-white'
                    : section.badge === 'HOT'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : section.badge === 'Live'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {section.badge}
              </motion.span>

              {/* Emoji with bounce */}
              <motion.span
                className="text-3xl mb-2 block"
                animate={activeSection === section.id ? {
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {section.emoji}
              </motion.span>

              <p className={`font-bold text-base ${
                activeSection === section.id ? 'text-white' : 'text-slate-800 dark:text-white'
              }`}>
                {section.name}
              </p>
              <p className={`text-xs mt-1 ${
                activeSection === section.id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {section.description}
              </p>

              {/* Selection indicator */}
              {activeSection === section.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"
                  layoutId="activeIndicator"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Tool (Kitchen Station) */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-3xl overflow-hidden border border-white/30 dark:border-slate-700/30">
              {/* Tool Header */}
              <div className="px-6 py-4 border-b border-white/20 dark:border-slate-700/30 bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="text-2xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {SECTIONS.find(s => s.id === activeSection)?.emoji}
                    </motion.span>
                    <div>
                      <h2 className="font-bold text-slate-800 dark:text-white">
                        {SECTIONS.find(s => s.id === activeSection)?.name}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {SECTIONS.find(s => s.id === activeSection)?.description}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium">Active</span>
                  </motion.div>
                </div>
              </div>

              {/* Tool Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeSection === 'music' && (
                    <motion.div
                      key="music"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <MusicLibrary
                        onSelectTrack={setSelectedTrack}
                        selectedTrackId={selectedTrack?.id}
                      />
                    </motion.div>
                  )}

                  {activeSection === 'captions' && (
                    <motion.div
                      key="captions"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <CaptionStyles
                        selectedStyle={selectedCaptionStyle}
                        onSelectStyle={setSelectedCaptionStyle}
                      />
                    </motion.div>
                  )}

                  {activeSection === 'templates' && (
                    <motion.div
                      key="templates"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <TemplatesGallery
                        onSelectTemplate={setSelectedTemplate}
                        selectedTemplateId={selectedTemplate?.id}
                      />
                    </motion.div>
                  )}

                  {activeSection === 'scheduler' && (
                    <motion.div
                      key="scheduler"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <SocialScheduler />
                    </motion.div>
                  )}

                  {activeSection === 'analytics' && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <AnalyticsDashboard />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Recipe Summary */}
          <div className="space-y-6">
            {/* Current Recipe Card */}
            <motion.div
              className="glass rounded-3xl overflow-hidden border border-white/30 dark:border-slate-700/30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="px-6 py-4 border-b border-white/20 dark:border-slate-700/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <AnimatedEmoji emoji="📝" />
                  Your Recipe
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {/* Selected Template */}
                <motion.div
                  className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <AnimatedEmoji emoji="🍪" /> Template
                    </span>
                    <button
                      onClick={() => setActiveSection('templates')}
                      className="text-xs text-databake-turquoise-dark hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  {selectedTemplate ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedTemplate.thumbnail}
                        alt={selectedTemplate.name}
                        className="w-14 h-20 rounded-xl object-cover shadow-md"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{selectedTemplate.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{selectedTemplate.contentType}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic flex items-center gap-2">
                      <span className="opacity-50">🍪</span> Select a base recipe
                    </p>
                  )}
                </motion.div>

                {/* Selected Music */}
                <motion.div
                  className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <AnimatedEmoji emoji="🎵" /> Music
                    </span>
                    <button
                      onClick={() => setActiveSection('music')}
                      className="text-xs text-databake-turquoise-dark hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  {selectedTrack ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedTrack.coverUrl}
                        alt={selectedTrack.title}
                        className="w-12 h-12 rounded-xl object-cover shadow-md"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{selectedTrack.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTrack.artist}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic flex items-center gap-2">
                      <span className="opacity-50">🎵</span> Add the perfect sound
                    </p>
                  )}
                </motion.div>

                {/* Selected Caption Style */}
                <motion.div
                  className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                      <AnimatedEmoji emoji="✨" /> Style
                    </span>
                    <button
                      onClick={() => setActiveSection('captions')}
                      className="text-xs text-databake-turquoise-dark hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  {selectedCaptionStyle ? (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-md"
                        style={{
                          backgroundColor: selectedCaptionStyle.backgroundColor || '#333',
                          color: selectedCaptionStyle.textColor
                        }}
                      >
                        Aa
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{selectedCaptionStyle.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{selectedCaptionStyle.animation}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic flex items-center gap-2">
                      <span className="opacity-50">✨</span> Choose the text style
                    </p>
                  )}
                </motion.div>

                {/* Cook Button */}
                <motion.button
                  onClick={startCooking}
                  disabled={isCooking}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isCooking ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Utensils className="w-6 h-6" />
                      </motion.span>
                      Cooking...
                      <AnimatedEmoji emoji="🔥" />
                    </>
                  ) : (
                    <>
                      <ChefHat className="w-6 h-6" />
                      Cook Content
                      <AnimatedEmoji emoji="🚀" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            {activeSection !== 'analytics' && (
              <motion.div
                className="glass rounded-3xl overflow-hidden border border-white/30 dark:border-slate-700/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="px-6 py-4 border-b border-white/20 dark:border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <AnimatedEmoji emoji="📊" />
                      Quick Stats
                    </h3>
                    <button
                      onClick={() => setActiveSection('analytics')}
                      className="text-xs text-databake-turquoise-dark hover:underline flex items-center gap-1"
                    >
                      See more <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <AnalyticsDashboard compact />
                </div>
              </motion.div>
            )}

            {/* Quick Music */}
            {activeSection !== 'music' && (
              <motion.div
                className="glass rounded-3xl overflow-hidden border border-white/30 dark:border-slate-700/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="px-6 py-4 border-b border-white/20 dark:border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <AnimatedEmoji emoji="🎵" />
                      Trending Sounds
                    </h3>
                    <button
                      onClick={() => setActiveSection('music')}
                      className="text-xs text-databake-turquoise-dark hover:underline flex items-center gap-1"
                    >
                      See more <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <MusicLibrary
                    onSelectTrack={setSelectedTrack}
                    selectedTrackId={selectedTrack?.id}
                    compact
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatedEmoji emoji="👨‍🍳" />
            <span>Cooked with love at</span>
            <span className="font-bold text-slate-800 dark:text-white">DataBake.media</span>
            <AnimatedEmoji emoji="🔥" delay={0.2} />
          </motion.div>
        </div>
      </footer>
    </main>
  )
}
