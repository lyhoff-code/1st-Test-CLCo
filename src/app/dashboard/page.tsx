'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Video,
  Image,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Zap,
  Users,
} from 'lucide-react'

// Mock analytics data
const MOCK_STATS = {
  totalContent: 24,
  totalViews: 15420,
  totalEngagement: 3250,
  avgEngagementRate: 21.1,
  weeklyGrowth: 12.5,
  topPlatform: 'Instagram',
}

const MOCK_CONTENT_PERFORMANCE = [
  { id: 1, title: 'Premium Headphones Reel', type: 'reel', views: 4520, likes: 890, comments: 124, shares: 45, date: '2024-01-28' },
  { id: 2, title: 'Skincare Set Story', type: 'story', views: 2890, likes: 456, comments: 67, shares: 23, date: '2024-01-27' },
  { id: 3, title: 'Fitness Watch Post', type: 'post', views: 3100, likes: 678, comments: 89, shares: 34, date: '2024-01-26' },
  { id: 4, title: 'Leather Wallet Storytelling', type: 'storytelling', views: 2450, likes: 534, comments: 78, shares: 29, date: '2024-01-25' },
  { id: 5, title: 'Bluetooth Speaker Reel', type: 'reel', views: 2460, likes: 512, comments: 56, shares: 19, date: '2024-01-24' },
]

