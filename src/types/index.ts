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
  duration: number; // en segundos
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

export const CONTENT_TYPES: { value: ContentType; label: string; icon: string; description: string }[] = [
  {
    value: 'reel',
    label: 'Reel',
    icon: '🎬',
    description: 'Video vertical de 15-60 segundos'
  },
  {
    value: 'story',
    label: 'Story',
    icon: '📱',
    description: 'Contenido efímero de 15 segundos'
  },
  {
    value: 'post',
    label: 'Post',
    icon: '📸',
    description: 'Publicación cuadrada para feed'
  },
];

export const TONE_TYPES: { value: ToneType; label: string; icon: string; description: string }[] = [
  {
    value: 'divertido',
    label: 'Divertido',
    icon: '😄',
    description: 'Tono casual y entretenido'
  },
  {
    value: 'profesional',
    label: 'Profesional',
    icon: '💼',
    description: 'Tono serio y corporativo'
  },
  {
    value: 'educativo',
    label: 'Educativo',
    icon: '📚',
    description: 'Tono informativo y didáctico'
  },
];
