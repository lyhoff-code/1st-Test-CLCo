export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export type ContentType = 'reel' | 'story' | 'post' | 'storytelling' | 'carousel';

export type ToneType = 'divertido' | 'profesional' | 'educativo' | 'emocional' | 'urgente';

export type StorytellingSceneType = 'hook' | 'problem' | 'agitation' | 'solution' | 'result' | 'cta';

// ============================================
// 1. VOICE CUSTOMIZATION TYPES
// ============================================

export type VoiceGender = 'male' | 'female' | 'neutral';
export type VoiceAccent = 'american' | 'british' | 'australian' | 'spanish' | 'neutral';
export type VoiceEmotion = 'calm' | 'excited' | 'professional' | 'friendly' | 'urgent';
export type VoiceSpeed = 'slow' | 'normal' | 'fast';

export interface VoiceSettings {
  gender: VoiceGender;
  accent: VoiceAccent;
  emotion: VoiceEmotion;
  speed: VoiceSpeed;
  pitch: number; // -10 to 10
  volume: number; // 0 to 100
}

export const VOICE_GENDERS: { value: VoiceGender; label: string; iconName: string }[] = [
  { value: 'male', label: 'Male', iconName: 'User' },
  { value: 'female', label: 'Female', iconName: 'User' },
  { value: 'neutral', label: 'Neutral', iconName: 'Users' },
];

