'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Music,
  Play,
  Pause,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Heart,
  Volume2,
  VolumeX,
  Sparkles,
  Filter,
  ChevronDown,
  Check,
  Zap,
  Flame,
  Star
} from 'lucide-react'

interface Track {
  id: string
  title: string
  artist: string
  duration: number
  bpm: number
  genre: string
  mood: string
  audioUrl: string
  coverUrl: string
  trending: boolean
  new: boolean
  uses: number
}

// Mock music data - in production, this would come from an API
const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Viral Energy',
    artist: 'BeatMaker Pro',
    duration: 30,
    bpm: 128,
    genre: 'Electronic',
    mood: 'Energetic',
    audioUrl: '/audio/track1.mp3',
    coverUrl: 'https://picsum.photos/seed/track1/100/100',
    trending: true,
    new: true,
    uses: 45000
  },
  {
    id: '2',
    title: 'Chill Vibes',
    artist: 'Lo-Fi Dreams',
    duration: 45,
    bpm: 85,
    genre: 'Lo-Fi',
    mood: 'Relaxed',
    audioUrl: '/audio/track2.mp3',
    coverUrl: 'https://picsum.photos/seed/track2/100/100',
    trending: true,
    new: false,
    uses: 32000
  },
  {
    id: '3',
    title: 'Boss Mode',
    artist: 'Trap Nation',
    duration: 30,
    bpm: 140,
    genre: 'Trap',
    mood: 'Powerful',
    audioUrl: '/audio/track3.mp3',
    coverUrl: 'https://picsum.photos/seed/track3/100/100',
    trending: false,
    new: true,
    uses: 28000
  },
  {
    id: '4',
    title: 'Summer Feels',
    artist: 'Tropical House',
    duration: 60,
    bpm: 110,
    genre: 'House',
    mood: 'Happy',
    audioUrl: '/audio/track4.mp3',
    coverUrl: 'https://picsum.photos/seed/track4/100/100',
    trending: true,
    new: false,
    uses: 67000
  },
  {
    id: '5',
    title: 'Dramatic Rise',
    artist: 'Cinematic Sounds',
    duration: 30,
    bpm: 90,
    genre: 'Cinematic',
    mood: 'Dramatic',
    audioUrl: '/audio/track5.mp3',
    coverUrl: 'https://picsum.photos/seed/track5/100/100',
    trending: false,
    new: false,
    uses: 18000
  },
  {
    id: '6',
    title: 'Urban Groove',
    artist: 'Street Beats',
    duration: 45,
    bpm: 95,
    genre: 'Hip-Hop',
    mood: 'Cool',
    audioUrl: '/audio/track6.mp3',
    coverUrl: 'https://picsum.photos/seed/track6/100/100',
    trending: true,
    new: true,
    uses: 89000
  },
  {
    id: '7',
    title: 'Motivation Monday',
    artist: 'Inspire Audio',
    duration: 30,
    bpm: 120,
    genre: 'Pop',
    mood: 'Inspirational',
    audioUrl: '/audio/track7.mp3',
    coverUrl: 'https://picsum.photos/seed/track7/100/100',
    trending: false,
    new: false,
    uses: 41000
  },
  {
    id: '8',
    title: 'Tech Future',
    artist: 'Digital Dreams',
    duration: 60,
    bpm: 135,
    genre: 'Electronic',
    mood: 'Futuristic',
    audioUrl: '/audio/track8.mp3',
    coverUrl: 'https://picsum.photos/seed/track8/100/100',
    trending: true,
    new: true,
    uses: 52000
  }
]

const GENRES = ['All', 'Electronic', 'Lo-Fi', 'Trap', 'House', 'Cinematic', 'Hip-Hop', 'Pop']
const MOODS = ['All', 'Energetic', 'Relaxed', 'Powerful', 'Happy', 'Dramatic', 'Cool', 'Inspirational', 'Futuristic']
const DURATIONS = ['All', '15s', '30s', '45s', '60s']

interface MusicLibraryProps {
  onSelectTrack: (track: Track) => void
  selectedTrackId?: string
  compact?: boolean
}

