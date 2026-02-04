// Content Creation Types for DataBake Platform

// ==================== IMAGE EDITOR TYPES ====================

export interface ImageProject {
  id: string
  name: string
  width: number
  height: number
  backgroundColor: string | GradientBackground
  backgroundImage?: string
  layers: ImageLayer[]
  createdAt: string
  updatedAt: string
}

export interface GradientBackground {
  type: 'linear' | 'radial'
  colors: string[]
  angle?: number
}

export type ImageLayerType = 'image' | 'text' | 'shape' | 'sticker'

export interface ImageLayer {
  id: string
  type: ImageLayerType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  visible: boolean
  locked: boolean
  // Type-specific properties
  src?: string // for image
  text?: string // for text
  fontFamily?: string
  fontSize?: number
  fontWeight?: string
  fontColor?: string
  textAlign?: 'left' | 'center' | 'right'
  shadow?: ShadowConfig
  shape?: 'rectangle' | 'circle' | 'triangle'
  fillColor?: string
  strokeColor?: string
  strokeWidth?: number
}

export interface ShadowConfig {
  enabled: boolean
  color: string
  blur: number
  offsetX: number
  offsetY: number
}

// Export presets for different platforms
export const IMAGE_EXPORT_PRESETS = [
  { id: 'instagram-post', name: 'Instagram Post', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'tiktok', name: 'TikTok', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630, ratio: '1.91:1' },
  { id: 'twitter', name: 'Twitter/X', width: 1200, height: 675, ratio: '16:9' },
  { id: 'pinterest', name: 'Pinterest', width: 1000, height: 1500, ratio: '2:3' },
  { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, ratio: '16:9' },
]

// ==================== VIDEO SCENE TYPES ====================

export interface VideoScene {
  id: string
  order: number
  // Content
  imageUrl: string | null
  imageFile?: File
  videoUrl: string | null  // Video generado en tool externo
  videoFile?: File
  script: string
  speechUrl?: string
  // Timing
  duration: number
  cutType: 'hard' | 'fade' | 'slide' | 'zoom' | 'none'
  // Video generation
  videoPrompts: VideoPromptSet
  motionType: MotionType
  // Status
  status: 'pending' | 'image_ready' | 'video_ready' | 'complete'
}

export type MotionType =
  | 'zoom_in'
  | 'zoom_out'
  | 'pan_left'
  | 'pan_right'
  | 'pan_up'
  | 'pan_down'
  | 'rotate'
  | 'static'
  | 'ken_burns'
  | 'pulse'
  | 'float'

export interface VideoPromptSet {
  grok: string
  openart: string
  pika: string
  luma: string
  kling: string
  general: string
}

// ==================== VIDEO PROJECT TYPES ====================

export interface VideoProject {
  id: string
  name: string
  type: 'video' | 'story' | 'ad' | 'reel'
  productId?: string
  productName?: string
  productImage?: string
  aspectRatio: '9:16' | '1:1' | '16:9' | '4:5'
  scenes: VideoScene[]
  music?: {
    id: string
    title: string
    artist: string
    url?: string
  }
  captionStyle?: string
  totalDuration: number
  status: 'draft' | 'generating' | 'editing' | 'ready' | 'exported'
  createdAt: string
  updatedAt: string
}

// ==================== STORY/REEL TYPES ====================

export interface StoryTemplate {
  id: string
  name: string
  category: 'trending' | 'minimal' | 'bold' | 'elegant' | 'fun' | 'professional'
  thumbnail: string
  duration: number
  elements: StoryElement[]
  animations: AnimationConfig[]
  backgroundColor: string | GradientBackground
  music?: string
}

export interface StoryElement {
  id: string
  type: 'text' | 'image' | 'sticker' | 'shape' | 'video'
  x: number
  y: number
  width: number
  height: number
  content: string // text content or image URL
  style: ElementStyle
  animation?: AnimationConfig
  enterTime: number // when element appears (ms)
  exitTime?: number // when element disappears (ms)
}

export interface ElementStyle {
  fontFamily?: string
  fontSize?: number
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderRadius?: number
  shadow?: ShadowConfig
  filter?: string
}

export interface AnimationConfig {
  type: 'fadeIn' | 'fadeOut' | 'slideIn' | 'slideOut' | 'scaleIn' | 'scaleOut' | 'bounce' | 'shake' | 'typewriter' | 'glow'
  direction?: 'left' | 'right' | 'up' | 'down'
  duration: number
  delay: number
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce'
}

// ==================== AD GENERATOR TYPES ====================

export interface AdProject {
  id: string
  name: string
  platform: 'amazon' | 'facebook' | 'google' | 'tiktok' | 'instagram'
  product: {
    name: string
    description: string
    price: string
    imageUrl: string
    features: string[]
    badges: string[]
  }
  scenes: AdScene[]
  style: AdStyle
  music?: string
  voiceover?: string
  duration: number
  status: 'draft' | 'ready' | 'exported'
  createdAt: string
}