export const VOICE_ACCENTS: { value: VoiceAccent; label: string; flag: string }[] = [
  { value: 'american', label: 'American', flag: '🇺🇸' },
  { value: 'british', label: 'British', flag: '🇬🇧' },
  { value: 'australian', label: 'Australian', flag: '🇦🇺' },
  { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { value: 'neutral', label: 'Neutral', flag: '🌐' },
];

export const VOICE_EMOTIONS: { value: VoiceEmotion; label: string; iconName: string; color: string }[] = [
  { value: 'calm', label: 'Calm', iconName: 'Leaf', color: 'turquoise' },
  { value: 'excited', label: 'Excited', iconName: 'Zap', color: 'pink' },
  { value: 'professional', label: 'Professional', iconName: 'Briefcase', color: 'turquoise' },
  { value: 'friendly', label: 'Friendly', iconName: 'Heart', color: 'pink' },
  { value: 'urgent', label: 'Urgent', iconName: 'AlertCircle', color: 'pink' },
];

export const VOICE_SPEEDS: { value: VoiceSpeed; label: string; multiplier: number }[] = [
  { value: 'slow', label: 'Slow (0.8x)', multiplier: 0.8 },
  { value: 'normal', label: 'Normal (1x)', multiplier: 1.0 },
  { value: 'fast', label: 'Fast (1.2x)', multiplier: 1.2 },
];

// ============================================
// 2. TARGET AUDIENCE TYPES
// ============================================

export type AgeGroup = 'gen-z' | 'millennials' | 'gen-x' | 'boomers' | 'all';
export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'all';
export type Niche = 'beauty' | 'tech' | 'fashion' | 'fitness' | 'food' | 'travel' | 'business' | 'lifestyle' | 'general';
export type PainPoint = 'time' | 'money' | 'effort' | 'status' | 'health' | 'relationships';

export interface AudienceSettings {
  ageGroup: AgeGroup;
  platform: Platform;
  niche: Niche;
  painPoints: PainPoint[];
  language: string;
}

export const AGE_GROUPS: { value: AgeGroup; label: string; range: string; traits: string }[] = [
  { value: 'gen-z', label: 'Gen Z', range: '18-25', traits: 'Trendy, authentic, fast-paced' },
  { value: 'millennials', label: 'Millennials', range: '26-40', traits: 'Value-driven, quality-focused' },
  { value: 'gen-x', label: 'Gen X', range: '41-56', traits: 'Practical, reliable, straightforward' },
  { value: 'boomers', label: 'Boomers', range: '57-75', traits: 'Traditional, trust-focused' },
  { value: 'all', label: 'All Ages', range: 'Universal', traits: 'Broad appeal' },
];

export const PLATFORMS: { value: Platform; label: string; iconName: string; aspectRatio: string; maxDuration: number }[] = [
  { value: 'tiktok', label: 'TikTok', iconName: 'Music', aspectRatio: '9:16', maxDuration: 60 },
  { value: 'instagram', label: 'Instagram', iconName: 'Instagram', aspectRatio: '9:16', maxDuration: 90 },
  { value: 'youtube', label: 'YouTube Shorts', iconName: 'Youtube', aspectRatio: '9:16', maxDuration: 60 },
  { value: 'facebook', label: 'Facebook', iconName: 'Facebook', aspectRatio: '9:16', maxDuration: 60 },
  { value: 'all', label: 'All Platforms', iconName: 'Globe', aspectRatio: '9:16', maxDuration: 60 },
];

export const NICHES: { value: Niche; label: string; iconName: string; color: string }[] = [
  { value: 'beauty', label: 'Beauty', iconName: 'Sparkles', color: 'pink' },
  { value: 'tech', label: 'Tech', iconName: 'Cpu', color: 'turquoise' },
  { value: 'fashion', label: 'Fashion', iconName: 'Shirt', color: 'pink' },
  { value: 'fitness', label: 'Fitness', iconName: 'Dumbbell', color: 'turquoise' },
  { value: 'food', label: 'Food', iconName: 'UtensilsCrossed', color: 'pink' },
  { value: 'travel', label: 'Travel', iconName: 'Plane', color: 'turquoise' },
  { value: 'business', label: 'Business', iconName: 'TrendingUp', color: 'turquoise' },
  { value: 'lifestyle', label: 'Lifestyle', iconName: 'Sun', color: 'pink' },
  { value: 'general', label: 'General', iconName: 'Grid', color: 'turquoise' },
];

export const PAIN_POINTS: { value: PainPoint; label: string; iconName: string; description: string }[] = [
  { value: 'time', label: 'Save Time', iconName: 'Clock', description: 'Not enough time in the day' },
  { value: 'money', label: 'Save Money', iconName: 'DollarSign', description: 'Budget-conscious decisions' },
  { value: 'effort', label: 'Less Effort', iconName: 'Battery', description: 'Too complicated or hard' },
  { value: 'status', label: 'Status', iconName: 'Crown', description: 'Want to impress others' },
  { value: 'health', label: 'Health', iconName: 'Heart', description: 'Health and wellness concerns' },
  { value: 'relationships', label: 'Relationships', iconName: 'Users', description: 'Connection with others' },
];

// ============================================
// 3. VISUAL STYLE TYPES
// ============================================

export type ColorMood = 'warm' | 'cold' | 'neon' | 'minimal' | 'pastel' | 'dark' | 'vibrant';
export type VisualStyle = 'cinematic' | 'ugc' | 'professional' | 'playful' | 'minimal' | 'luxury';
export type AspectRatio = '9:16' | '1:1' | '16:9' | '4:5';
export type ImageStyle = 'photorealistic' | 'illustrated' | '3d-render' | 'anime' | 'watercolor';

export interface VisualSettings {
  colorMood: ColorMood;
  visualStyle: VisualStyle;
  aspectRatio: AspectRatio;
  imageStyle: ImageStyle;
  filterIntensity: number; // 0 to 100
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  saturation: number; // -50 to 50
}

export const COLOR_MOODS: { value: ColorMood; label: string; colors: string[]; description: string }[] = [
  { value: 'warm', label: 'Warm', colors: ['#FF6B6B', '#FFA07A', '#FFD93D'], description: 'Cozy and inviting' },
  { value: 'cold', label: 'Cold', colors: ['#74B9FF', '#A8E6E1', '#DFE6E9'], description: 'Clean and fresh' },
  { value: 'neon', label: 'Neon', colors: ['#FF00FF', '#00FFFF', '#39FF14'], description: 'Bold and electric' },
  { value: 'minimal', label: 'Minimal', colors: ['#FFFFFF', '#F5F5F5', '#333333'], description: 'Simple and elegant' },
  { value: 'pastel', label: 'Pastel', colors: ['#FFB6C1', '#E0BBE4', '#957DAD'], description: 'Soft and dreamy' },
  { value: 'dark', label: 'Dark', colors: ['#1A1A2E', '#16213E', '#0F3460'], description: 'Mysterious and bold' },
  { value: 'vibrant', label: 'Vibrant', colors: ['#FF6F61', '#6B5B95', '#88B04B'], description: 'Energetic and fun' },
];

export const VISUAL_STYLES: { value: VisualStyle; label: string; iconName: string; description: string }[] = [
  { value: 'cinematic', label: 'Cinematic', iconName: 'Film', description: 'Movie-like, dramatic' },
  { value: 'ugc', label: 'UGC Style', iconName: 'Smartphone', description: 'Authentic, user-generated' },
  { value: 'professional', label: 'Professional', iconName: 'Briefcase', description: 'Polished, corporate' },
  { value: 'playful', label: 'Playful', iconName: 'Smile', description: 'Fun, energetic' },
  { value: 'minimal', label: 'Minimal', iconName: 'Minus', description: 'Clean, simple' },
  { value: 'luxury', label: 'Luxury', iconName: 'Gem', description: 'Premium, elegant' },
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string; width: number; height: number; platforms: string[] }[] = [
  { value: '9:16', label: 'Vertical (9:16)', width: 1080, height: 1920, platforms: ['TikTok', 'Reels', 'Shorts'] },
  { value: '1:1', label: 'Square (1:1)', width: 1080, height: 1080, platforms: ['Instagram Feed', 'Facebook'] },
  { value: '16:9', label: 'Horizontal (16:9)', width: 1920, height: 1080, platforms: ['YouTube', 'Twitter'] },
  { value: '4:5', label: 'Portrait (4:5)', width: 1080, height: 1350, platforms: ['Instagram Feed'] },
];

export const IMAGE_STYLES: { value: ImageStyle; label: string; iconName: string }[] = [
  { value: 'photorealistic', label: 'Photorealistic', iconName: 'Camera' },
  { value: 'illustrated', label: 'Illustrated', iconName: 'PenTool' },
  { value: '3d-render', label: '3D Render', iconName: 'Box' },
  { value: 'anime', label: 'Anime', iconName: 'Star' },
  { value: 'watercolor', label: 'Watercolor', iconName: 'Droplet' },
];

// ============================================
// 4. MUSIC & SOUND TYPES
// ============================================

export type MusicMood = 'upbeat' | 'chill' | 'dramatic' | 'inspiring' | 'funny' | 'emotional' | 'none';
export type SoundEffect = 'whoosh' | 'pop' | 'ding' | 'swoosh' | 'click' | 'success' | 'notification';

export interface MusicSettings {
  mood: MusicMood;
  volume: number; // 0 to 100
  fadeIn: boolean;
  fadeOut: boolean;
  beatSync: boolean;
  soundEffects: SoundEffect[];
  voiceMusicBalance: number; // 0 = all music, 100 = all voice
}

export const MUSIC_MOODS: { value: MusicMood; label: string; iconName: string; description: string; bpm: string }[] = [
  { value: 'upbeat', label: 'Upbeat', iconName: 'Music', description: 'Energetic and fast', bpm: '120-140' },
  { value: 'chill', label: 'Chill', iconName: 'Coffee', description: 'Relaxed and calm', bpm: '70-90' },
  { value: 'dramatic', label: 'Dramatic', iconName: 'Flame', description: 'Intense and powerful', bpm: '90-120' },
  { value: 'inspiring', label: 'Inspiring', iconName: 'Sunrise', description: 'Motivational', bpm: '100-120' },
  { value: 'funny', label: 'Funny', iconName: 'Laugh', description: 'Playful and quirky', bpm: '110-130' },
  { value: 'emotional', label: 'Emotional', iconName: 'Heart', description: 'Touching and moving', bpm: '60-80' },
  { value: 'none', label: 'No Music', iconName: 'VolumeX', description: 'Voice only', bpm: '-' },
];

export const SOUND_EFFECTS: { value: SoundEffect; label: string; iconName: string }[] = [
  { value: 'whoosh', label: 'Whoosh', iconName: 'Wind' },
  { value: 'pop', label: 'Pop', iconName: 'Circle' },
  { value: 'ding', label: 'Ding', iconName: 'Bell' },
  { value: 'swoosh', label: 'Swoosh', iconName: 'ArrowRight' },
  { value: 'click', label: 'Click', iconName: 'MousePointer' },
  { value: 'success', label: 'Success', iconName: 'CheckCircle' },
  { value: 'notification', label: 'Notification', iconName: 'BellRing' },
];

// ============================================
// 5. SCRIPT REFINEMENT TYPES
// ============================================

export type HookStyle = 'question' | 'statement' | 'shock' | 'curiosity' | 'story' | 'statistic';
export type ScriptLength = '15' | '30' | '60' | '90';

export interface ScriptSettings {
  hookStyle: HookStyle;
  length: ScriptLength;
  includeKeywords: string[];
  excludeKeywords: string[];
  includeHashtags: boolean;
  hashtagCount: number;
  includeEmojis: boolean;
  maxCharsPerScene: number;
  ctaStyle: 'soft' | 'medium' | 'direct';
}

export const HOOK_STYLES: { value: HookStyle; label: string; iconName: string; example: string }[] = [
  { value: 'question', label: 'Question', iconName: 'HelpCircle', example: 'Have you ever wondered why...?' },
  { value: 'statement', label: 'Bold Statement', iconName: 'MessageSquare', example: 'This changed everything.' },
  { value: 'shock', label: 'Shock/Surprise', iconName: 'Zap', example: 'I can\'t believe this actually works!' },
  { value: 'curiosity', label: 'Curiosity Gap', iconName: 'Eye', example: 'Nobody talks about this...' },
  { value: 'story', label: 'Story Opening', iconName: 'BookOpen', example: 'So this happened to me...' },
  { value: 'statistic', label: 'Statistic', iconName: 'BarChart', example: '90% of people don\'t know this...' },
];

export const SCRIPT_LENGTHS: { value: ScriptLength; label: string; scenes: number; wordsApprox: string }[] = [
  { value: '15', label: '15 seconds', scenes: 3, wordsApprox: '30-40 words' },
  { value: '30', label: '30 seconds', scenes: 5, wordsApprox: '60-80 words' },
  { value: '60', label: '60 seconds', scenes: 8, wordsApprox: '120-150 words' },
  { value: '90', label: '90 seconds', scenes: 10, wordsApprox: '180-220 words' },
];

// ============================================
// 6. BRANDING TYPES
// ============================================

export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'none';
export type WatermarkStyle = 'subtle' | 'bold' | 'animated' | 'none';

export interface BrandingSettings {
  logoUrl?: string;
  logoPosition: LogoPosition;
  logoSize: number; // 10 to 100
  logoOpacity: number; // 0 to 100
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  watermarkText?: string;
  watermarkStyle: WatermarkStyle;
  showIntro: boolean;
  showOutro: boolean;
  introText?: string;
  outroText?: string;
}

export const LOGO_POSITIONS: { value: LogoPosition; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'center', label: 'Center' },
  { value: 'none', label: 'No Logo' },
];

