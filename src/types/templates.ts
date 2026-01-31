// Video Template Types and Structures

export type TemplateCategory =
  | 'educational'
  | 'unboxing'
  | 'viral'
  | 'storytelling'
  | 'carousel'
  | 'review'
  | 'comparison'
  | 'promo'

export type SceneType =
  | 'hook'
  | 'problem'
  | 'tip'
  | 'demo'
  | 'feature'
  | 'benefit'
  | 'solution'
  | 'result'
  | 'before'
  | 'after'
  | 'reveal'
  | 'cta'
  | 'intro'
  | 'stats'
  | 'proof'
  | 'cover'

export interface SceneTemplate {
  id: string
  type: SceneType
  name: string
  duration: number // in seconds
  defaultText: string
  textPosition: 'top' | 'center' | 'bottom'
  textStyle: 'bold' | 'minimal' | 'neon' | 'gradient'
  transition: 'fade' | 'slide' | 'zoom' | 'none'
  placeholder: {
    imageUrl: string
    instructions: string
  }
}

export interface VideoTemplateStructure {
  id: string
  name: string
  category: TemplateCategory
  description: string
  emoji: string
  totalDuration: number
  aspectRatio: '9:16' | '1:1' | '16:9' | '4:5'
  scenes: SceneTemplate[]
  suggestedMusic: {
    mood: string
    bpm: string
    genres: string[]
  }
  tags: string[]
  difficulty: 'easy' | 'medium' | 'advanced'
  conversionDay?: string[] // Best days for this type
}

export interface UserScene {
  id: string
  templateSceneId: string
  imageUrl: string | null
  imageFile?: File
  script: string
  speechUrl?: string
  duration: number
  isEdited: boolean
}

export interface UserProject {
  id: string
  templateId: string
  productId?: string
  productName?: string
  scenes: UserScene[]
  selectedMusic?: {
    id: string
    title: string
    url: string
  }
  captionStyle?: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'generating' | 'ready' | 'exported'
}