const MOCK_WEEKLY_DATA = [
  { day: 'Mon', views: 1200, engagement: 240 },
  { day: 'Tue', views: 1800, engagement: 380 },
  { day: 'Wed', views: 2400, engagement: 520 },
  { day: 'Thu', views: 2100, engagement: 450 },
  { day: 'Fri', views: 3200, engagement: 680 },
  { day: 'Sat', views: 2800, engagement: 590 },
  { day: 'Sun', views: 1920, engagement: 390 },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d')

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <main className="min-h-screen aurora-bg flex items-center justify-center">
        <div className="w-10 h-10 rounded-full spinner" />
      </main>
    )
  }

  if (!session) {
    return null
  }

  const maxViews = Math.max(...MOCK_WEEKLY_DATA.map(d => d.views))

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
                <ArrowLeft className="w-5 h-5 text-tada-text dark:text-gray-200" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-tada-turquoise via-tada-turquoise-dark to-tada-pink flex items-center justify-center shadow-glass glow-turquoise">
                  <BarChart3 className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-tada-text dark:text-gray-100">Analytics Dashboard</h1>
                  <p className="text-xs text-tada-text-light dark:text-gray-400">Track your content performance</p>
                </div>
              </div>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-tada-turquoise text-tada-text'
                      : 'bg-white/50 dark:bg-gray-700/50 text-tada-text-light dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-600/50'
                  }`}
                >
                  {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-tada-text dark:text-gray-100">
            Welcome back, {session.user?.name?.split(' ')[0] || 'Creator'}!
          </h2>
          <p className="text-tada-text-light dark:text-gray-400">
            Here's how your content is performing
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Content', value: MOCK_STATS.totalContent, icon: Video, color: 'turquoise', change: '+3' },
            { label: 'Total Views', value: MOCK_STATS.totalViews.toLocaleString(), icon: Eye, color: 'pink', change: '+12.5%' },
            { label: 'Engagement', value: MOCK_STATS.totalEngagement.toLocaleString(), icon: Heart, color: 'turquoise', change: '+8.2%' },
            { label: 'Avg. Rate', value: `${MOCK_STATS.avgEngagementRate}%`, icon: Target, color: 'pink', change: '+2.1%' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`icon-${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-tada-text dark:text-gray-100">{stat.value}</p>
              <p className="text-sm text-tada-text-light dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass p-6"
          >
            <h3 className="font-semibold text-tada-text dark:text-gray-100 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-tada-turquoise-dark" />
              Weekly Performance
            </h3>

            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-48">
              {MOCK_WEEKLY_DATA.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-tada-turquoise to-tada-turquoise-dark transition-all duration-500"
                      style={{ height: `${(day.views / maxViews) * 140}px` }}
                    />
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-tada-pink to-tada-pink-dark opacity-60"
                      style={{ height: `${(day.engagement / maxViews) * 140}px` }}
                    />
                  </div>
                  <span className="text-xs text-tada-text-light dark:text-gray-400">{day.day}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-r from-tada-turquoise to-tada-turquoise-dark" />
                <span className="text-xs text-tada-text-light dark:text-gray-400">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-r from-tada-pink to-tada-pink-dark" />
                <span className="text-xs text-tada-text-light dark:text-gray-400">Engagement</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6"
          >
            <h3 className="font-semibold text-tada-text dark:text-gray-100 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-tada-pink-dark" />
              Quick Insights
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-tada-turquoise/20 to-tada-turquoise/10 dark:from-tada-turquoise/10 dark:to-tada-turquoise/5">
                <p className="text-sm font-medium text-tada-text dark:text-gray-200">Best Performing Day</p>
                <p className="text-xl font-bold text-tada-turquoise-dark">Friday</p>
                <p className="text-xs text-tada-text-light dark:text-gray-400">3,200 views average</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-tada-pink/20 to-tada-pink/10 dark:from-tada-pink/10 dark:to-tada-pink/5">
                <p className="text-sm font-medium text-tada-text dark:text-gray-200">Top Platform</p>
                <p className="text-xl font-bold text-tada-pink-dark">Instagram</p>
                <p className="text-xs text-tada-text-light dark:text-gray-400">68% of total engagement</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30">
                <p className="text-sm font-medium text-tada-text dark:text-gray-200">Content Type</p>
                <p className="text-xl font-bold text-tada-text dark:text-gray-100">Reels</p>
                <p className="text-xs text-tada-text-light dark:text-gray-400">Best performing format</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Content Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass p-6"
        >
          <h3 className="font-semibold text-tada-text dark:text-gray-100 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-tada-turquoise-dark" />
            Recent Content Performance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 dark:border-gray-700/30">
                  <th className="text-left py-3 px-4 text-sm font-medium text-tada-text-light dark:text-gray-400">Content</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-tada-text-light dark:text-gray-400">Type</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-tada-text-light dark:text-gray-400">Views</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-tada-text-light dark:text-gray-400">Likes</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-tada-text-light dark:text-gray-400">Comments</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-tada-text-light dark:text-gray-400">Shares</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-tada-text-light dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CONTENT_PERFORMANCE.map((content) => (
                  <tr key={content.id} className="border-b border-white/10 dark:border-gray-700/20 hover:bg-white/30 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-tada-text dark:text-gray-200">{content.title}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        content.type === 'reel' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                        content.type === 'story' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        content.type === 'post' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                      }`}>
                        {content.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-tada-text dark:text-gray-200">
                        <Eye className="w-4 h-4 text-tada-text-light" />
                        {content.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-tada-text dark:text-gray-200">
                        <Heart className="w-4 h-4 text-tada-pink" />
                        {content.likes}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-tada-text dark:text-gray-200">
                        <MessageCircle className="w-4 h-4 text-tada-turquoise-dark" />
                        {content.comments}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-tada-text dark:text-gray-200">
                        <Share2 className="w-4 h-4 text-tada-text-light" />
                        {content.shares}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-tada-text-light dark:text-gray-400">
                      {new Date(content.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 glass p-6"
        >
          <h3 className="font-semibold text-tada-text dark:text-gray-100 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-tada-pink-dark" />
            AI Recommendations
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800/30">
              <p className="font-medium text-purple-700 dark:text-purple-300 mb-2">Post More Reels</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Your reels get 2.3x more engagement than other formats
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">Best Time to Post</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Try posting between 6-8 PM for maximum reach
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800/30">
              <p className="font-medium text-green-700 dark:text-green-300 mb-2">Trending Hashtags</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Use #TechReview and #Gadgets for more visibility
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