export function MusicLibrary({ onSelectTrack, selectedTrackId, compact = false }: MusicLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedMood, setSelectedMood] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('All')
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'trending' | 'all' | 'favorites'>('trending')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('databake-music-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Filter tracks
  const filteredTracks = MOCK_TRACKS.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre
    const matchesMood = selectedMood === 'All' || track.mood === selectedMood
    const matchesDuration = selectedDuration === 'All' ||
                           track.duration === parseInt(selectedDuration.replace('s', ''))
    const matchesTab = activeTab === 'all' ? true :
                      activeTab === 'trending' ? track.trending :
                      favorites.includes(track.id)

    return matchesSearch && matchesGenre && matchesMood && matchesDuration && matchesTab
  })

  const togglePlay = (track: Track) => {
    if (playingTrackId === track.id) {
      audioRef.current?.pause()
      setPlayingTrackId(null)
    } else {
      // In production, you'd actually play the audio
      // For demo, we'll just toggle the state
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setPlayingTrackId(track.id)
      // Simulate audio playing for 3 seconds then stop
      setTimeout(() => {
        if (playingTrackId === track.id) {
          setPlayingTrackId(null)
        }
      }, 3000)
    }
  }

  const toggleFavorite = (trackId: string) => {
    const newFavorites = favorites.includes(trackId)
      ? favorites.filter(id => id !== trackId)
      : [...favorites, trackId]
    setFavorites(newFavorites)
    localStorage.setItem('databake-music-favorites', JSON.stringify(newFavorites))
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatUses = (uses: number) => {
    if (uses >= 1000000) return `${(uses / 1000000).toFixed(1)}M`
    if (uses >= 1000) return `${(uses / 1000).toFixed(0)}K`
    return uses.toString()
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search music..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm focus:outline-none focus:ring-2 focus:ring-databake-turquoise/50"
            />
          </div>
        </div>

        <div className="max-h-[200px] overflow-y-auto space-y-2">
          {filteredTracks.slice(0, 5).map(track => (
            <motion.div
              key={track.id}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                selectedTrackId === track.id
                  ? 'bg-databake-turquoise/20 border border-databake-turquoise/50'
                  : 'bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
              onClick={() => onSelectTrack(track)}
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay(track); }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                >
                  {playingTrackId === track.id ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{track.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{track.artist}</p>
              </div>
              {track.trending && (
                <Flame className="w-4 h-4 text-orange-500" />
              )}
              {selectedTrackId === track.id && (
                <Check className="w-4 h-4 text-databake-turquoise-dark" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Music Library</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Royalty-free trending sounds</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
            {MOCK_TRACKS.length} tracks
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'all', label: 'All Music', icon: Music },
          { id: 'favorites', label: 'Favorites', icon: Heart }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-databake-turquoise text-databake-text'
                : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'favorites' && favorites.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-databake-pink text-white text-xs flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm focus:outline-none focus:ring-2 focus:ring-databake-turquoise/50"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
            showFilters
              ? 'bg-databake-turquoise text-databake-text'
              : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(genre => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedGenre === genre
                          ? 'bg-databake-turquoise text-databake-text'
                          : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white/70'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(mood => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedMood === mood
                          ? 'bg-databake-pink text-white'
                          : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white/70'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 block">Duration</label>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map(duration => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedDuration === duration
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-white/70'
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-8">
            <Music className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No tracks found</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredTracks.map(track => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all group ${
                selectedTrackId === track.id
                  ? 'bg-databake-turquoise/20 border-2 border-databake-turquoise/50'
                  : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/50 border-2 border-transparent'
              }`}
              onClick={() => onSelectTrack(track)}
            >
              {/* Cover & Play */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay(track); }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {playingTrackId === track.id ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>
                {playingTrackId === track.id && (
                  <div className="absolute bottom-1 left-1 right-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: 'linear' }}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800 dark:text-white truncate">{track.title}</p>
                  {track.trending && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Trending
                    </span>
                  )}
                  {track.new && (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> New
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{track.artist}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDuration(track.duration)}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {track.bpm} BPM
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {track.genre}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {formatUses(track.uses)} uses
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                  className={`p-2 rounded-lg transition-all ${
                    favorites.includes(track.id)
                      ? 'text-red-500 bg-red-100 dark:bg-red-900/30'
                      : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(track.id) ? 'fill-current' : ''}`} />
                </button>
                {selectedTrackId === track.id ? (
                  <div className="w-8 h-8 rounded-full bg-databake-turquoise flex items-center justify-center">
                    <Check className="w-5 h-5 text-databake-text" />
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectTrack(track); }}
                    className="p-2 rounded-lg text-slate-400 hover:text-databake-turquoise-dark hover:bg-databake-turquoise/20 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} />
    </div>
  )
}

export type { Track }