export const FONT_FAMILIES: { value: string; label: string; style: string }[] = [
  { value: 'Inter', label: 'Inter', style: 'Modern, Clean' },
  { value: 'Poppins', label: 'Poppins', style: 'Friendly, Rounded' },
  { value: 'Montserrat', label: 'Montserrat', style: 'Bold, Professional' },
  { value: 'Playfair Display', label: 'Playfair', style: 'Elegant, Luxury' },
  { value: 'Roboto', label: 'Roboto', style: 'Neutral, Tech' },
  { value: 'Open Sans', label: 'Open Sans', style: 'Readable, Friendly' },
];

// ============================================
// 7. EXPORT & QUALITY TYPES
// ============================================

export type Resolution = '720p' | '1080p' | '4k';
export type ExportFormat = 'mp4' | 'mov' | 'webm' | 'gif';
export type SubtitleStyle = 'none' | 'minimal' | 'bold' | 'karaoke' | 'typewriter';

export interface ExportSettings {
  resolution: Resolution;
  format: ExportFormat;
  fps: number; // 24, 30, 60
  quality: number; // 1-100
  includeSubtitles: boolean;
  subtitleStyle: SubtitleStyle;
  subtitlePosition: 'top' | 'center' | 'bottom';
  subtitleFontSize: number;
  optimizeForPlatform: Platform;
}

