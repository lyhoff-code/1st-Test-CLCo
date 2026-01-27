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

export type ContentType = 'reel' | 'story' | 'post' | 'storytelling';

export type ToneType = 'divertido' | 'profesional' | 'educativo';

export type StorytellingSceneType = 'hook' | 'problem' | 'agitation' | 'solution' | 'result' | 'cta';

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
}

export const CONTENT_TYPES: { value: ContentType; label: string; iconName: string; description: string; color: string }[] = [
  {
    value: 'reel',
    label: 'Reel',
    iconName: 'Clapperboard',
    description: 'Vertical video 15-60 seconds',
    color: 'turquoise'
  },
  {
    value: 'story',
    label: 'Story',
    iconName: 'Smartphone',
    description: 'Ephemeral 15-second content',
    color: 'pink'
  },
  {
    value: 'post',
    label: 'Post',
    iconName: 'Image',
    description: 'Square feed publication',
    color: 'turquoise'
  },
  {
    value: 'storytelling',
    label: 'Storytelling Reel',
    iconName: 'BookOpen',
    description: '30-second story-driven content',
    color: 'pink'
  },
];

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
    value: 'educativo',
    label: 'Educational',
    iconName: 'GraduationCap',
    description: 'Informative and didactic tone',
    color: 'pink'
  },
];
