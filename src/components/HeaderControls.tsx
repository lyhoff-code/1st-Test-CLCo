'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Globe, ChevronDown } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'
import { useLanguage } from '@/lib/LanguageContext'
import { Language } from '@/lib/translations'

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 border border-white/30 dark:border-gray-600/30 transition-all"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <AnimatePresence mode="wait">
        {theme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-databake-text dark:text-gray-200" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 border border-white/30 dark:border-gray-600/30 transition-all"
      >
        <Globe className="w-4 h-4 text-databake-text-light dark:text-gray-400" />
        <span className="text-sm font-medium text-databake-text dark:text-gray-200">{currentLang.flag}</span>
        <ChevronDown className={`w-4 h-4 text-databake-text-light dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-40 rounded-xl glass dark:bg-gray-800/90 shadow-lg border border-white/30 dark:border-gray-600/30 overflow-hidden z-50"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors ${
                    language === lang.code ? 'bg-databake-turquoise/20 dark:bg-databake-turquoise/10' : ''
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium text-databake-text dark:text-gray-200">{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-databake-turquoise" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