export const RESOLUTIONS: { value: Resolution; label: string; width: number; height: number; fileSize: string }[] = [
  { value: '720p', label: '720p HD', width: 720, height: 1280, fileSize: '~5-10 MB' },
  { value: '1080p', label: '1080p Full HD', width: 1080, height: 1920, fileSize: '~15-25 MB' },
  { value: '4k', label: '4K Ultra HD', width: 2160, height: 3840, fileSize: '~50-100 MB' },
];

export const EXPORT_FORMATS: { value: ExportFormat; label: string; description: string; compatibility: string }[] = [
  { value: 'mp4', label: 'MP4', description: 'Most compatible', compatibility: 'All platforms' },
  { value: 'mov', label: 'MOV', description: 'Apple optimized', compatibility: 'iOS, Mac' },
  { value: 'webm', label: 'WebM', description: 'Web optimized', compatibility: 'Web browsers' },
  { value: 'gif', label: 'GIF', description: 'Animated image', compatibility: 'All platforms' },
];

export const SUBTITLE_STYLES: { value: SubtitleStyle; label: string; description: string }[] = [
  { value: 'none', label: 'No Subtitles', description: 'Clean video without text' },
  { value: 'minimal', label: 'Minimal', description: 'Simple white text' },
  { value: 'bold', label: 'Bold', description: 'Large, eye-catching text' },
  { value: 'karaoke', label: 'Karaoke', description: 'Word-by-word highlight' },
  { value: 'typewriter', label: 'Typewriter', description: 'Text appears letter by letter' },
];

