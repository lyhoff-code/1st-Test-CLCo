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

export type ContentType = 'reel' | 'story' | 'post';

export type ToneType = 'divertido' | 'profesional' | 'educativo';

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
}

export interface Scene {
  text: string;
  duration: number;
  imageUrl?: string;
}

export interface GenerationState {
  step: 'idle' | 'generating-script' | 'generating-audio' | 'generating-video' | 'complete' | 'error';
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

export const CONTENT_TYPES: { value: ContentType; label: string; icon: string; description: string; color: string }[] = [
  {
    value: 'reel',
    label: 'Reel',
    icon: '🎬',
    description: 'Vertical video 15-60 seconds',
    color: 'turquoise'
  },
  {
    value: 'story',
    label: 'Story',
    icon: '📱',
    description: 'Ephemeral 15-second content',
    color: 'pink'
  },
  {
    value: 'post',
    label: 'Post',
    icon: '📸',
    description: 'Square feed publication',
    color: 'turquoise'
  },
];

export const TONE_TYPES: { value: ToneType; label: string; icon: string; description: string; color: string }[] = [
  {
    value: 'divertido',
    label: 'Fun',
    icon: '😄',
    description: 'Casual and entertaining tone',
    color: 'pink'
  },
  {
    value: 'profesional',
    label: 'Professional',
    icon: '💼',
    description: 'Serious and corporate tone',
    color: 'turquoise'
  },
  {
    value: 'educativo',
    label: 'Educational',
    icon: '📚',
    description: 'Informative and didactic tone',
    color: 'pink'
  },
];
