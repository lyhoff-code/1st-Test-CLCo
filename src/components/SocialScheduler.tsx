'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Send,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Plus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  Copy,
  Eye,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Link2,
  Unlink
} from 'lucide-react'

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

interface SocialAccount {
  id: string
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter'
  username: string
  profileImage: string
  connected: boolean
  followers: number
}

interface ScheduledPost {
  id: string
  contentId: string
  contentTitle: string
  thumbnailUrl: string
  platforms: string[]
  scheduledTime: Date
  status: 'scheduled' | 'posted' | 'failed' | 'draft'
  caption?: string
  hashtags?: string[]
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 via-pink-500 to-orange-500', textColor: 'text-pink-500' },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, color: 'from-black to-gray-800', textColor: 'text-black dark:text-white' },
  { id: 'youtube', name: 'YouTube Shorts', icon: Youtube, color: 'from-red-500 to-red-600', textColor: 'text-red-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-500' },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'from-gray-800 to-black', textColor: 'text-gray-800 dark:text-white' }
]

// Mock data
const MOCK_ACCOUNTS: SocialAccount[] = [
  { id: '1', platform: 'instagram', username: '@mybrand', profileImage: 'https://picsum.photos/seed/ig/100/100', connected: true, followers: 25400 },
  { id: '2', platform: 'tiktok', username: '@mybrand', profileImage: 'https://picsum.photos/seed/tt/100/100', connected: true, followers: 89000 },
  { id: '3', platform: 'youtube', username: 'My Brand', profileImage: 'https://picsum.photos/seed/yt/100/100', connected: false, followers: 12300 },
  { id: '4', platform: 'facebook', username: 'My Brand Page', profileImage: 'https://picsum.photos/seed/fb/100/100', connected: true, followers: 45600 },
  { id: '5', platform: 'twitter', username: '@mybrand', profileImage: 'https://picsum.photos/seed/tw/100/100', connected: false, followers: 8900 }
]

const MOCK_SCHEDULED: ScheduledPost[] = [
  {
    id: '1',
    contentId: 'content1',
    contentTitle: 'Summer Sale Reel',
    thumbnailUrl: 'https://picsum.photos/seed/post1/200/350',
    platforms: ['instagram', 'tiktok'],
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'scheduled',
    caption: 'Summer vibes are here! 🌴☀️',
    hashtags: ['#summer', '#sale', '#fashion']
  },
  {
    id: '2',
    contentId: 'content2',
    contentTitle: 'Product Demo',
    thumbnailUrl: 'https://picsum.photos/seed/post2/200/350',
    platforms: ['youtube', 'facebook'],
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'scheduled',
    caption: 'Check out our new product!'
  },
  {
    id: '3',
    contentId: 'content3',
    contentTitle: 'Behind the Scenes',
    thumbnailUrl: 'https://picsum.photos/seed/post3/200/350',
    platforms: ['instagram'],
    scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'posted'
  }
]

interface SocialSchedulerProps {
  contentId?: string
  contentTitle?: string
  thumbnailUrl?: string
  onSchedule?: (post: ScheduledPost) => void
}