export interface AdScene {
  id: string
  type: 'intro' | 'product' | 'feature' | 'benefit' | 'price' | 'cta'
  duration: number
  // Visual
  backgroundColor: string
  productImage?: string
  animation: ProductAnimation
  // Text
  headline?: string
  subheadline?: string
  badge?: string
  // Transition
  transition: 'fade' | 'slide' | 'zoom' | 'wipe'
}

export type ProductAnimation =
  | 'float'
  | 'rotate'
  | 'zoom'
  | 'bounce'
  | 'spin'
  | 'glow'
  | 'pulse'
  | 'slide_in'

export interface AdStyle {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  badgeStyle: 'rounded' | 'square' | 'pill' | 'ribbon'
  priceStyle: 'strike' | 'highlight' | 'badge'
}

// ==================== PRODUCTION KIT TYPES ====================

export interface ProductionKit {
  id: string
  projectId: string
  projectName: string
  createdAt: string
  scenes: ProductionScene[]
  timeline: TimelineConfig
  exportGuide: ExportGuide
}

export interface ProductionScene {
  sceneNumber: number
  sceneName: string
  // Files
  imageFile: string
  videoFile?: string
  audioFile?: string
  // Info
  script: string
  duration: number
  cutType: string
  motionType: MotionType
  // Prompts for free tools
  prompts: VideoPromptSet
  // Instructions
  instructions: string
}

export interface TimelineConfig {
  totalDuration: number
  scenes: {
    sceneNumber: number
    startTime: number
    endTime: number
    cutType: string
  }[]
  musicTrack?: {
    title: string
    startTime: number
    endTime: number
  }
}

export interface ExportGuide {
  steps: {
    step: number
    tool: string
    action: string
    tip?: string
  }[]
  freeToolsLinks: {
    name: string
    url: string
    freeCredits: string
    bestFor: string
  }[]
}

// ==================== FREE TOOLS CONFIG ====================

export const FREE_VIDEO_TOOLS = [
  {
    id: 'grok',
    name: 'Grok (X/Twitter)',
    url: 'https://x.com',
    freeCredits: 'Unlimited',
    bestFor: 'Quick videos, high volume',
    promptStyle: 'simple'
  },
  {
    id: 'openart',
    name: 'OpenArt',
    url: 'https://openart.ai',
    freeCredits: 'Based on credits',
    bestFor: 'Quality, artistic styles',
    promptStyle: 'detailed'
  },
  {
    id: 'pika',
    name: 'Pika Labs',
    url: 'https://pika.art',
    freeCredits: '250/month',
    bestFor: 'Cinematic movements',
    promptStyle: 'cinematic'
  },
  {
    id: 'luma',
    name: 'Luma Dream Machine',
    url: 'https://lumalabs.ai/dream-machine',
    freeCredits: '30/month',
    bestFor: 'Realistic, products',
    promptStyle: 'realistic'
  },
  {
    id: 'kling',
    name: 'Kling AI',
    url: 'https://klingai.com',
    freeCredits: '66/day',
    bestFor: 'Longer videos (5-10s)',
    promptStyle: 'detailed'
  },
  {
    id: 'pixverse',
    name: 'Pixverse',
    url: 'https://pixverse.ai',
    freeCredits: '50/day',
    bestFor: 'Creative effects',
    promptStyle: 'creative'
  }
]

// ==================== HELPER FUNCTIONS ====================

export function generateVideoPrompts(
  script: string,
  motionType: MotionType,
  duration: number
): VideoPromptSet {
  const baseMotion = {
    'zoom_in': 'slow zoom in',
    'zoom_out': 'slow zoom out',
    'pan_left': 'pan from right to left',
    'pan_right': 'pan from left to right',
    'pan_up': 'pan upward',
    'pan_down': 'pan downward',
    'rotate': 'slow rotation',
    'static': 'static with subtle movement',
    'ken_burns': 'Ken Burns effect',
    'pulse': 'subtle pulsing',
    'float': 'gentle floating motion'
  }[motionType]

  return {
    grok: `Animate this image with ${baseMotion}, ${duration} seconds, smooth motion`,
    openart: `Cinematic ${baseMotion}, product photography style, smooth transition, ${duration}s video`,
    pika: `camera ${baseMotion}, cinematic, smooth motion, high quality, ${duration} seconds`,
    luma: `gentle ${baseMotion}, professional product video, realistic motion, ${duration}s`,
    kling: `${baseMotion}, professional advertisement style, smooth cinematic movement, duration ${duration} seconds`,
    general: `Create a ${duration} second video with ${baseMotion}. Style: professional product video. Motion should be smooth and cinematic.`
  }
}

export function createEmptyVideoScene(order: number): VideoScene {
  return {
    id: `scene-${Date.now()}-${order}`,
    order,
    imageUrl: null,
    videoUrl: null,
    script: '',
    duration: 3,
    cutType: 'fade',
    videoPrompts: generateVideoPrompts('', 'zoom_in', 3),
    motionType: 'zoom_in',
    status: 'pending'
  }
}

export function calculateTotalDuration(scenes: VideoScene[]): number {
  return scenes.reduce((total, scene) => total + scene.duration, 0)
}
