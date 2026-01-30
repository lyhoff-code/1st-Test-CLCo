'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Play,
  Clock,
  Calendar,
  ArrowUp,
  ArrowDown,
  Instagram,
  Youtube,
  Facebook,
  Sparkles,
  Target,
  Zap,
  Award
} from 'lucide-react'

// TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

interface MetricData {
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
}

interface ContentPerformance {
  id: string
  title: string
  thumbnail: string
  platform: string
  views: number
  likes: number
  comments: number
  shares: number
  engagement: number
  posted: Date
}

interface PlatformStats {
  platform: string
  followers: number
  followersChange: number
  posts: number
  avgEngagement: number
  reach: number
}

// Mock analytics data
const MOCK_METRICS = {
  totalViews: { value: 1245000, change: 23.5, changeType: 'increase' as const },
  totalEngagement: { value: 89400, change: 12.3, changeType: 'increase' as const },
  totalFollowers: { value: 156000, change: 8.7, changeType: 'increase' as const },
  avgWatchTime: { value: 45, change: -2.1, changeType: 'decrease' as const }
}

const MOCK_CONTENT: ContentPerformance[] = [
  {
    id: '1',
    title: 'Summer Sale Announcement',
    thumbnail: 'https://picsum.photos/seed/c1/200/350',
    platform: 'instagram',
    views: 456000,
    likes: 23400,
    comments: 1200,
    shares: 890,
    engagement: 5.6,
    posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Product Tutorial',
    thumbnail: 'https://picsum.photos/seed/c2/200/350',
    platform: 'tiktok',
    views: 892000,
    likes: 67000,
    comments: 4500,
    shares: 12300,
    engagement: 9.4,
    posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Behind the Scenes',
    thumbnail: 'https://picsum.photos/seed/c3/200/350',
    platform: 'youtube',
    views: 123000,
    likes: 8900,
    comments: 670,
    shares: 234,
    engagement: 8.0,
    posted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    title: 'Customer Story',
    thumbnail: 'https://picsum.photos/seed/c4/200/350',
    platform: 'facebook',
    views: 78000,
    likes: 4500,
    comments: 890,
    shares: 567,
    engagement: 7.6,
    posted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
]

const MOCK_PLATFORM_STATS: PlatformStats[] = [
  { platform: 'instagram', followers: 45600, followersChange: 1234, posts: 23, avgEngagement: 4.5, reach: 234000 },
  { platform: 'tiktok', followers: 89000, followersChange: 5670, posts: 45, avgEngagement: 8.2, reach: 1200000 },
  { platform: 'youtube', followers: 12300, followersChange: 456, posts: 12, avgEngagement: 6.1, reach: 156000 },
  { platform: 'facebook', followers: 9100, followersChange: -120, posts: 18, avgEngagement: 3.2, reach: 89000 }
]

const BEST_TIMES = [
  { day: 'Monday', times: ['9:00 AM', '12:00 PM', '7:00 PM'] },
  { day: 'Tuesday', times: ['10:00 AM', '2:00 PM', '8:00 PM'] },
  { day: 'Wednesday', times: ['9:00 AM', '1:00 PM', '6:00 PM'] },
  { day: 'Thursday', times: ['11:00 AM', '3:00 PM', '9:00 PM'] },
  { day: 'Friday', times: ['10:00 AM', '4:00 PM', '8:00 PM'] },
  { day: 'Saturday', times: ['11:00 AM', '3:00 PM', '7:00 PM'] },
  { day: 'Sunday', times: ['12:00 PM', '5:00 PM', '8:00 PM'] }
]

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 via-pink-500 to-orange-500' },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, color: 'from-black to-gray-800' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-600' }
]

interface AnalyticsDashboardProps {
  compact?: boolean
}

