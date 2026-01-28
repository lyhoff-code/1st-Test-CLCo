'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Users,
  Palette,
  Music,
  FileText,
  Stamp,
  Download,
  ChevronDown,
  ChevronUp,
  User,
  Leaf,
  Zap,
  Briefcase,
  Heart,
  AlertCircle,
  Clock,
  DollarSign,
  Battery,
  Crown,
  Film,
  Smartphone,
  Smile,
  Minus,
  Gem,
  Camera,
  PenTool,
  Box,
  Star,
  Droplet,
  Coffee,
  Flame,
  Sunrise,
  Laugh,
  VolumeX,
  Wind,
  Circle,
  Bell,
  ArrowRight,
  MousePointer,
  CheckCircle,
  BellRing,
  HelpCircle,
  MessageSquare,
  Eye,
  BookOpen,
  BarChart,
  Sparkles,
  Cpu,
  Shirt,
  Dumbbell,
  UtensilsCrossed,
  Plane,
  TrendingUp,
  Sun,
  Grid,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Volume2,
  Sliders
} from 'lucide-react'
import {
  VideoSettings,
  VoiceSettings,
  AudienceSettings,
  VisualSettings,
  MusicSettings,
  ScriptSettings,
  BrandingSettings,
  ExportSettings,
  VOICE_GENDERS,
  VOICE_ACCENTS,
  VOICE_EMOTIONS,
  VOICE_SPEEDS,
  AGE_GROUPS,
  PLATFORMS,
  NICHES,
  PAIN_POINTS,
  COLOR_MOODS,
  VISUAL_STYLES,
  ASPECT_RATIOS,
  IMAGE_STYLES,
  MUSIC_MOODS,
  SOUND_EFFECTS,
  HOOK_STYLES,
  SCRIPT_LENGTHS,
  LOGO_POSITIONS,
  FONT_FAMILIES,
  RESOLUTIONS,
  EXPORT_FORMATS,
  SUBTITLE_STYLES,
  VoiceEmotion,
  MusicMood,
  SoundEffect,
  PainPoint,
} from '@/types'

interface VideoSettingsPanelProps {
  settings: VideoSettings
  onChange: (settings: VideoSettings) => void
}

// Icon mapping for dynamic icons
const ICON_MAP: Record<string, typeof Mic> = {
  User, Users, Leaf, Zap, Briefcase, Heart, AlertCircle, Clock, DollarSign,
  Battery, Crown, Film, Smartphone, Smile, Minus, Gem, Camera, PenTool,
  Box, Star, Droplet, Coffee, Flame, Sunrise, Laugh, VolumeX, Wind, Circle,
  Bell, ArrowRight, MousePointer, CheckCircle, BellRing, HelpCircle,
  MessageSquare, Eye, BookOpen, BarChart, Sparkles, Cpu, Shirt, Dumbbell,
  UtensilsCrossed, Plane, TrendingUp, Sun, Grid, Globe, Instagram, Youtube, Facebook,
  Music, Volume2
}