export function SocialScheduler({ contentId, contentTitle, thumbnailUrl, onSchedule }: SocialSchedulerProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>(MOCK_ACCOUNTS)
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(MOCK_SCHEDULED)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState('12:00')
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isPosting, setIsPosting] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'schedule' | 'queue' | 'accounts'>('schedule')

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const togglePlatform = (platformId: string) => {
    const account = accounts.find(a => a.platform === platformId)
    if (!account?.connected) return

    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const toggleAccountConnection = (accountId: string) => {
    setAccounts(prev =>
      prev.map(a =>
        a.id === accountId ? { ...a, connected: !a.connected } : a
      )
    )
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: Date[] = []

    // Add padding for days before first of month
    const startPadding = firstDay.getDay()
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push(d)
    }

    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const hasPostsOnDay = (date: Date) => {
    return scheduledPosts.some(p =>
      new Date(p.scheduledTime).toDateString() === date.toDateString()
    )
  }

  const handleSchedulePost = async () => {
    if (selectedPlatforms.length === 0) return

    setIsPosting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    const [hours, minutes] = selectedTime.split(':').map(Number)
    const scheduledTime = new Date(selectedDate)
    scheduledTime.setHours(hours, minutes, 0, 0)

    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      contentId: contentId || 'new',
      contentTitle: contentTitle || 'New Content',
      thumbnailUrl: thumbnailUrl || 'https://picsum.photos/seed/new/200/350',
      platforms: selectedPlatforms,
      scheduledTime,
      status: 'scheduled',
      caption,
      hashtags: hashtags.split(' ').filter(h => h.startsWith('#'))
    }

    setScheduledPosts(prev => [...prev, newPost])
    setPostSuccess(true)
    setIsPosting(false)

    if (onSchedule) {
      onSchedule(newPost)
    }

    // Reset after success
    setTimeout(() => {
      setPostSuccess(false)
      setSelectedPlatforms([])
      setCaption('')
      setHashtags('')
    }, 2000)
  }

  const handlePostNow = async () => {
    if (selectedPlatforms.length === 0) return

    setIsPosting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      contentId: contentId || 'new',
      contentTitle: contentTitle || 'New Content',
      thumbnailUrl: thumbnailUrl || 'https://picsum.photos/seed/new/200/350',
      platforms: selectedPlatforms,
      scheduledTime: new Date(),
      status: 'posted',
      caption,
      hashtags: hashtags.split(' ').filter(h => h.startsWith('#'))
    }

    setScheduledPosts(prev => [...prev, newPost])
    setPostSuccess(true)
    setIsPosting(false)

    setTimeout(() => {
      setPostSuccess(false)
      setSelectedPlatforms([])
      setCaption('')
      setHashtags('')
    }, 2000)
  }

  const deleteScheduledPost = (postId: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== postId))
  }

  const getStatusColor = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      case 'posted': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      case 'draft': return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Auto-Post & Schedule</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Post directly to social media</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'schedule', label: 'Schedule Post', icon: Calendar },
          { id: 'queue', label: 'Queue', icon: Clock, count: scheduledPosts.filter(p => p.status === 'scheduled').length },
          { id: 'accounts', label: 'Accounts', icon: Link2 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-databake-turquoise text-databake-text'
                : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="w-5 h-5 rounded-full bg-databake-pink text-white text-xs flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Platform Selection */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Select Platforms
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {PLATFORMS.map(platform => {
                const account = accounts.find(a => a.platform === platform.id)
                const isSelected = selectedPlatforms.includes(platform.id)
                const isConnected = account?.connected

                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    disabled={!isConnected}
                    className={`relative p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r ' + platform.color + ' text-white shadow-lg'
                        : isConnected
                        ? 'bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/50'
                        : 'bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <platform.icon className={`w-6 h-6 mx-auto mb-1 ${isSelected ? 'text-white' : platform.textColor}`} />
                    <p className={`text-xs font-medium text-center ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                      {platform.name}
                    </p>
                    {!isConnected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                        <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded">
                          Not connected
                        </span>
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow">
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your caption..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-databake-turquoise/50 resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">{caption.length}/2200</span>
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Hashtags
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#trending #viral #fyp"
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-databake-turquoise/50"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Date
              </label>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-left flex items-center justify-between"
              >
                <span className="text-slate-800 dark:text-slate-100">
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <Calendar className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-databake-turquoise/50"
              />
            </div>
          </div>

          {/* Calendar Dropdown */}
          <AnimatePresence>
            {showCalendar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-white/30 dark:border-slate-700/30 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-xs font-medium text-slate-500 py-2">{day}</div>
                    ))}
                    {getDaysInMonth(currentMonth).map((date, i) => {
                      const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                      const isSelected = date.toDateString() === selectedDate.toDateString()
                      const isToday = date.toDateString() === new Date().toDateString()
                      const hasPosts = hasPostsOnDay(date)

                      return (
                        <button
                          key={i}
                          onClick={() => { setSelectedDate(date); setShowCalendar(false); }}
                          className={`relative py-2 rounded-lg text-sm transition-all ${
                            isSelected
                              ? 'bg-databake-turquoise text-databake-text font-bold'
                              : isToday
                              ? 'bg-databake-pink/20 text-databake-pink-dark font-semibold'
                              : isCurrentMonth
                              ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          {date.getDate()}
                          {hasPosts && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-databake-pink" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSchedulePost}
              disabled={selectedPlatforms.length === 0 || isPosting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-databake-turquoise to-databake-turquoise-dark text-databake-text font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPosting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : postSuccess ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Calendar className="w-5 h-5" />
              )}
              {postSuccess ? 'Scheduled!' : 'Schedule Post'}
            </button>
            <button
              onClick={handlePostNow}
              disabled={selectedPlatforms.length === 0 || isPosting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-databake-pink to-databake-pink-dark text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Post Now
            </button>
          </div>
        </div>
      )}

      {/* Queue Tab */}
      {activeTab === 'queue' && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {scheduledPosts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No scheduled posts</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Schedule your first post above</p>
            </div>
          ) : (
            scheduledPosts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
              >
                <img
                  src={post.thumbnailUrl}
                  alt={post.contentTitle}
                  className="w-16 h-24 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white truncate">{post.contentTitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {post.platforms.map(p => {
                      const platform = PLATFORMS.find(pl => pl.id === p)
                      if (!platform) return null
                      return (
                        <platform.icon key={p} className={`w-4 h-4 ${platform.textColor}`} />
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(post.scheduledTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                  {post.status === 'scheduled' && (
                    <button
                      onClick={() => deleteScheduledPost(post.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-3">
          {accounts.map(account => {
            const platform = PLATFORMS.find(p => p.id === account.platform)
            if (!platform) return null

            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
              >
                <div className="relative">
                  <img
                    src={account.profileImage}
                    alt={account.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r ${platform.color}`}>
                    <platform.icon className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white">{account.username}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {platform.name} • {formatFollowers(account.followers)} followers
                  </p>
                </div>
                <button
                  onClick={() => toggleAccountConnection(account.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    account.connected
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400'
                      : 'bg-databake-turquoise text-databake-text hover:shadow-lg'
                  }`}
                >
                  {account.connected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Connected
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Connect
                    </>
                  )}
                </button>
              </motion.div>
            )
          })}

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">API Integration Required</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Connect your social accounts via official APIs (Meta Business Suite, TikTok for Business, etc.) in production.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
