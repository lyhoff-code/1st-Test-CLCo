// ============================================
// PIPELINE TYPES — Content Creation Flow
// ============================================

import { ShopifyProduct } from './index'

// ============================================
// 1. TEMPLATE CATALOG TYPES
// ============================================

export type TemplateSource = 'capcut' | 'canva'
export type TemplateCategory = 'reel' | 'vlog-reel' | 'carousel' | 'storytelling' | 'ad' | 'other'

export interface TemplateCutStructure {
  index: number
  name: string
  description: string
  durationHint?: string // e.g., "2-3 sec"
}

export interface FavoriteTemplate {
  id: string
  name: string
  source: TemplateSource
  category: TemplateCategory
  previewImage?: string // uploaded screenshot/preview
  cuts: TemplateCutStructure[]
  totalCuts: number
  hasVoice: boolean
  externalLink: string // direct link to CapCut/Canva template
  notes?: string
  createdAt: string
  updatedAt: string
}

export const TEMPLATE_SOURCES: { value: TemplateSource; label: string; color: string }[] = [
  { value: 'capcut', label: 'CapCut', color: 'turquoise' },
  { value: 'canva', label: 'Canva', color: 'pink' },
]

export const TEMPLATE_CATEGORIES: { value: TemplateCategory; label: string; iconName: string }[] = [
  { value: 'reel', label: 'Reel', iconName: 'Clapperboard' },
  { value: 'vlog-reel', label: 'Vlog Reel', iconName: 'Video' },
  { value: 'carousel', label: 'Carousel', iconName: 'LayoutGrid' },
  { value: 'storytelling', label: 'Storytelling', iconName: 'BookOpen' },
  { value: 'ad', label: 'Ad', iconName: 'Megaphone' },
  { value: 'other', label: 'Other', iconName: 'Grid' },
]

// ============================================
// 2. PIPELINE / CUT GENERATION TYPES
// ============================================

export type VideoStructureType =
  | 'educational'
  | 'demonstrative'
  | 'comparative'
  | 'how-to-use'
  | 'before-after'
  | 'pain-solution'
  | 'storytelling'
  | 'unboxing'
  | 'review'
  | 'testimonial'
  | 'other'

export interface CutPrompts {
  cutIndex: number
  cutName: string
  imagePrompt: string
  animationPrompt: string
  speechText: string
  hasVoice: boolean
}

export interface CutAssets {
  cutIndex: number
  imageFile?: string // uploaded image URL/path
  videoFile?: string // uploaded video URL/path
  audioUrl?: string // generated audio URL (ElevenLabs)
  audioGenerated: boolean
  imageUploaded: boolean
  videoUploaded: boolean
}

export interface PipelineProject {
  id: string
  product: ShopifyProduct | null
  productId?: string
  template: FavoriteTemplate | null
  templateId?: string
  totalCuts: number
  videoStructure: VideoStructureType | null
  videoStructureLabel?: string
  cutPrompts: CutPrompts[]
  cutAssets: CutAssets[]
  status: 'config' | 'prompts' | 'assets' | 'summary' | 'publish'
  createdAt: string
  updatedAt: string
}

export const VIDEO_STRUCTURES: { value: VideoStructureType; label: string; description: string; iconName: string }[] = [
  { value: 'educational', label: 'Educational', description: 'Teach something about the product', iconName: 'GraduationCap' },
  { value: 'demonstrative', label: 'Demonstrative', description: 'Show the product in action', iconName: 'Play' },
  { value: 'comparative', label: 'Comparative', description: 'Compare with alternatives', iconName: 'GitCompare' },
  { value: 'how-to-use', label: 'How to Use', description: 'Step by step usage guide', iconName: 'ListOrdered' },
  { value: 'before-after', label: 'Before & After', description: 'Show the transformation', iconName: 'ArrowRightLeft' },
  { value: 'pain-solution', label: 'Pain → Solution', description: 'Problem and how product solves it', iconName: 'Lightbulb' },
  { value: 'storytelling', label: 'Storytelling', description: 'Tell a story around the product', iconName: 'BookOpen' },
  { value: 'unboxing', label: 'Unboxing', description: 'Unboxing experience', iconName: 'Package' },
  { value: 'review', label: 'Review', description: 'Honest product review', iconName: 'Star' },
  { value: 'testimonial', label: 'Testimonial', description: 'Customer testimonial style', iconName: 'MessageCircle' },
  { value: 'other', label: 'Let AI Decide', description: 'AI will propose the best structure', iconName: 'Sparkles' },
]

// ============================================
// 3. CAPTION SYSTEM TYPES
// ============================================

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'facebook'

export interface PlatformCaption {
  platform: SocialPlatform
  caption: string
  hashtags: string[]
  charLimit: number
  currentLength: number
}

export interface ProductCaptions {
  id: string
  productId: string
  productName: string
  captions: PlatformCaption[]
  createdAt: string
  updatedAt: string
}

export const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string; iconName: string; charLimit: number; hashtagNote: string; color: string }[] = [
  { value: 'instagram', label: 'Instagram', iconName: 'Instagram', charLimit: 2200, hashtagNote: 'Max 30 hashtags', color: 'from-purple-500 to-pink-500' },
  { value: 'tiktok', label: 'TikTok', iconName: 'Music', charLimit: 4000, hashtagNote: 'Max 5-8 hashtags recommended', color: 'from-slate-800 to-slate-600' },
  { value: 'youtube', label: 'YouTube', iconName: 'Youtube', charLimit: 5000, hashtagNote: 'Max 15 hashtags in description', color: 'from-red-500 to-red-600' },
  { value: 'facebook', label: 'Facebook', iconName: 'Facebook', charLimit: 63206, hashtagNote: 'Max 3-5 hashtags recommended', color: 'from-blue-600 to-blue-500' },
]

export const DEFAULT_PLATFORM_CAPTIONS: PlatformCaption[] = [
  { platform: 'instagram', caption: '', hashtags: [], charLimit: 2200, currentLength: 0 },
  { platform: 'tiktok', caption: '', hashtags: [], charLimit: 4000, currentLength: 0 },
  { platform: 'youtube', caption: '', hashtags: [], charLimit: 5000, currentLength: 0 },
  { platform: 'facebook', caption: '', hashtags: [], charLimit: 63206, currentLength: 0 },
]

// ============================================
// 4. VIDEO SPLITTER TYPES
// ============================================

export interface VideoSplitResult {
  index: number
  fileName: string
  startTime: number
  endTime: number
  duration: number
  url: string
  selected: boolean
}

export interface VideoSplitRequest {
  parts: number
  customDurations?: number[] // optional custom duration per part
}

// ============================================
// 5. PUBLISHER TYPES
// ============================================

export interface PublishRequest {
  videoFile: string // uploaded final video
  productId: string
  platforms: SocialPlatform[]
}

export interface PublishResult {
  platform: SocialPlatform
  success: boolean
  postUrl?: string
  error?: string
}

// ============================================
// EXTERNAL TOOL LINKS
// ============================================

export const EXTERNAL_TOOLS = {
  grokImagine: 'https://x.com/i/grok?focus=image',
  openart: 'https://openart.ai/create',
  capcut: 'https://www.capcut.com/editor',
  canva: 'https://www.canva.com/',
  elevenlabs: 'https://elevenlabs.io/app/speech-synthesis',
}
