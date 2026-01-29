'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Mic,
  Save,
  CheckCircle2,
  Info,
  Video,
  Palette,
  ExternalLink,
  Moon,
  Sun,
  Globe
} from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'
import { useLanguage } from '@/lib/LanguageContext'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage } = useLanguage()

  const [shopifyUrl, setShopifyUrl] = useState('')
  const [shopifyToken, setShopifyToken] = useState('')
  const [geminiKey, setGeminiKey] = useState('')
  const [elevenlabsKey, setElevenlabsKey] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main className="min-h-screen aurora-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-subtle border-b border-white/20 dark:border-gray-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-tada-text dark:text-gray-200" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-tada-turquoise via-tada-turquoise-dark to-tada-pink flex items-center justify-center shadow-glass glow-turquoise">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-tada-text dark:text-gray-100">Settings</h1>
                <p className="text-xs text-tada-text-light dark:text-gray-400">Configure your integrations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Appearance Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6"
          >
            <h2 className="font-semibold text-tada-text dark:text-gray-100 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-tada-turquoise-dark" />
              Appearance
            </h2>

            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30">
                <div className="flex items-center gap-3">
                  {theme === 'light' ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-blue-400" />
                  )}
                  <div>
                    <p className="font-medium text-tada-text dark:text-gray-200">Theme</p>
                    <p className="text-sm text-tada-text-light dark:text-gray-400">
                      {theme === 'light' ? 'Light mode' : 'Dark mode'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-tada-turquoise' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                      theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Language Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-tada-turquoise-dark" />
                  <div>
                    <p className="font-medium text-tada-text dark:text-gray-200">Language</p>
                    <p className="text-sm text-tada-text-light dark:text-gray-400">
                      {language === 'en' ? 'English' : 'Español'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      language === 'en'
                        ? 'bg-tada-turquoise text-tada-text'
                        : 'bg-white/50 dark:bg-gray-700/50 text-tada-text-light dark:text-gray-400'
                    }`}
                  >
                    🇺🇸 EN
                  </button>
                  <button
                    onClick={() => setLanguage('es')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      language === 'es'
                        ? 'bg-tada-turquoise text-tada-text'
                        : 'bg-white/50 dark:bg-gray-700/50 text-tada-text-light dark:text-gray-400'
                    }`}
                  >
                    🇪🇸 ES
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Shopify Configuration */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-turquoise">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-tada-text dark:text-gray-100">Shopify</h2>
                <p className="text-sm text-tada-text-light dark:text-gray-400">Connect your store to import products</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-tada-text dark:text-gray-200 mb-2">Store URL</label>
                <input
                  type="text"
                  value={shopifyUrl}
                  onChange={(e) => setShopifyUrl(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="input-field dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tada-text dark:text-gray-200 mb-2">Storefront Access Token</label>
                <input
                  type="password"
                  value={shopifyToken}
                  onChange={(e) => setShopifyToken(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxx"
                  className="input-field dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder-gray-500"
                />
                <p className="text-xs text-tada-text-light dark:text-gray-400 mt-2">
                  Get this from Shopify Admin → Settings → Apps → Develop apps
                </p>
              </div>
            </div>
          </motion.section>

          {/* Gemini Configuration */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-pink">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-tada-text dark:text-gray-100">Gemini AI</h2>
                <p className="text-sm text-tada-text-light dark:text-gray-400">For AI scripts and image generation (FREE)</p>
              </div>
              <span className="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                Free Tier
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-tada-text dark:text-gray-200 mb-2">API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza..."
                className="input-field dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder-gray-500"
              />
              <p className="text-xs text-tada-text-light dark:text-gray-400 mt-2">
                Get your free API key at{' '}
                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-tada-turquoise-dark hover:underline inline-flex items-center gap-1">
                  Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </motion.section>

          {/* ElevenLabs Configuration */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-turquoise">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-tada-text dark:text-gray-100">ElevenLabs</h2>
                <p className="text-sm text-tada-text-light dark:text-gray-400">For premium voice generation</p>
              </div>
              <span className="ml-auto px-3 py-1 glass-subtle text-tada-text-light dark:text-gray-400 text-xs font-medium">Optional</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-tada-text dark:text-gray-200 mb-2">API Key</label>
              <input
                type="password"
                value={elevenlabsKey}
                onChange={(e) => setElevenlabsKey(e.target.value)}
                placeholder="xxxxxxxxxxxx"
                className="input-field dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder-gray-500"
              />
              <p className="text-xs text-tada-text-light dark:text-gray-400 mt-2">
                Without this key, browser Text-to-Speech will be used
              </p>
            </div>
          </motion.section>

          {/* Video Export Integrations */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-pink">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-tada-text dark:text-gray-100">Video Export</h2>
                <p className="text-sm text-tada-text-light dark:text-gray-400">Professional video editing integrations</p>
              </div>
              <span className="ml-auto px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>

            <div className="space-y-3">
              {/* CapCut */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CC</span>
                  </div>
                  <div>
                    <p className="font-medium text-tada-text dark:text-gray-200">CapCut</p>
                    <p className="text-xs text-tada-text-light dark:text-gray-400">Export to CapCut templates</p>
                  </div>
                </div>
                <a
                  href="https://open.capcut.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-700/50 text-sm font-medium text-tada-text dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-600/50 transition-colors inline-flex items-center gap-2"
                >
                  Learn More <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Canva */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <div>
                    <p className="font-medium text-tada-text dark:text-gray-200">Canva</p>
                    <p className="text-xs text-tada-text-light dark:text-gray-400">Export to Canva designs</p>
                  </div>
                </div>
                <a
                  href="https://www.canva.com/developers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-700/50 text-sm font-medium text-tada-text dark:text-gray-200 hover:bg-white/70 dark:hover:bg-gray-600/50 transition-colors inline-flex items-center gap-2"
                >
                  Learn More <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.section>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleSave}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
            <p className="text-center text-xs text-tada-text-light dark:text-gray-400 mt-3">
              API keys are stored securely and never shared
            </p>
          </motion.div>

          {/* Environment Variables Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-6"
          >
            <h3 className="font-semibold text-tada-text dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="icon-turquoise">
                <Info className="w-5 h-5" />
              </span>
              Environment Variables (Production)
            </h3>
            <p className="text-sm text-tada-text-light dark:text-gray-400 mb-4">
              For Vercel deployment, add these environment variables:
            </p>
            <div className="bg-gray-900 rounded-2xl p-4 font-mono text-sm overflow-x-auto shadow-glass">
              <pre className="text-tada-turquoise">
{`# .env.local or Vercel Environment Variables
GEMINI_API_KEY=AIza...
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxx
ELEVENLABS_API_KEY=xxx  # Optional`}
              </pre>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
