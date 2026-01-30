'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.'
      case 'Verification':
        return 'The verification link has expired or has already been used.'
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
        return 'There was a problem with the OAuth provider. Please try again.'
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  return (
    <main className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-databake-turquoise via-databake-turquoise-dark to-databake-pink flex items-center justify-center shadow-glass glow-turquoise">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        {/* Error Card */}
        <div className="glass p-8">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-databake-text dark:text-gray-100 mb-2">
            Authentication Error
          </h2>
          <p className="text-databake-text-light dark:text-gray-400 mb-6">
            {getErrorMessage(error)}
          </p>

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 btn-primary px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
