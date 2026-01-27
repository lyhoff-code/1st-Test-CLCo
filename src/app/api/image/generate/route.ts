import { NextRequest, NextResponse } from 'next/server'
import { StorytellingSceneType } from '@/types'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface ImageGenerateRequest {
  prompt: string
  sceneType: StorytellingSceneType
  productName: string
}

const SCENE_STYLE_MODIFIERS: Record<StorytellingSceneType, string> = {
  hook: 'dramatic lighting, attention-grabbing, high contrast, social media style, vertical format 9:16',
  problem: 'moody atmosphere, relatable everyday setting, natural lighting, documentary style',
  agitation: 'tense mood, dramatic shadows, emotional intensity, cinematic feel',
  solution: 'bright optimistic lighting, hero shot, clean modern aesthetic, product showcase',
  result: 'warm golden hour lighting, lifestyle photography, genuine happiness, aspirational',
  cta: 'minimal clean background, soft lighting, inviting composition, product beauty shot',
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerateRequest = await request.json()
    const { prompt, sceneType, productName } = body

    if (!prompt || !sceneType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If OpenAI is not configured, return placeholder image
    if (!OPENAI_API_KEY) {
      const placeholderUrl = getPlaceholderImage(sceneType)
      return NextResponse.json({ imageUrl: placeholderUrl })
    }

    const styleModifier = SCENE_STYLE_MODIFIERS[sceneType]
    const enhancedPrompt = `${prompt}. Style: ${styleModifier}. Product featured: ${productName}. Professional photography, high quality, suitable for social media content.`

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1792', // Vertical format for reels
        quality: 'standard',
        style: 'vivid',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI DALL-E error:', error)
      const placeholderUrl = getPlaceholderImage(sceneType)
      return NextResponse.json({ imageUrl: placeholderUrl })
    }

    const data = await response.json()
    const imageUrl = data.data[0]?.url

    if (!imageUrl) {
      const placeholderUrl = getPlaceholderImage(sceneType)
      return NextResponse.json({ imageUrl: placeholderUrl })
    }

    return NextResponse.json({ imageUrl })

  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Error generating image' },
      { status: 500 }
    )
  }
}

function getPlaceholderImage(sceneType: StorytellingSceneType): string {
  // High-quality Unsplash placeholder images for each scene type
  const placeholders: Record<StorytellingSceneType, string> = {
    hook: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=1400&fit=crop',
    problem: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=1400&fit=crop',
    agitation: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1400&fit=crop',
    solution: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=1400&fit=crop',
    result: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=1400&fit=crop',
    cta: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=1400&fit=crop',
  }

  return placeholders[sceneType]
}
