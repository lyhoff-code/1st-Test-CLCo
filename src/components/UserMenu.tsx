'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  LogOut,
  Settings,
  BarChart3,
  ChevronDown,
  LogIn,
} from 'lucide-react'

export function UserMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-700/50 animate-pulse" />
    )
  }

  if (!session) {
    return (
      <Link
        href="/auth/login"
        className="btn-ghost flex items-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    )
  }

  const userInitial = session.user?.name?.[0] || session.user?.email?.[0] || 'U'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-600/50 border border-white/30 dark:border-gray-600/30 transition-all"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="w-8 h-8 rounded-lg object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-databake-turquoise to-databake-pink flex items-center justify-center">
            <span className="text-white font-semibold text-sm uppercase">
              {userInitial}
            </span>
          </div>
        )}
        <span className="hidden md:block text-sm font-medium text-databake-text dark:text-gray-200 max-w-[100px] truncate">
          {session.user?.name || session.user?.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 text-databake-text-light transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass dark:bg-gray-800/90 shadow-lg border border-white/30 dark:border-gray-600/30 overflow-hidden z-50"
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/20 dark:border-gray-700/30">
                <p className="font-medium text-databake-text dark:text-gray-100 truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-sm text-databake-text-light dark:text-gray-400 truncate">
                  {session.user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-databake-turquoise-dark" />
                  <span className="text-sm font-medium text-databake-text dark:text-gray-200">Dashboard</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-databake-text-light dark:text-gray-400" />
                  <span className="text-sm font-medium text-databake-text dark:text-gray-200">Settings</span>
                </Link>
              </div>

              {/* Sign Out */}
              <div className="p-2 border-t border-white/20 dark:border-gray-700/30">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                >
                  <LogOut className="w-5 h-5 text-databake-text-light group-hover:text-red-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-databake-text group-hover:text-red-500 dark:text-gray-200">
                    Sign Out
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
