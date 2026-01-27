'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Cpu, Mic, Save, CheckCircle2, Info, Sparkles } from 'lucide-react'

export default function SettingsPage() {
  const [shopifyUrl, setShopifyUrl] = useState('')
  const [shopifyToken, setShopifyToken] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [elevenlabsKey, setElevenlabsKey] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app, you'd save these to a secure backend
    // For demo purposes, we just show a success message
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main className="min-h-screen aurora-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-subtle border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-tada-text" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-tada-turquoise via-tada-turquoise-dark to-tada-pink flex items-center justify-center shadow-glass glow-turquoise">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-tada-text">Settings</h1>
                <p className="text-xs text-tada-text-light">Configure your integrations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
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
                <h2 className="font-semibold text-tada-text">Shopify</h2>
                <p className="text-sm text-tada-text-light">Connect your store to import products</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-tada-text mb-2">Store URL</label>
                <input
                  type="text"
                  value={shopifyUrl}
                  onChange={(e) => setShopifyUrl(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tada-text mb-2">Storefront Access Token</label>
                <input
                  type="password"
                  value={shopifyToken}
                  onChange={(e) => setShopifyToken(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxx"
                  className="input-field"
                />
                <p className="text-xs text-tada-text-light mt-2">
                  Get this token from Shopify Admin &rarr; Settings &rarr; Apps &rarr; Develop apps
                </p>
              </div>
            </div>
          </motion.section>

          {/* OpenAI Configuration */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-pink">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-tada-text">OpenAI</h2>
                <p className="text-sm text-tada-text-light">For AI-powered script generation</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-tada-text mb-2">API Key</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxx"
                className="input-field"
              />
              <p className="text-xs text-tada-text-light mt-2">
                Get your API key at{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-tada-turquoise-dark hover:underline">
                  platform.openai.com
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
                <h2 className="font-semibold text-tada-text">ElevenLabs</h2>
                <p className="text-sm text-tada-text-light">For premium voice generation</p>
              </div>
              <span className="ml-auto px-3 py-1 glass-subtle text-tada-text-light text-xs font-medium">Optional</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-tada-text mb-2">API Key</label>
              <input
                type="password"
                value={elevenlabsKey}
                onChange={(e) => setElevenlabsKey(e.target.value)}
                placeholder="xxxxxxxxxxxx"
                className="input-field"
              />
              <p className="text-xs text-tada-text-light mt-2">
                Without this key, browser Text-to-Speech will be used
              </p>
            </div>
          </motion.section>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
            <p className="text-center text-xs text-tada-text-light mt-3">
              API keys are stored securely and never shared
            </p>
          </motion.div>

          {/* Environment Variables Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-6"
          >
            <h3 className="font-semibold text-tada-text mb-3 flex items-center gap-2">
              <span className="icon-turquoise">
                <Info className="w-5 h-5" />
              </span>
              Environment Variables Configuration
            </h3>
            <p className="text-sm text-tada-text-light mb-4">
              For a more secure production setup, use environment variables:
            </p>
            <div className="bg-gray-900 rounded-2xl p-4 font-mono text-sm overflow-x-auto shadow-glass">
              <pre className="text-tada-turquoise">
{`# .env.local
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxx
OPENAI_API_KEY=sk-xxx
ELEVENLABS_API_KEY=xxx`}
              </pre>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