// ============================================
// COMBINED VIDEO SETTINGS
// ============================================

export interface VideoSettings {
  voice: VoiceSettings;
  audience: AudienceSettings;
  visual: VisualSettings;
  music: MusicSettings;
  script: ScriptSettings;
  branding: BrandingSettings;
  export: ExportSettings;
}

export const DEFAULT_VIDEO_SETTINGS: VideoSettings = {
  voice: {
    gender: 'female',
    accent: 'american',
    emotion: 'friendly',
    speed: 'normal',
    pitch: 0,
    volume: 80,
  },
  audience: {
    ageGroup: 'millennials',
    platform: 'instagram',
    niche: 'general',
    painPoints: ['time'],
    language: 'en',
  },
  visual: {
    colorMood: 'warm',
    visualStyle: 'ugc',
    aspectRatio: '9:16',
    imageStyle: 'photorealistic',
    filterIntensity: 50,
    brightness: 0,
    contrast: 0,
    saturation: 0,
  },
  music: {
    mood: 'upbeat',
    volume: 30,
    fadeIn: true,
    fadeOut: true,
    beatSync: false,
    soundEffects: [],
    voiceMusicBalance: 70,
  },
  script: {
    hookStyle: 'curiosity',
    length: '30',
    includeKeywords: [],
    excludeKeywords: [],
    includeHashtags: true,
    hashtagCount: 5,
    includeEmojis: false,
    maxCharsPerScene: 150,
    ctaStyle: 'soft',
  },
  branding: {
    logoUrl: undefined,
    logoPosition: 'bottom-right',
    logoSize: 30,
    logoOpacity: 80,
    primaryColor: '#A8E6E1',
    secondaryColor: '#F9B4C4',
    fontFamily: 'Inter',
    watermarkText: undefined,
    watermarkStyle: 'none',
    showIntro: false,
    showOutro: false,
    introText: undefined,
    outroText: undefined,
  },
  export: {
    resolution: '1080p',
    format: 'mp4',
    fps: 30,
    quality: 80,
    includeSubtitles: true,
    subtitleStyle: 'bold',
    subtitlePosition: 'bottom',
    subtitleFontSize: 24,
    optimizeForPlatform: 'instagram',
  },
};

