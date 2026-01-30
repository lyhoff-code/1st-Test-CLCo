import { NextRequest, NextResponse } from 'next/server'
import { ToneType, STORYTELLING_SCENES } from '@/types'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface StorytellingRequest {
  product: {
    title: string
    description: string
    price: string
  }
  tone: ToneType
}

const TONE_INSTRUCTIONS: Record<ToneType, string> = {
  divertido: 'Use a casual, fun, and entertaining tone. Keep the energy high. Speak like an excited friend sharing a discovery.',
  profesional: 'Use a serious, professional, and polished tone. Focus on benefits and value. Maintain a formal but approachable style.',
  educativo: 'Use an informative and educational tone. Explain benefits clearly, include interesting insights, and educate the viewer.',
  emocional: 'Use an emotional, touching, and relatable tone. Tell stories that connect with feelings. Make the viewer feel understood and seen.',
  urgente: 'Use an urgent, FOMO-driven tone. Create scarcity and urgency. Make them feel they need to act now or miss out.',
}

export async function POST(request: NextRequest) {
  try {
    const body: StorytellingRequest = await request.json()
    const { product, tone } = body

    if (!product || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If OpenAI is not configured, generate demo scripts
    if (!OPENAI_API_KEY) {
      const demoScenes = generateDemoScenes(product.title, product.description)
      return NextResponse.json({ scenes: demoScenes })
    }

    const sceneDescriptions = STORYTELLING_SCENES.map(scene =>
      `${scene.title} (${scene.timeRange}): ${scene.promptGuidance}`
    ).join('\n')

    const systemPrompt = `You are an expert social media content creator specialized in storytelling for e-commerce products.
Your task is to create a 30-second story-driven video script with 6 distinct scenes following the HOOK → PROBLEM → AGITATION → SOLUTION → RESULT → CTA framework.

${TONE_INSTRUCTIONS[tone]}

SCENE STRUCTURE:
${sceneDescriptions}

CRITICAL RULES:
- ALL text must be in ENGLISH
- Each scene should flow naturally into the next
- The HOOK must stop the scroll immediately
- The CTA must be SOFT and CONVERSATIONAL - use curiosity, invitation, or questions
- NEVER use "Buy now", "Get it here", "Order today", "Shop now" or similar hard sells
- Good CTA examples: "Curious?", "Link in bio", "Let me know what you think", "Want to try it?"

Respond ONLY with valid JSON in this exact format:
{
  "scenes": [
    { "script": "Hook text here", "imagePrompt": "Detailed image description for AI generation" },
    { "script": "Problem text here", "imagePrompt": "Detailed image description for AI generation" },
    { "script": "Agitation text here", "imagePrompt": "Detailed image description for AI generation" },
    { "script": "Solution text here", "imagePrompt": "Detailed image description for AI generation" },
    { "script": "Result text here", "imagePrompt": "Detailed image description for AI generation" },
    { "script": "CTA text here", "imagePrompt": "Detailed image description for AI generation" }
  ]
}`

    const userPrompt = `Create a storytelling script for this product:

Product Name: ${product.title}
Description: ${product.description || 'A quality product designed to solve everyday problems'}
Price: $${product.price}

Generate all 6 scenes in English following the storytelling framework.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI error:', error)
      const demoScenes = generateDemoScenes(product.title, product.description)
      return NextResponse.json({ scenes: demoScenes })
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    try {
      const parsed = JSON.parse(content)
      return NextResponse.json(parsed)
    } catch {
      const demoScenes = generateDemoScenes(product.title, product.description)
      return NextResponse.json({ scenes: demoScenes })
    }

  } catch (error) {
    console.error('Error generating storytelling script:', error)
    return NextResponse.json(
      { error: 'Error generating storytelling script' },
      { status: 500 }
    )
  }
}

function generateDemoScenes(productName: string, productDescription: string) {
  return [
    {
      script: `Stop scrolling! This changed everything for me...`,
      imagePrompt: `Dramatic close-up of ${productName}, eye-catching lighting, social media style, attention-grabbing composition`,
    },
    {
      script: `You know that feeling when nothing seems to work? When you've tried everything but still can't get the results you want?`,
      imagePrompt: `Person looking frustrated or disappointed, ${productName} visible in background, moody natural lighting, relatable everyday scene`,
    },
    {
      script: `I was stuck in that cycle for months. Wasting time, money, and energy on things that just didn't deliver.`,
      imagePrompt: `Visual representation of frustration and wasted effort, cluttered workspace or tired expression, ${productName} subtly visible, dramatic shadows`,
    },
    {
      script: `Then I discovered ${productName}. It's not just another product – it's a complete game-changer. Here's what makes it different...`,
      imagePrompt: `${productName} being used in action, bright optimistic lighting, hero shot, clean modern setting, product as the star`,
    },
    {
      script: `Now I can't imagine going back. The transformation has been incredible, and the best part? It was so easy to get started.`,
      imagePrompt: `Happy person using ${productName} in their daily life, warm natural lighting, lifestyle photography, genuine smile, cozy environment`,
    },
    {
      script: `Curious to see if it works for you too? Link in bio. Let me know what you think!`,
      imagePrompt: `${productName} displayed beautifully on simple background, soft inviting composition, minimal and clean, call-to-action aesthetic`,
    },
  ]
}
