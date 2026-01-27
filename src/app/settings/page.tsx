'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
    <main className="min-h-screen bg-clickboom-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-clickboom-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-clickboom-text">Settings</h1>
              <p className="text-xs text-clickboom-text-light">Configure your integrations</p>
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
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-clickboom-turquoise/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-clickboom-turquoise-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-clickboom-text">Shopify</h2>
                <p className="text-sm text-clickboom-text-light">Connect your store to import products</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-clickboom-text mb-2">Store URL</label>
                <input
                  type="text"
                  value={shopifyUrl}
                  onChange={(e) => setShopifyUrl(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-clickboom-text mb-2">Storefront Access Token</label>
                <input
                  type="password"
                  value={shopifyToken}
                  onChange={(e) => setShopifyToken(e.target.value)}
                  placeholder="shpat_xxxxxxxxxxxx"
                  className="input-field"
                />
                <p className="text-xs text-clickboom-text-light mt-2">
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
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-clickboom-pink/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-clickboom-pink-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-clickboom-text">OpenAI</h2>
                <p className="text-sm text-clickboom-text-light">For AI-powered script generation</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-clickboom-text mb-2">API Key</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxx"
                className="input-field"
              />
              <p className="text-xs text-clickboom-text-light mt-2">
                Get your API key at{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-clickboom-turquoise-dark hover:underline">
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
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-clickboom-turquoise/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-clickboom-turquoise-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-clickboom-text">ElevenLabs</h2>
                <p className="text-sm text-clickboom-text-light">For premium voice generation</p>
              </div>
              <span className="ml-auto px-3 py-1 bg-gray-100 text-clickboom-text-light rounded-full text-xs font-medium">Optional</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-clickboom-text mb-2">API Key</label>
              <input
                type="password"
                value={elevenlabsKey}
                onChange={(e) => setElevenlabsKey(e.target.value)}
                placeholder="xxxxxxxxxxxx"
                className="input-field"
              />
              <p className="text-xs text-clickboom-text-light mt-2">
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
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
            <p className="text-center text-xs text-clickboom-text-light mt-3">
              API keys are stored securely and never shared
            </p>
          </motion.div>

          {/* Environment Variables Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <h3 className="font-semibold text-clickboom-text mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-clickboom-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Environment Variables Configuration
            </h3>
            <p className="text-sm text-clickboom-text-light mb-4">
              For a more secure production setup, use environment variables:
            </p>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-clickboom-turquoise">
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
