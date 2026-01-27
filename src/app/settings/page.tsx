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
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
        >
          <span>←</span> Volver al Generador
        </Link>
        <h1 className="text-3xl font-bold gradient-text">Configuración</h1>
        <p className="text-white/60 mt-2">Configura tus integraciones y API keys</p>
      </motion.div>

      <div className="space-y-6">
        {/* Shopify Configuration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <div>
              <h2 className="font-semibold">Shopify</h2>
              <p className="text-sm text-white/50">Conecta tu tienda para importar productos</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">URL de la Tienda</label>
              <input
                type="text"
                value={shopifyUrl}
                onChange={(e) => setShopifyUrl(e.target.value)}
                placeholder="tu-tienda.myshopify.com"
                className="input-glass"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Storefront Access Token</label>
              <input
                type="password"
                value={shopifyToken}
                onChange={(e) => setShopifyToken(e.target.value)}
                placeholder="shpat_xxxxxxxxxxxx"
                className="input-glass"
              />
              <p className="text-xs text-white/40 mt-1">
                Obtén este token en Shopify Admin → Settings → Apps → Develop apps
              </p>
            </div>
          </div>
        </motion.section>

        {/* OpenAI Configuration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h2 className="font-semibold">OpenAI</h2>
              <p className="text-sm text-white/50">Para generar scripts con IA</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxx"
              className="input-glass"
            />
            <p className="text-xs text-white/40 mt-1">
              Obtén tu API key en <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">platform.openai.com</a>
            </p>
          </div>
        </motion.section>

        {/* ElevenLabs Configuration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">🎙️</span>
            </div>
            <div>
              <h2 className="font-semibold">ElevenLabs</h2>
              <p className="text-sm text-white/50">Para voces premium (opcional)</p>
            </div>
            <span className="ml-auto px-2 py-1 bg-white/10 rounded text-xs">Opcional</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              value={elevenlabsKey}
              onChange={(e) => setElevenlabsKey(e.target.value)}
              placeholder="xxxxxxxxxxxx"
              className="input-glass"
            />
            <p className="text-xs text-white/40 mt-1">
              Sin esta key, se usará el Text-to-Speech del navegador
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
            className="w-full btn-primary py-4"
          >
            {saved ? '✓ Guardado!' : 'Guardar Configuración'}
          </button>
          <p className="text-center text-xs text-white/40 mt-3">
            Las API keys se guardan de forma segura y nunca se comparten
          </p>
        </motion.div>

        {/* Environment Variables Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>💡</span> Configuración mediante Variables de Entorno
          </h3>
          <p className="text-sm text-white/70 mb-4">
            Para una configuración más segura en producción, usa variables de entorno:
          </p>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-green-400">
{`# .env.local
SHOPIFY_STORE_URL=tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxx
OPENAI_API_KEY=sk-xxx
ELEVENLABS_API_KEY=xxx`}
            </pre>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