export function VideoSettingsPanel({ settings, onChange }: VideoSettingsPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('voice')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const updateVoice = (voice: Partial<VoiceSettings>) => {
    onChange({ ...settings, voice: { ...settings.voice, ...voice } })
  }

  const updateAudience = (audience: Partial<AudienceSettings>) => {
    onChange({ ...settings, audience: { ...settings.audience, ...audience } })
  }

  const updateVisual = (visual: Partial<VisualSettings>) => {
    onChange({ ...settings, visual: { ...settings.visual, ...visual } })
  }

  const updateMusic = (music: Partial<MusicSettings>) => {
    onChange({ ...settings, music: { ...settings.music, ...music } })
  }

  const updateScript = (script: Partial<ScriptSettings>) => {
    onChange({ ...settings, script: { ...settings.script, ...script } })
  }

  const updateBranding = (branding: Partial<BrandingSettings>) => {
    onChange({ ...settings, branding: { ...settings.branding, ...branding } })
  }

  const updateExport = (exportSettings: Partial<ExportSettings>) => {
    onChange({ ...settings, export: { ...settings.export, ...exportSettings } })
  }

  const sections = [
    { id: 'voice', label: 'Voice', icon: Mic, color: 'turquoise' },
    { id: 'audience', label: 'Audience', icon: Users, color: 'pink' },
    { id: 'visual', label: 'Visual Style', icon: Palette, color: 'turquoise' },
    { id: 'music', label: 'Music & Sound', icon: Music, color: 'pink' },
    { id: 'script', label: 'Script', icon: FileText, color: 'turquoise' },
    { id: 'branding', label: 'Branding', icon: Stamp, color: 'pink' },
    { id: 'export', label: 'Export', icon: Download, color: 'turquoise' },
  ]

  return (
    <div className="space-y-3">
      {/* Section Headers */}
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-tada-turquoise-dark" />
        <h3 className="font-semibold text-tada-text">Advanced Settings</h3>
        <span className="text-xs text-tada-text-light">(7 categories)</span>
      </div>

      {sections.map((section) => {
        const Icon = section.icon
        const isExpanded = expandedSection === section.id
        const isTurquoise = section.color === 'turquoise'

        return (
          <div key={section.id} className="glass-subtle overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full p-4 flex items-center justify-between transition-all ${
                isExpanded ? 'bg-white/50' : 'hover:bg-white/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isTurquoise ? 'bg-tada-turquoise/20' : 'bg-tada-pink/20'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isTurquoise ? 'text-tada-turquoise-dark' : 'text-tada-pink-dark'
                  }`} />
                </div>
                <span className="font-medium text-tada-text">{section.label}</span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-tada-text-light" />
              ) : (
                <ChevronDown className="w-5 h-5 text-tada-text-light" />
              )}
            </button>

            {/* Section Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-4">
                    {section.id === 'voice' && (
                      <VoiceSection settings={settings.voice} onChange={updateVoice} />
                    )}
                    {section.id === 'audience' && (
                      <AudienceSection settings={settings.audience} onChange={updateAudience} />
                    )}
                    {section.id === 'visual' && (
                      <VisualSection settings={settings.visual} onChange={updateVisual} />
                    )}
                    {section.id === 'music' && (
                      <MusicSection settings={settings.music} onChange={updateMusic} />
                    )}
                    {section.id === 'script' && (
                      <ScriptSection settings={settings.script} onChange={updateScript} />
                    )}
                    {section.id === 'branding' && (
                      <BrandingSection settings={settings.branding} onChange={updateBranding} />
                    )}
                    {section.id === 'export' && (
                      <ExportSection settings={settings.export} onChange={updateExport} />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// 1. VOICE SECTION
// ============================================

function VoiceSection({ settings, onChange }: { settings: VoiceSettings; onChange: (s: Partial<VoiceSettings>) => void }) {
  return (
    <div className="space-y-4">
      {/* Gender */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Voice Gender</label>
        <div className="grid grid-cols-3 gap-2">
          {VOICE_GENDERS.map((gender) => (
            <button
              key={gender.value}
              onClick={() => onChange({ gender: gender.value })}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                settings.gender === gender.value
                  ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70 text-tada-text-light'
              }`}
            >
              {gender.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accent */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Accent</label>
        <div className="flex flex-wrap gap-2">
          {VOICE_ACCENTS.map((accent) => (
            <button
              key={accent.value}
              onClick={() => onChange({ accent: accent.value })}
              className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                settings.accent === accent.value
                  ? 'bg-tada-pink/30 border-2 border-tada-pink text-tada-text'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70 text-tada-text-light'
              }`}
            >
              <span>{accent.flag}</span>
              <span>{accent.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Emotion */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Emotion</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VOICE_EMOTIONS.map((emotion) => {
            const Icon = ICON_MAP[emotion.iconName] || Smile
            const isTurquoise = emotion.color === 'turquoise'
            return (
              <button
                key={emotion.value}
                onClick={() => onChange({ emotion: emotion.value })}
                className={`p-3 rounded-xl text-sm transition-all flex items-center gap-2 ${
                  settings.emotion === emotion.value
                    ? isTurquoise
                      ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                      : 'bg-tada-pink/30 border-2 border-tada-pink text-tada-text'
                    : 'bg-white/50 border-2 border-transparent hover:bg-white/70 text-tada-text-light'
                }`}
              >
                <Icon className={`w-4 h-4 ${
                  settings.emotion === emotion.value
                    ? isTurquoise ? 'text-tada-turquoise-dark' : 'text-tada-pink-dark'
                    : 'text-tada-text-light'
                }`} />
                <span>{emotion.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Speed */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Speaking Speed</label>
        <div className="grid grid-cols-3 gap-2">
          {VOICE_SPEEDS.map((speed) => (
            <button
              key={speed.value}
              onClick={() => onChange({ speed: speed.value })}
              className={`p-3 rounded-xl text-sm transition-all ${
                settings.speed === speed.value
                  ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70 text-tada-text-light'
              }`}
            >
              {speed.label}
            </button>
          ))}
        </div>
      </div>

      {/* Volume Slider */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 flex justify-between">
          <span>Volume</span>
          <span className="text-tada-text-light">{settings.volume}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.volume}
          onChange={(e) => onChange({ volume: parseInt(e.target.value) })}
          className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-tada-turquoise"
        />
      </div>
    </div>
  )
}

// ============================================
// 2. AUDIENCE SECTION
// ============================================

function AudienceSection({ settings, onChange }: { settings: AudienceSettings; onChange: (s: Partial<AudienceSettings>) => void }) {
  return (
    <div className="space-y-4">
      {/* Age Group */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Target Age Group</label>
        <div className="space-y-2">
          {AGE_GROUPS.map((age) => (
            <button
              key={age.value}
              onClick={() => onChange({ ageGroup: age.value })}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                settings.ageGroup === age.value
                  ? 'bg-tada-pink/30 border-2 border-tada-pink'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-tada-text">{age.label}</span>
                <span className="text-xs text-tada-text-light">{age.range}</span>
              </div>
              <p className="text-xs text-tada-text-light mt-1">{age.traits}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Target Platform</label>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map((platform) => {
            const Icon = ICON_MAP[platform.iconName] || Globe
            return (
              <button
                key={platform.value}
                onClick={() => onChange({ platform: platform.value })}
                className={`p-3 rounded-xl text-sm transition-all flex items-center gap-2 ${
                  settings.platform === platform.value
                    ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                    : 'bg-white/50 border-2 border-transparent hover:bg-white/70 text-tada-text-light'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{platform.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Niche */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Content Niche</label>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((niche) => {
            const Icon = ICON_MAP[niche.iconName] || Grid
            const isTurquoise = niche.color === 'turquoise'
            return (
              <button
                key={niche.value}
                onClick={() => onChange({ niche: niche.value })}
                className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                  settings.niche === niche.value
                    ? isTurquoise
                      ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                      : 'bg-tada-pink/30 border-2 border-tada-pink text-tada-text'
                    : 'bg-white/50 border-2 border-transparent hover:bg-white/70 text-tada-text-light'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{niche.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Pain Points */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Pain Points (select multiple)</label>
        <div className="grid grid-cols-2 gap-2">
          {PAIN_POINTS.map((pain) => {
            const Icon = ICON_MAP[pain.iconName] || Clock
            const isSelected = settings.painPoints.includes(pain.value)
            return (
              <button
                key={pain.value}
                onClick={() => {
                  const newPainPoints = isSelected
                    ? settings.painPoints.filter(p => p !== pain.value)
                    : [...settings.painPoints, pain.value]
                  onChange({ painPoints: newPainPoints })
                }}
                className={`p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-tada-pink/30 border-2 border-tada-pink'
                    : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-tada-pink-dark' : 'text-tada-text-light'}`} />
                  <span className="text-sm font-medium text-tada-text">{pain.label}</span>
                </div>
                <p className="text-xs text-tada-text-light mt-1">{pain.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================
// 3. VISUAL SECTION
// ============================================

function VisualSection({ settings, onChange }: { settings: VisualSettings; onChange: (s: Partial<VisualSettings>) => void }) {
  return (
    <div className="space-y-4">
      {/* Color Mood */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Color Mood</label>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_MOODS.map((mood) => (
            <button
              key={mood.value}
              onClick={() => onChange({ colorMood: mood.value })}
              className={`p-3 rounded-xl text-left transition-all ${
                settings.colorMood === mood.value
                  ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {mood.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border border-white/50"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="font-medium text-tada-text text-sm">{mood.label}</span>
              <p className="text-xs text-tada-text-light">{mood.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Style */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Visual Style</label>
        <div className="grid grid-cols-2 gap-2">
          {VISUAL_STYLES.map((style) => {
            const Icon = ICON_MAP[style.iconName] || Film
            return (
              <button
                key={style.value}
                onClick={() => onChange({ visualStyle: style.value })}
                className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                  settings.visualStyle === style.value
                    ? 'bg-tada-pink/30 border-2 border-tada-pink'
                    : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
                }`}
              >
                <Icon className={`w-5 h-5 ${settings.visualStyle === style.value ? 'text-tada-pink-dark' : 'text-tada-text-light'}`} />
                <div>
                  <span className="font-medium text-tada-text text-sm block">{style.label}</span>
                  <span className="text-xs text-tada-text-light">{style.description}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Aspect Ratio</label>
        <div className="grid grid-cols-2 gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => onChange({ aspectRatio: ratio.value })}
              className={`p-3 rounded-xl transition-all ${
                settings.aspectRatio === ratio.value
                  ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
              }`}
            >
              <span className="font-medium text-tada-text text-sm block">{ratio.label}</span>
              <span className="text-xs text-tada-text-light">{ratio.platforms.join(', ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Style */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">AI Image Style</label>
        <div className="flex flex-wrap gap-2">
          {IMAGE_STYLES.map((style) => {
            const Icon = ICON_MAP[style.iconName] || Camera
            return (
              <button
                key={style.value}
                onClick={() => onChange({ imageStyle: style.value })}
                className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                  settings.imageStyle === style.value
                    ? 'bg-tada-pink/30 border-2 border-tada-pink text-tada-text'
                    : 'bg-white/50 border-2 border-transparent hover:bg-white/70 text-tada-text-light'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{style.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Adjustments */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-tada-text block">Adjustments</label>

        <div>
          <div className="flex justify-between text-xs text-tada-text-light mb-1">
            <span>Brightness</span>
            <span>{settings.brightness > 0 ? '+' : ''}{settings.brightness}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={settings.brightness}
            onChange={(e) => onChange({ brightness: parseInt(e.target.value) })}
            className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-tada-turquoise"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-tada-text-light mb-1">
            <span>Contrast</span>
            <span>{settings.contrast > 0 ? '+' : ''}{settings.contrast}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={settings.contrast}
            onChange={(e) => onChange({ contrast: parseInt(e.target.value) })}
            className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-tada-turquoise"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-tada-text-light mb-1">
            <span>Saturation</span>
            <span>{settings.saturation > 0 ? '+' : ''}{settings.saturation}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={settings.saturation}
            onChange={(e) => onChange({ saturation: parseInt(e.target.value) })}
            className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-tada-turquoise"
          />
        </div>
      </div>
    </div>
  )
}

// ============================================
// 4. MUSIC SECTION
// ============================================

function MusicSection({ settings, onChange }: { settings: MusicSettings; onChange: (s: Partial<MusicSettings>) => void }) {
  return (
    <div className="space-y-4">
      {/* Music Mood */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Music Mood</label>
        <div className="grid grid-cols-2 gap-2">
          {MUSIC_MOODS.map((mood) => {
            const Icon = ICON_MAP[mood.iconName] || Music
            return (
              <button
                key={mood.value}
                onClick={() => onChange({ mood: mood.value })}
                className={`p-3 rounded-xl text-left transition-all ${
                  settings.mood === mood.value
                    ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise'
                    : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${settings.mood === mood.value ? 'text-tada-turquoise-dark' : 'text-tada-text-light'}`} />
                  <span className="font-medium text-tada-text text-sm">{mood.label}</span>
                </div>
                <p className="text-xs text-tada-text-light">{mood.description}</p>
                {mood.bpm !== '-' && (
                  <span className="text-xs text-tada-text-light">{mood.bpm} BPM</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Volume */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 flex justify-between">
          <span>Music Volume</span>
          <span className="text-tada-text-light">{settings.volume}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.volume}
          onChange={(e) => onChange({ volume: parseInt(e.target.value) })}
          className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-tada-pink"
        />
      </div>

      {/* Voice/Music Balance */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 flex justify-between">
          <span>Voice/Music Balance</span>
          <span className="text-tada-text-light">{settings.voiceMusicBalance}% voice</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.voiceMusicBalance}
          onChange={(e) => onChange({ voiceMusicBalance: parseInt(e.target.value) })}
          className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-tada-turquoise"
        />
        <div className="flex justify-between text-xs text-tada-text-light mt-1">
          <span>More Music</span>
          <span>More Voice</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { key: 'fadeIn', label: 'Fade In' },
          { key: 'fadeOut', label: 'Fade Out' },
          { key: 'beatSync', label: 'Beat Sync' },
        ].map((toggle) => (
          <button
            key={toggle.key}
            onClick={() => onChange({ [toggle.key]: !settings[toggle.key as keyof MusicSettings] })}
            className={`p-3 rounded-xl text-sm transition-all ${
              settings[toggle.key as keyof MusicSettings]
                ? 'bg-tada-pink/30 border-2 border-tada-pink text-tada-text'
                : 'bg-white/50 border-2 border-transparent text-tada-text-light'
            }`}
          >
            {toggle.label}
          </button>
        ))}
      </div>

      {/* Sound Effects */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Sound Effects</label>
        <div className="flex flex-wrap gap-2">
          {SOUND_EFFECTS.map((effect) => {
            const Icon = ICON_MAP[effect.iconName] || Circle
            const isSelected = settings.soundEffects.includes(effect.value)
            return (
              <button
                key={effect.value}
                onClick={() => {
                  const newEffects = isSelected
                    ? settings.soundEffects.filter(e => e !== effect.value)
                    : [...settings.soundEffects, effect.value]
                  onChange({ soundEffects: newEffects })
                }}
                className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                    : 'bg-white/50 border-2 border-transparent text-tada-text-light'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{effect.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================
// 5. SCRIPT SECTION
// ============================================

function ScriptSection({ settings, onChange }: { settings: ScriptSettings; onChange: (s: Partial<ScriptSettings>) => void }) {
  const [keywordInput, setKeywordInput] = useState('')

  return (
    <div className="space-y-4">
      {/* Hook Style */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Hook Style</label>
        <div className="space-y-2">
          {HOOK_STYLES.map((hook) => {
            const Icon = ICON_MAP[hook.iconName] || HelpCircle
            return (
              <button
                key={hook.value}
                onClick={() => onChange({ hookStyle: hook.value })}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  settings.hookStyle === hook.value
                    ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise'
                    : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${settings.hookStyle === hook.value ? 'text-tada-turquoise-dark' : 'text-tada-text-light'}`} />
                  <span className="font-medium text-tada-text text-sm">{hook.label}</span>
                </div>
                <p className="text-xs text-tada-text-light italic">"{hook.example}"</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Script Length */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Script Length</label>
        <div className="grid grid-cols-2 gap-2">
          {SCRIPT_LENGTHS.map((len) => (
            <button
              key={len.value}
              onClick={() => onChange({ length: len.value })}
              className={`p-3 rounded-xl transition-all ${
                settings.length === len.value
                  ? 'bg-tada-pink/30 border-2 border-tada-pink'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
              }`}
            >
              <span className="font-medium text-tada-text text-sm block">{len.label}</span>
              <span className="text-xs text-tada-text-light">{len.wordsApprox}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CTA Style */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Call-to-Action Style</label>
        <div className="grid grid-cols-3 gap-2">
          {(['soft', 'medium', 'direct'] as const).map((style) => (
            <button
              key={style}
              onClick={() => onChange({ ctaStyle: style })}
              className={`p-3 rounded-xl text-sm capitalize transition-all ${
                settings.ctaStyle === style
                  ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                  : 'bg-white/50 border-2 border-transparent text-tada-text-light'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Include Keywords</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && keywordInput.trim()) {
                onChange({ includeKeywords: [...settings.includeKeywords, keywordInput.trim()] })
                setKeywordInput('')
              }
            }}
            placeholder="Add keyword and press Enter"
            className="flex-1 input-field text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {settings.includeKeywords.map((keyword, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-tada-turquoise/20 rounded-lg text-sm text-tada-text flex items-center gap-1"
            >
              {keyword}
              <button
                onClick={() => onChange({ includeKeywords: settings.includeKeywords.filter((_, idx) => idx !== i) })}
                className="text-tada-text-light hover:text-tada-text"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange({ includeHashtags: !settings.includeHashtags })}
          className={`p-3 rounded-xl text-sm transition-all ${
            settings.includeHashtags
              ? 'bg-tada-pink/30 border-2 border-tada-pink text-tada-text'
              : 'bg-white/50 border-2 border-transparent text-tada-text-light'
          }`}
        >
          Include Hashtags
        </button>
        <button
          onClick={() => onChange({ includeEmojis: !settings.includeEmojis })}
          className={`p-3 rounded-xl text-sm transition-all ${
            settings.includeEmojis
              ? 'bg-tada-pink/30 border-2 border-tada-pink text-tada-text'
              : 'bg-white/50 border-2 border-transparent text-tada-text-light'
          }`}
        >
          Include Emojis
        </button>
      </div>
    </div>
  )
}

// ============================================
// 6. BRANDING SECTION
// ============================================

function BrandingSection({ settings, onChange }: { settings: BrandingSettings; onChange: (s: Partial<BrandingSettings>) => void }) {
  return (
    <div className="space-y-4">
      {/* Logo URL */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Logo URL</label>
        <input
          type="text"
          value={settings.logoUrl || ''}
          onChange={(e) => onChange({ logoUrl: e.target.value || undefined })}
          placeholder="https://your-logo.png"
          className="input-field text-sm"
        />
      </div>

      {/* Logo Position */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Logo Position</label>
        <div className="grid grid-cols-3 gap-2">
          {LOGO_POSITIONS.map((pos) => (
            <button
              key={pos.value}
              onClick={() => onChange({ logoPosition: pos.value })}
              className={`p-2 rounded-xl text-xs transition-all ${
                settings.logoPosition === pos.value
                  ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                  : 'bg-white/50 border-2 border-transparent text-tada-text-light'
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logo Size & Opacity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-tada-text mb-2 flex justify-between">
            <span>Size</span>
            <span className="text-tada-text-light">{settings.logoSize}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.logoSize}
            onChange={(e) => onChange({ logoSize: parseInt(e.target.value) })}
            className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-tada-turquoise"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-tada-text mb-2 flex justify-between">
            <span>Opacity</span>
            <span className="text-tada-text-light">{settings.logoOpacity}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.logoOpacity}
            onChange={(e) => onChange({ logoOpacity: parseInt(e.target.value) })}
            className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-tada-turquoise"
          />
        </div>
      </div>

      {/* Brand Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-tada-text mb-2 block">Primary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => onChange({ primaryColor: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => onChange({ primaryColor: e.target.value })}
              className="flex-1 input-field text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-tada-text mb-2 block">Secondary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => onChange({ secondaryColor: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => onChange({ secondaryColor: e.target.value })}
              className="flex-1 input-field text-sm"
            />
          </div>
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Font Family</label>
        <div className="grid grid-cols-2 gap-2">
          {FONT_FAMILIES.map((font) => (
            <button
              key={font.value}
              onClick={() => onChange({ fontFamily: font.value })}
              className={`p-3 rounded-xl transition-all ${
                settings.fontFamily === font.value
                  ? 'bg-tada-pink/30 border-2 border-tada-pink'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
              }`}
              style={{ fontFamily: font.value }}
            >
              <span className="font-medium text-tada-text text-sm block">{font.label}</span>
              <span className="text-xs text-tada-text-light">{font.style}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Intro/Outro */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange({ showIntro: !settings.showIntro })}
          className={`p-3 rounded-xl text-sm transition-all ${
            settings.showIntro
              ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
              : 'bg-white/50 border-2 border-transparent text-tada-text-light'
          }`}
        >
          Show Intro
        </button>
        <button
          onClick={() => onChange({ showOutro: !settings.showOutro })}
          className={`p-3 rounded-xl text-sm transition-all ${
            settings.showOutro
              ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
              : 'bg-white/50 border-2 border-transparent text-tada-text-light'
          }`}
        >
          Show Outro
        </button>
      </div>
    </div>
  )
}

// ============================================
// 7. EXPORT SECTION
// ============================================

function ExportSection({ settings, onChange }: { settings: ExportSettings; onChange: (s: Partial<ExportSettings>) => void }) {
  return (
    <div className="space-y-4">
      {/* Resolution */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Resolution</label>
        <div className="grid grid-cols-3 gap-2">
          {RESOLUTIONS.map((res) => (
            <button
              key={res.value}
              onClick={() => onChange({ resolution: res.value })}
              className={`p-3 rounded-xl transition-all ${
                settings.resolution === res.value
                  ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
              }`}
            >
              <span className="font-medium text-tada-text text-sm block">{res.label}</span>
              <span className="text-xs text-tada-text-light">{res.fileSize}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Format</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format.value}
              onClick={() => onChange({ format: format.value })}
              className={`p-3 rounded-xl transition-all ${
                settings.format === format.value
                  ? 'bg-tada-pink/30 border-2 border-tada-pink'
                  : 'bg-white/50 border-2 border-transparent hover:bg-white/70'
              }`}
            >
              <span className="font-medium text-tada-text text-sm block">.{format.value.toUpperCase()}</span>
              <span className="text-xs text-tada-text-light">{format.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FPS */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Frame Rate</label>
        <div className="grid grid-cols-3 gap-2">
          {[24, 30, 60].map((fps) => (
            <button
              key={fps}
              onClick={() => onChange({ fps })}
              className={`p-3 rounded-xl text-sm transition-all ${
                settings.fps === fps
                  ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                  : 'bg-white/50 border-2 border-transparent text-tada-text-light'
              }`}
            >
              {fps} FPS
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 flex justify-between">
          <span>Quality</span>
          <span className="text-tada-text-light">{settings.quality}%</span>
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={settings.quality}
          onChange={(e) => onChange({ quality: parseInt(e.target.value) })}
          className="w-full h-2 bg-white/50 rounded-lg appearance-none cursor-pointer accent-tada-turquoise"
        />
      </div>

      {/* Subtitles */}
      <div>
        <label className="text-sm font-medium text-tada-text mb-2 block">Subtitles</label>
        <button
          onClick={() => onChange({ includeSubtitles: !settings.includeSubtitles })}
          className={`w-full p-3 rounded-xl text-sm transition-all mb-2 ${
            settings.includeSubtitles
              ? 'bg-tada-pink/30 border-2 border-tada-pink text-tada-text'
              : 'bg-white/50 border-2 border-transparent text-tada-text-light'
          }`}
        >
          {settings.includeSubtitles ? 'Subtitles Enabled' : 'No Subtitles'}
        </button>

        {settings.includeSubtitles && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {SUBTITLE_STYLES.filter(s => s.value !== 'none').map((style) => (
                <button
                  key={style.value}
                  onClick={() => onChange({ subtitleStyle: style.value })}
                  className={`px-3 py-2 rounded-xl text-xs transition-all ${
                    settings.subtitleStyle === style.value
                      ? 'bg-tada-turquoise/30 border-2 border-tada-turquoise text-tada-text'
                      : 'bg-white/50 border-2 border-transparent text-tada-text-light'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => onChange({ subtitlePosition: pos })}
                  className={`p-2 rounded-xl text-xs capitalize transition-all ${
                    settings.subtitlePosition === pos
                      ? 'bg-tada-pink/30 border-2 border-tada-pink text-tada-text'
                      : 'bg-white/50 border-2 border-transparent text-tada-text-light'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