// Template Definitions
export const VIDEO_TEMPLATES: VideoTemplateStructure[] = [
  // 1. Educational Template
  {
    id: 'educational-5',
    name: 'Educational Tips',
    category: 'educational',
    description: '5 scenes with hook, problem, and 3 tips',
    emoji: '🎓',
    totalDuration: 26,
    aspectRatio: '9:16',
    conversionDay: ['Tuesday', 'Wednesday', 'Thursday'],
    difficulty: 'easy',
    tags: ['tips', 'howto', 'learn', 'educational'],
    suggestedMusic: {
      mood: 'upbeat',
      bpm: '100-120',
      genres: ['corporate', 'inspiring']
    },
    scenes: [
      {
        id: 'edu-hook',
        type: 'hook',
        name: 'Hook',
        duration: 3,
        defaultText: 'Did you know this about [product]?',
        textPosition: 'center',
        textStyle: 'bold',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/educational/hook.jpg',
          instructions: 'Eye-catching product shot or surprising fact visual'
        }
      },
      {
        id: 'edu-problem',
        type: 'problem',
        name: 'Problem',
        duration: 5,
        defaultText: 'Most people struggle with...',
        textPosition: 'bottom',
        textStyle: 'minimal',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/educational/problem.jpg',
          instructions: 'Show the problem or pain point'
        }
      },
      {
        id: 'edu-tip1',
        type: 'tip',
        name: 'Tip 1',
        duration: 5,
        defaultText: 'First, try this...',
        textPosition: 'bottom',
        textStyle: 'bold',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/educational/tip1.jpg',
          instructions: 'First tip or feature demonstration'
        }
      },
      {
        id: 'edu-tip2',
        type: 'tip',
        name: 'Tip 2',
        duration: 5,
        defaultText: 'Second, you can...',
        textPosition: 'bottom',
        textStyle: 'bold',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/educational/tip2.jpg',
          instructions: 'Second tip or benefit'
        }
      },
      {
        id: 'edu-tip3',
        type: 'tip',
        name: 'Tip 3',
        duration: 5,
        defaultText: 'Finally, remember to...',
        textPosition: 'bottom',
        textStyle: 'bold',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/educational/tip3.jpg',
          instructions: 'Third tip or key takeaway'
        }
      },
      {
        id: 'edu-cta',
        type: 'cta',
        name: 'Call to Action',
        duration: 3,
        defaultText: 'Link in bio! 👆',
        textPosition: 'center',
        textStyle: 'neon',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/educational/cta.jpg',
          instructions: 'Product with clear CTA overlay'
        }
      }
    ]
  },

  // 2. Unboxing Template
  {
    id: 'unboxing-4',
    name: 'Unboxing Experience',
    category: 'unboxing',
    description: 'Reveal your product dramatically',
    emoji: '📦',
    totalDuration: 25,
    aspectRatio: '9:16',
    conversionDay: ['Friday', 'Saturday', 'Sunday'],
    difficulty: 'easy',
    tags: ['unboxing', 'reveal', 'new', 'haul'],
    suggestedMusic: {
      mood: 'exciting',
      bpm: '120-140',
      genres: ['electronic', 'pop']
    },
    scenes: [
      {
        id: 'unbox-intro',
        type: 'intro',
        name: 'Intro',
        duration: 3,
        defaultText: 'Let me show you what I got! 📦',
        textPosition: 'center',
        textStyle: 'bold',
        transition: 'fade',
        placeholder: {
          imageUrl: '/templates/unboxing/intro.jpg',
          instructions: 'Closed package or box'
        }
      },
      {
        id: 'unbox-reveal',
        type: 'reveal',
        name: 'The Reveal',
        duration: 8,
        defaultText: 'And inside is...',
        textPosition: 'bottom',
        textStyle: 'gradient',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/unboxing/reveal.jpg',
          instructions: 'Opening moment - product reveal'
        }
      },
      {
        id: 'unbox-features',
        type: 'feature',
        name: 'Features',
        duration: 10,
        defaultText: 'Look at these features!',
        textPosition: 'bottom',
        textStyle: 'minimal',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/unboxing/features.jpg',
          instructions: 'Close-up of key features'
        }
      },
      {
        id: 'unbox-cta',
        type: 'cta',
        name: 'Get Yours',
        duration: 4,
        defaultText: 'Get yours now! Link in bio 🔗',
        textPosition: 'center',
        textStyle: 'neon',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/unboxing/cta.jpg',
          instructions: 'Product beauty shot with CTA'
        }
      }
    ]
  },

  // 3. Viral Hook Template
  {
    id: 'viral-3',
    name: 'Viral Hook',
    category: 'viral',
    description: 'Quick viral format - hook, demo, CTA',
    emoji: '🔥',
    totalDuration: 15,
    aspectRatio: '9:16',
    conversionDay: ['Monday', 'Tuesday', 'Wednesday'],
    difficulty: 'easy',
    tags: ['viral', 'quick', 'trending', 'hook'],
    suggestedMusic: {
      mood: 'energetic',
      bpm: '130-150',
      genres: ['trending', 'electronic']
    },
    scenes: [
      {
        id: 'viral-hook',
        type: 'hook',
        name: 'Viral Hook',
        duration: 3,
        defaultText: 'STOP scrolling! 🛑',
        textPosition: 'center',
        textStyle: 'bold',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/viral/hook.jpg',
          instructions: 'Attention-grabbing visual'
        }
      },
      {
        id: 'viral-demo',
        type: 'demo',
        name: 'Quick Demo',
        duration: 8,
        defaultText: 'Watch this...',
        textPosition: 'bottom',
        textStyle: 'minimal',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/viral/demo.jpg',
          instructions: 'Product in action'
        }
      },
      {
        id: 'viral-cta',
        type: 'cta',
        name: 'CTA',
        duration: 4,
        defaultText: 'Link in bio NOW! 🚀',
        textPosition: 'center',
        textStyle: 'neon',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/viral/cta.jpg',
          instructions: 'Urgent CTA visual'
        }
      }
    ]
  },

  // 4. Storytelling Template
  {
    id: 'storytelling-6',
    name: 'Story Arc',
    category: 'storytelling',
    description: 'Complete narrative with problem-solution',
    emoji: '📖',
    totalDuration: 30,
    aspectRatio: '9:16',
    conversionDay: ['Wednesday', 'Thursday', 'Sunday'],
    difficulty: 'medium',
    tags: ['story', 'emotional', 'narrative', 'relatable'],
    suggestedMusic: {
      mood: 'emotional',
      bpm: '80-100',
      genres: ['cinematic', 'inspiring']
    },
    scenes: [
      {
        id: 'story-hook',
        type: 'hook',
        name: 'Hook',
        duration: 3,
        defaultText: 'I was struggling until...',
        textPosition: 'center',
        textStyle: 'minimal',
        transition: 'fade',
        placeholder: {
          imageUrl: '/templates/story/hook.jpg',
          instructions: 'Relatable opening scene'
        }
      },
      {
        id: 'story-problem',
        type: 'problem',
        name: 'The Problem',
        duration: 5,
        defaultText: 'Every day I dealt with...',
        textPosition: 'bottom',
        textStyle: 'minimal',
        transition: 'fade',
        placeholder: {
          imageUrl: '/templates/story/problem.jpg',
          instructions: 'Show the pain point'
        }
      },
      {
        id: 'story-agitation',
        type: 'problem',
        name: 'Agitation',
        duration: 5,
        defaultText: 'I tried everything but nothing worked...',
        textPosition: 'bottom',
        textStyle: 'minimal',
        transition: 'fade',
        placeholder: {
          imageUrl: '/templates/story/agitation.jpg',
          instructions: 'Frustration intensifies'
        }
      },
      {
        id: 'story-solution',
        type: 'solution',
        name: 'Solution',
        duration: 7,
        defaultText: 'Then I discovered [product]...',
        textPosition: 'bottom',
        textStyle: 'gradient',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/story/solution.jpg',
          instructions: 'Product introduction'
        }
      },
      {
        id: 'story-result',
        type: 'result',
        name: 'Result',
        duration: 6,
        defaultText: 'Now my life is completely different!',
        textPosition: 'bottom',
        textStyle: 'bold',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/story/result.jpg',
          instructions: 'Transformation/success'
        }
      },
      {
        id: 'story-cta',
        type: 'cta',
        name: 'CTA',
        duration: 4,
        defaultText: 'Try it yourself! Link in bio 💫',
        textPosition: 'center',
        textStyle: 'neon',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/story/cta.jpg',
          instructions: 'Inspiring CTA'
        }
      }
    ]
  },

  // 5. Carousel Template
  {
    id: 'carousel-7',
    name: 'Swipe Carousel',
    category: 'carousel',
    description: '7 slides for high save rate',
    emoji: '🎠',
    totalDuration: 0, // Carousel doesn't have duration
    aspectRatio: '1:1',
    conversionDay: ['Tuesday', 'Thursday', 'Saturday'],
    difficulty: 'medium',
    tags: ['carousel', 'swipe', 'save', 'educational'],
    suggestedMusic: {
      mood: 'none',
      bpm: 'N/A',
      genres: []
    },
    scenes: [
      {
        id: 'carousel-cover',
        type: 'cover',
        name: 'Cover Slide',
        duration: 0,
        defaultText: '[Compelling Title Here]',
        textPosition: 'center',
        textStyle: 'bold',
        transition: 'none',
        placeholder: {
          imageUrl: '/templates/carousel/cover.jpg',
          instructions: 'Eye-catching cover with title'
        }
      },
      {
        id: 'carousel-problem',
        type: 'problem',
        name: 'The Problem',
        duration: 0,
        defaultText: 'Are you struggling with...?',
        textPosition: 'center',
        textStyle: 'minimal',
        transition: 'none',
        placeholder: {
          imageUrl: '/templates/carousel/problem.jpg',
          instructions: 'Problem statement'
        }
      },
      {
        id: 'carousel-stats',
        type: 'stats',
        name: 'The Stats',
        duration: 0,
        defaultText: '73% of people face this issue',
        textPosition: 'center',
        textStyle: 'bold',
        transition: 'none',
        placeholder: {
          imageUrl: '/templates/carousel/stats.jpg',
          instructions: 'Shocking statistic'
        }
      },
      {
        id: 'carousel-solution',
        type: 'solution',
        name: 'The Solution',
        duration: 0,
        defaultText: 'Here\'s the answer...',
        textPosition: 'center',
        textStyle: 'gradient',
        transition: 'none',
        placeholder: {
          imageUrl: '/templates/carousel/solution.jpg',
          instructions: 'Introduce solution'
        }
      },
      {
        id: 'carousel-benefit1',
        type: 'benefit',
        name: 'Benefit 1',
        duration: 0,
        defaultText: 'Benefit #1: [Key Benefit]',
        textPosition: 'center',
        textStyle: 'minimal',
        transition: 'none',
        placeholder: {
          imageUrl: '/templates/carousel/benefit1.jpg',
          instructions: 'First key benefit'
        }
      },
      {
        id: 'carousel-benefit2',
        type: 'benefit',
        name: 'Benefit 2',
        duration: 0,
        defaultText: 'Benefit #2: [Key Benefit]',
        textPosition: 'center',
        textStyle: 'minimal',
        transition: 'none',
        placeholder: {
          imageUrl: '/templates/carousel/benefit2.jpg',
          instructions: 'Second key benefit'
        }
      },
      {
        id: 'carousel-cta',
        type: 'cta',
        name: 'CTA Slide',
        duration: 0,
        defaultText: 'Save this post! ❤️ Follow for more',
        textPosition: 'center',
        textStyle: 'neon',
        transition: 'none',
        placeholder: {
          imageUrl: '/templates/carousel/cta.jpg',
          instructions: 'Strong CTA with engagement ask'
        }
      }
    ]
  },

  // 6. Review/Testimonial Template
  {
    id: 'review-4',
    name: 'Before & After Review',
    category: 'review',
    description: 'Show transformation with testimonial',
    emoji: '⭐',
    totalDuration: 20,
    aspectRatio: '9:16',
    conversionDay: ['Monday', 'Friday', 'Saturday'],
    difficulty: 'easy',
    tags: ['review', 'testimonial', 'before-after', 'transformation'],
    suggestedMusic: {
      mood: 'uplifting',
      bpm: '100-120',
      genres: ['pop', 'inspiring']
    },
    scenes: [
      {
        id: 'review-before',
        type: 'before',
        name: 'Before',
        duration: 5,
        defaultText: 'Before using [product]...',
        textPosition: 'bottom',
        textStyle: 'minimal',
        transition: 'fade',
        placeholder: {
          imageUrl: '/templates/review/before.jpg',
          instructions: 'Before state/problem'
        }
      },
      {
        id: 'review-problem',
        type: 'problem',
        name: 'The Struggle',
        duration: 5,
        defaultText: 'I was so frustrated with...',
        textPosition: 'bottom',
        textStyle: 'minimal',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/review/struggle.jpg',
          instructions: 'Pain point visualization'
        }
      },
      {
        id: 'review-after',
        type: 'after',
        name: 'After',
        duration: 6,
        defaultText: 'After just [time period]... WOW!',
        textPosition: 'bottom',
        textStyle: 'gradient',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/review/after.jpg',
          instructions: 'Transformation result'
        }
      },
      {
        id: 'review-cta',
        type: 'cta',
        name: 'Get Results',
        duration: 4,
        defaultText: 'Get your transformation! Link in bio ⭐',
        textPosition: 'center',
        textStyle: 'neon',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/review/cta.jpg',
          instructions: 'Product with CTA'
        }
      }
    ]
  },

  // 7. Comparison Template
  {
    id: 'comparison-4',
    name: 'With vs Without',
    category: 'comparison',
    description: 'Compare life with and without product',
    emoji: '🆚',
    totalDuration: 20,
    aspectRatio: '9:16',
    conversionDay: ['Tuesday', 'Wednesday', 'Thursday'],
    difficulty: 'medium',
    tags: ['comparison', 'vs', 'difference', 'upgrade'],
    suggestedMusic: {
      mood: 'dramatic',
      bpm: '90-110',
      genres: ['cinematic', 'electronic']
    },
    scenes: [
      {
        id: 'compare-without',
        type: 'before',
        name: 'Without Product',
        duration: 5,
        defaultText: 'Without [product]... 😩',
        textPosition: 'bottom',
        textStyle: 'minimal',
        transition: 'fade',
        placeholder: {
          imageUrl: '/templates/compare/without.jpg',
          instructions: 'Frustrating scenario'
        }
      },
      {
        id: 'compare-problems',
        type: 'problem',
        name: 'Problems',
        duration: 5,
        defaultText: 'Dealing with all these issues...',
        textPosition: 'bottom',
        textStyle: 'minimal',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/compare/problems.jpg',
          instructions: 'Multiple pain points'
        }
      },
      {
        id: 'compare-with',
        type: 'after',
        name: 'With Product',
        duration: 6,
        defaultText: 'With [product]... 🤩',
        textPosition: 'bottom',
        textStyle: 'gradient',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/compare/with.jpg',
          instructions: 'Life is better now'
        }
      },
      {
        id: 'compare-cta',
        type: 'cta',
        name: 'Upgrade Now',
        duration: 4,
        defaultText: 'Upgrade your life! Link in bio 🚀',
        textPosition: 'center',
        textStyle: 'neon',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/compare/cta.jpg',
          instructions: 'Product showcase with CTA'
        }
      }
    ]
  },

  // 8. Promo/Sale Template
  {
    id: 'promo-3',
    name: 'Flash Sale',
    category: 'promo',
    description: 'Quick promo with urgency',
    emoji: '🎁',
    totalDuration: 12,
    aspectRatio: '9:16',
    conversionDay: ['Friday', 'Saturday', 'Sunday'],
    difficulty: 'easy',
    tags: ['sale', 'promo', 'discount', 'limited'],
    suggestedMusic: {
      mood: 'urgent',
      bpm: '140-160',
      genres: ['electronic', 'hype']
    },
    scenes: [
      {
        id: 'promo-offer',
        type: 'hook',
        name: 'The Offer',
        duration: 3,
        defaultText: '🚨 FLASH SALE 🚨 50% OFF!',
        textPosition: 'center',
        textStyle: 'neon',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/promo/offer.jpg',
          instructions: 'Bold sale announcement'
        }
      },
      {
        id: 'promo-product',
        type: 'demo',
        name: 'Product',
        duration: 5,
        defaultText: 'Get [product] at the best price ever!',
        textPosition: 'bottom',
        textStyle: 'bold',
        transition: 'slide',
        placeholder: {
          imageUrl: '/templates/promo/product.jpg',
          instructions: 'Product showcase'
        }
      },
      {
        id: 'promo-urgency',
        type: 'cta',
        name: 'Urgency CTA',
        duration: 4,
        defaultText: '⏰ LIMITED TIME! Shop now! 🔗',
        textPosition: 'center',
        textStyle: 'neon',
        transition: 'zoom',
        placeholder: {
          imageUrl: '/templates/promo/urgency.jpg',
          instructions: 'Countdown/urgency visual'
        }
      }
    ]
  }
]

// Helper functions
export function getTemplateById(id: string): VideoTemplateStructure | undefined {
  return VIDEO_TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByCategory(category: TemplateCategory): VideoTemplateStructure[] {
  return VIDEO_TEMPLATES.filter(t => t.category === category)
}

export function getRecommendedTemplatesForDay(day: string): VideoTemplateStructure[] {
  return VIDEO_TEMPLATES.filter(t => t.conversionDay?.includes(day))
}

export function getCurrentDayName(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' })
}

export function getTodaysRecommendedTemplates(): VideoTemplateStructure[] {
  const today = getCurrentDayName()
  return getRecommendedTemplatesForDay(today)
}