export function AnalyticsDashboard({ compact = false }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedPlatform, setSelectedPlatform] = useState<string | 'all'>('all')

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getPlatformIcon = (platformId: string) => {
    const platform = PLATFORMS.find(p => p.id === platformId)
    return platform?.icon || Instagram
  }

  const filteredContent = selectedPlatform === 'all'
    ? MOCK_CONTENT
    : MOCK_CONTENT.filter(c => c.platform === selectedPlatform)

  const filteredStats = selectedPlatform === 'all'
    ? MOCK_PLATFORM_STATS
    : MOCK_PLATFORM_STATS.filter(s => s.platform === selectedPlatform)

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Views', value: MOCK_METRICS.totalViews, icon: Eye },
            { label: 'Engagement', value: MOCK_METRICS.totalEngagement, icon: Heart }
          ].map(stat => (
            <div key={stat.label} className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-databake-turquoise-dark" />
                <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white">
                {formatNumber(stat.value.value)}
              </p>
              <div className={`flex items-center gap-1 text-xs ${
                stat.value.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.value.changeType === 'increase' ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(stat.value.change)}%
              </div>
            </div>
          ))}
        </div>

        {/* Top Content */}
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Top Performing</p>
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/30 dark:bg-slate-800/30">
            <img
              src={MOCK_CONTENT[1].thumbnail}
              alt={MOCK_CONTENT[1].title}
              className="w-12 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                {MOCK_CONTENT[1].title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatNumber(MOCK_CONTENT[1].views)} views • {MOCK_CONTENT[1].engagement}% engagement
              </p>
            </div>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Analytics Dashboard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track your content performance</p>
          </div>
        </div>

        {/* Time Range */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-databake-turquoise text-databake-text'
                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            selectedPlatform === 'all'
              ? 'bg-databake-turquoise text-databake-text'
              : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
          }`}
        >
          All Platforms
        </button>
        {PLATFORMS.map(platform => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedPlatform === platform.id
                ? `bg-gradient-to-r ${platform.color} text-white`
                : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
            }`}
          >
            <platform.icon className="w-4 h-4" />
            {platform.name}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: MOCK_METRICS.totalViews, icon: Eye, color: 'from-blue-500 to-cyan-500' },
          { label: 'Engagement', value: MOCK_METRICS.totalEngagement, icon: Heart, color: 'from-pink-500 to-rose-500' },
          { label: 'Followers', value: MOCK_METRICS.totalFollowers, icon: Users, color: 'from-purple-500 to-indigo-500' },
          { label: 'Avg Watch Time', value: MOCK_METRICS.avgWatchTime, icon: Clock, color: 'from-orange-500 to-yellow-500', suffix: 's' }
        ].map(metric => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric.value.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
              }`}>
                {metric.value.changeType === 'increase' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(metric.value.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {formatNumber(metric.value.value)}{metric.suffix || ''}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Platform Stats */}
      <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30">
        <h4 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-databake-turquoise-dark" />
          Platform Performance
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStats.map(stat => {
            const platform = PLATFORMS.find(p => p.id === stat.platform)
            if (!platform) return null

            return (
              <div
                key={stat.platform}
                className="p-4 rounded-xl bg-white/30 dark:bg-slate-700/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                    <platform.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-800 dark:text-white">{platform.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Followers</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">
                        {formatNumber(stat.followers)}
                      </span>
                      <span className={`text-xs ${stat.followersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.followersChange >= 0 ? '+' : ''}{formatNumber(stat.followersChange)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Avg Engagement</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{stat.avgEngagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Reach</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{formatNumber(stat.reach)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30">
        <h4 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Top Performing Content
        </h4>
        <div className="space-y-3">
          {filteredContent.map((content, index) => {
            const PlatformIcon = getPlatformIcon(content.platform)
            const platform = PLATFORMS.find(p => p.id === content.platform)

            return (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/30 dark:bg-slate-700/30 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 font-bold text-slate-600 dark:text-slate-300">
                  {index + 1}
                </div>
                <div className="relative w-16 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-lg bg-gradient-to-r ${platform?.color} flex items-center justify-center`}>
                    <PlatformIcon className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white truncate">{content.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Posted {Math.round((Date.now() - content.posted.getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{formatNumber(content.views)}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" /> Views
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{formatNumber(content.likes)}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3" /> Likes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{formatNumber(content.comments)}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                      <MessageCircle className="w-3 h-3" /> Comments
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-500">{content.engagement}%</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3" /> Rate
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Best Times to Post */}
      <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30">
        <h4 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-databake-pink-dark" />
          Best Times to Post
          <span className="ml-auto text-xs font-normal text-slate-500 dark:text-slate-400">
            Based on your audience activity
          </span>
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {BEST_TIMES.map(day => (
            <div key={day.day} className="text-center">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
                {day.day.slice(0, 3)}
              </p>
              <div className="space-y-1">
                {day.times.map((time, i) => (
                  <div
                    key={time}
                    className={`px-2 py-1 rounded-lg text-[10px] font-medium ${
                      i === 0
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Best time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Good times</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-databake-turquoise/20 to-databake-pink/20 border border-databake-turquoise/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-databake-turquoise to-databake-pink flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">AI Insights</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Your TikTok content has <strong>45% higher engagement</strong> than industry average</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">!</span>
                <span>Consider posting more on <strong>Wednesdays at 6 PM</strong> - your audience is most active then</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span>
                <span>Tutorial-style content performs <strong>2.3x better</strong> than product showcases</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