// ============================================
// EXISTING TYPES (PRESERVED)
// ============================================

export interface StorytellingScene {
  id: string;
  type: StorytellingSceneType;
  title: string;
  timeRange: string;
  script: string;
  audioUrl?: string;
  imageUrl?: string;
  imagePrompt?: string;
  isGeneratingAudio?: boolean;
  isGeneratingImage?: boolean;
}

export interface StorytellingContent {
  scenes: StorytellingScene[];
  totalDuration: number;
}

export const STORYTELLING_SCENES: { type: StorytellingSceneType; title: string; timeRange: string; duration: number; description: string; promptGuidance: string }[] = [
  {
    type: 'hook',
    title: 'Hook',
    timeRange: '0-3 sec',
    duration: 3,
    description: 'Attention-grabbing opening',
    promptGuidance: 'Create a powerful, attention-grabbing hook that stops the scroll. Make it intriguing and compelling.'
  },
  {
    type: 'problem',
    title: 'Problem',
    timeRange: '3-8 sec',
    duration: 5,
    description: 'Customer pain point',
    promptGuidance: 'Describe a relatable pain point or problem that the target audience experiences. Be specific and empathetic.'
  },
  {
    type: 'agitation',
    title: 'Agitation',
    timeRange: '8-12 sec',
    duration: 4,
    description: 'Intensify the problem',
    promptGuidance: 'Amplify the problem. Show the consequences of not solving it. Create emotional resonance.'
  },
  {
    type: 'solution',
    title: 'Solution',
    timeRange: '12-20 sec',
    duration: 8,
    description: 'Present the product',
    promptGuidance: 'Introduce the product as the solution. Highlight key features and benefits. Show how it solves the problem.'
  },
  {
    type: 'result',
    title: 'Result',
    timeRange: '20-25 sec',
    duration: 5,
    description: 'The transformation',
    promptGuidance: 'Show the positive outcome. Paint a picture of life after using the product. Focus on transformation.'
  },
  {
    type: 'cta',
    title: 'CTA',
    timeRange: '25-30 sec',
    duration: 5,
    description: 'Soft call-to-action',
    promptGuidance: 'Create a soft, conversational CTA. Use curiosity, invitation, or question. Examples: "Curious?", "Link in bio", "Let me know if you want to try it". NEVER use "Buy now", "Get it here", "Order today".'
  }
];

export interface ContentConfig {
  type: ContentType;
  tone: ToneType;
  duration: number;
}

export interface GeneratedContent {
  script: string;
  audioUrl?: string;
  videoUrl?: string;
  scenes: Scene[];
  storytelling?: StorytellingContent;
}

export interface Scene {
  text: string;
  duration: number;
  imageUrl?: string;
}

export interface GenerationState {
  step: 'idle' | 'generating-script' | 'generating-audio' | 'generating-video' | 'generating-scenes' | 'complete' | 'error';
  progress: number;
  message: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  product: ShopifyProduct;
  contentType: ContentType;
  tone: ToneType;
  content: GeneratedContent;
  videoSettings?: VideoSettings;
}

