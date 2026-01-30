'use client'

import { useState } from 'react'
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
  Star
} from 'lucide-react'
import { MusicLibrary, Track } from '@/components/MusicLibrary'
import { CaptionStyles, CaptionStyle } from '@/components/CaptionStyles'
import { TemplatesGallery, VideoTemplate } from '@/components/TemplatesGallery'
import { SocialScheduler } from '@/components/SocialScheduler'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

type StudioSection = 'music' | 'captions' | 'templates' | 'scheduler' | 'analytics'

const SECTIONS = [
  {
    id: 'music' as const,
    name: 'Music Library',
    description: 'Trending royalty-free sounds',
    icon: Music,
    color: 'from-purple-500 to-pink-500',
    badge: '50+ tracks'
  },
  {
    id: 'captions' as const,
    name: 'Caption Styles',
    description: 'Animated word-by-word subtitles',
    icon: Type,
    color: 'from-yellow-500 to-orange-500',
    badge: '6 styles'
  },
  {
    id: 'templates' as const,
    name: 'Templates',
    description: 'Pre-designed video templates',
    icon: Layout,
    color: 'from-indigo-500 to-purple-500',
    badge: '16+ templates'
  },
  {
    id: 'scheduler' as const,
    name: 'Auto-Post',
    description: 'Schedule & publish directly',
    icon: Send,
    color: 'from-green-500 to-emerald-500',
    badge: 'NEW'
  },
  {
    id: 'analytics' as const,
    name: 'Analytics',
    description: 'Track your performance',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    badge: 'Live'
  }
]

export default function StudioPage() {
  const [activeSection, setActiveSection] = useState<StudioSection>('templates')
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<CaptionStyle | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null)

  return (
    <main className="min-h-screen aurora-bg">
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
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-databake-turquoise via-databake-turquoise-dark to-databake-pink flex items-center justify-center shadow-glass glow-turquoise">
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Creator Studio</h1>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">All your creative tools in one place</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-databake-turquoise to-databake-pink text-databake-text text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Pro Tools
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Section Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {SECTIONS.map(section => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-2xl text-left transition-all overflow-hidden ${
                activeSection === section.id
                  ? 'bg-gradient-to-r ' + section.color + ' text-white shadow-lg'
                  : 'glass hover:bg-white/70 dark:hover:bg-slate-800/70'
              }`}
            >
              {/* Badge */}
              <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === section.id
                  ? 'bg-white/20 text-white'
                  : section.badge === 'NEW'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : section.badge === 'Live'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {section.badge}
              </span>

              <section.icon className={`w-6 h-6 mb-2 ${
                activeSection === section.id ? 'text-white' : 'text-databake-turquoise-dark'
              }`} />
              <p className={`font-semibold text-sm ${
                activeSection === section.id ? 'text-white' : 'text-slate-800 dark:text-white'
              }`}>
                {section.name}
              </p>
              <p className={`text-xs mt-0.5 ${
                activeSection === section.id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {section.description}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Tool */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass p-6">
              <AnimatePresence mode="wait">
                {activeSection === 'music' && (
                  <motion.div
                    key="music"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SocialScheduler />
                  </motion.div>
                )}

                {activeSection === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AnalyticsDashboard />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column - Selection Summary & Quick Actions */}
          <div className="space-y-6">
            {/* Current Selection */}
            <div className="glass p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Your Selection
              </h3>

              <div className="space-y-4">
                {/* Selected Template */}
                <div className="p-3 rounded-xl bg-white/30 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Template</span>
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
                        className="w-12 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">{selectedTemplate.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTemplate.contentType}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">No template selected</p>
                  )}
                </div>

                {/* Selected Music */}
                <div className="p-3 rounded-xl bg-white/30 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Music</span>
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
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">{selectedTrack.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{selectedTrack.artist}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">No music selected</p>
                  )}
                </div>

                {/* Selected Caption Style */}
                <div className="p-3 rounded-xl bg-white/30 dark:bg-slate-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Caption Style</span>
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
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                        style={{
                          backgroundColor: selectedCaptionStyle.backgroundColor || '#333',
                          color: selectedCaptionStyle.textColor
                        }}
                      >
                        Aa
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">{selectedCaptionStyle.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{selectedCaptionStyle.animation} animation</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">No style selected</p>
                  )}
                </div>
              </div>

              {/* Apply to Content Button */}
              <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-databake-turquoise to-databake-turquoise-dark text-databake-text font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Apply to Content
              </button>
            </div>

            {/* Quick Analytics */}
            {activeSection !== 'analytics' && (
              <div className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Quick Stats
                  </h3>
                  <button
                    onClick={() => setActiveSection('analytics')}
                    className="text-xs text-databake-turquoise-dark hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <AnalyticsDashboard compact />
              </div>
            )}

            {/* Quick Music */}
            {activeSection !== 'music' && (
              <div className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-500" />
                    Trending Music
                  </h3>
                  <button
                    onClick={() => setActiveSection('music')}
                    className="text-xs text-databake-turquoise-dark hover:underline flex items-center gap-1"
                  >
                    Browse All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <MusicLibrary
                  onSelectTrack={setSelectedTrack}
                  selectedTrackId={selectedTrack?.id}
                  compact
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>Made with</span>
            <span className="font-bold text-slate-800 dark:text-white">DataBake.media</span>
            <span>— Creator Studio</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