export const CONTENT_TYPES: { value: ContentType; label: string; iconName: string; description: string; color: string; scenes: { name: string; time: string; purpose: string }[] }[] = [
  {
    value: 'reel',
    label: 'Reel',
    iconName: 'Clapperboard',
    description: 'Vertical video 15-60 seconds',
    color: 'turquoise',
    scenes: [
      { name: 'Hook', time: '0-3s', purpose: 'Grab attention instantly' },
      { name: 'Value', time: '3-12s', purpose: 'Show the main benefit' },
      { name: 'Demo', time: '12-20s', purpose: 'Product in action' },
      { name: 'CTA', time: '20-30s', purpose: 'Soft call to action' },
    ]
  },
  {
    value: 'story',
    label: 'Story',
    iconName: 'Smartphone',
    description: 'Ephemeral 15-second content',
    color: 'pink',
    scenes: [
      { name: 'Attention', time: '0-3s', purpose: 'Eye-catching opener' },
      { name: 'Message', time: '3-10s', purpose: 'Key message delivery' },
      { name: 'Action', time: '10-15s', purpose: 'Swipe up / Link' },
    ]
  },
  {
    value: 'post',
    label: 'Post',
    iconName: 'Image',
    description: 'Square feed publication',
    color: 'turquoise',
    scenes: [
      { name: 'Visual', time: 'Main', purpose: 'Striking product image' },
      { name: 'Caption', time: 'Text', purpose: 'Engaging description' },
      { name: 'Hashtags', time: 'Tags', purpose: 'Discoverability' },
    ]
  },
  {
    value: 'storytelling',
    label: 'Storytelling Reel',
    iconName: 'BookOpen',
    description: '30-second story-driven content',
    color: 'pink',
    scenes: [
      { name: 'Hook', time: '0-3s', purpose: 'Stop the scroll' },
      { name: 'Problem', time: '3-8s', purpose: 'Relatable pain point' },
      { name: 'Agitation', time: '8-12s', purpose: 'Intensify the need' },
      { name: 'Solution', time: '12-20s', purpose: 'Present product' },
      { name: 'Result', time: '20-25s', purpose: 'Transformation' },
      { name: 'CTA', time: '25-30s', purpose: 'Soft invitation' },
    ]
  },
  {
    value: 'carousel',
    label: 'Carousel',
    iconName: 'LayoutGrid',
    description: 'Multi-slide swipeable content',
    color: 'turquoise',
    scenes: [
      { name: 'Cover', time: 'Slide 1', purpose: 'Eye-catching title slide' },
      { name: 'Problem', time: 'Slide 2', purpose: 'Define the pain point' },
      { name: 'Stats', time: 'Slide 3', purpose: 'Shocking data or facts' },
      { name: 'Solution', time: 'Slide 4', purpose: 'Present the product' },
      { name: 'Benefits', time: 'Slide 5', purpose: 'Key advantages' },
      { name: 'Proof', time: 'Slide 6', purpose: 'Testimonials or results' },
      { name: 'CTA', time: 'Slide 7', purpose: 'Save & follow' },
    ]
  },
];

// Research data from Perplexity
export interface ProductResearch {
  trends: string[];
  competitors: string[];
  painPoints: string[];
  benefits: string[];
  targetAudience: string;
  marketInsights: string;
  viralAngles: string[];
  hashtags: string[];
  hooks: string[];
}

export const TONE_TYPES: { value: ToneType; label: string; iconName: string; description: string; color: string }[] = [
  {
    value: 'divertido',
    label: 'Fun',
    iconName: 'Smile',
    description: 'Casual and entertaining tone',
    color: 'pink'
  },
  {
    value: 'profesional',
    label: 'Professional',
    iconName: 'Briefcase',
    description: 'Serious and corporate tone',
    color: 'turquoise'
  },
  {
    value: 'emocional',
    label: 'Emotional',
    iconName: 'Heart',
    description: 'Touching and relatable tone',
    color: 'pink'
  },
  {
    value: 'urgente',
    label: 'Urgent',
    iconName: 'Zap',
    description: 'FOMO and scarcity driven',
    color: 'pink'
  },
  {
    value: 'educativo',
    label: 'Educational',
    iconName: 'GraduationCap',
    description: 'Informative and didactic tone',
    color: 'pink'
  },
];
