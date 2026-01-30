import { NextRequest, NextResponse } from 'next/server'
import { ShopifyProduct, ContentType, ToneType, Scene } from '@/types'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface GenerateScriptRequest {
  product: ShopifyProduct
  contentType: ContentType
  tone: ToneType
}

const DURATION_MAP: Record<ContentType, number> = {
  reel: 30,
  story: 15,
  post: 20,
  storytelling: 30,
  carousel: 0, // Carousel doesn't have duration, it's slides
  'video-to-shorts': 0, // Video-to-shorts is a conversion tool, not script generation
}

const TONE_INSTRUCTIONS: Record<ToneType, string> = {
  divertido: 'Use a casual, fun, and entertaining tone. Include wordplay and keep the energy high. Speak like an excited friend sharing a discovery.',
  profesional: 'Use a serious, professional, and corporate tone. Focus on benefits and technical features. Maintain a formal but accessible style.',
  educativo: 'Use an informative and educational tone. Explain benefits clearly, include interesting facts, and educate the viewer about the product.',
  emocional: 'Use an emotional, touching, and relatable tone. Tell stories that connect with feelings. Make the viewer feel understood.',
  urgente: 'Use an urgent, FOMO-driven tone. Create scarcity and urgency. Make them feel they need to act now or miss out.',
}

const CONTENT_INSTRUCTIONS: Record<ContentType, string> = {
  reel: 'Create a script for a 30-second vertical video. Must have a strong hook in the first 3 seconds, maintain interest, and end with a call-to-action.',
  story: 'Create a brief, direct script for a 15-second story. Must be impactful and get to the point quickly.',
  post: 'Create a script for a 20-second square video. Balance information with entertainment.',
  storytelling: 'Create a 30-second storytelling script following the Hook → Problem → Agitation → Solution → Result → CTA framework.',
  carousel: 'Create content for a 7-slide carousel: 1) Eye-catching cover title, 2) Problem statement, 3) Shocking stat or fact, 4) Product solution, 5) Key benefits, 6) Social proof/testimonial, 7) Call-to-action. Each slide needs a short impactful headline (max 10 words) and brief supporting text.',
  'video-to-shorts': 'This is a video conversion tool. Suggest captions, hashtags, and titles for extracted short clips.',
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateScriptRequest = await request.json()
    const { product, contentType, tone } = body

    if (!product || !contentType || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const duration = DURATION_MAP[contentType]

    // If OpenAI is not configured, generate a demo script
    if (!OPENAI_API_KEY) {
      const demoScript = generateDemoScript(product, contentType, tone, duration)
      return NextResponse.json(demoScript)
    }

    const systemPrompt = `You are an expert social media content creator specialized in e-commerce.
Your task is to create video scripts that effectively sell products.

${TONE_INSTRUCTIONS[tone]}
${CONTENT_INSTRUCTIONS[contentType]}

IMPORTANT:
- The script should last approximately ${duration} seconds when read aloud
- Divide the script into clear scenes (3-5 scenes)
- Each scene should have short, memorable text
- Do NOT include camera instructions or technical notes, only the text to be spoken
- ALL content must be in ENGLISH
- Respond ONLY with valid JSON in the following format:
{
  "script": "The complete script here",
  "scenes": [
    { "text": "Scene 1 text", "duration": 5 },
    { "text": "Scene 2 text", "duration": 8 }
  ]
}
`

    const userPrompt = `Create a script to promote this product:

Name: ${product.title}
Description: ${product.description || 'No description available'}
Price: $${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}

The script should be for a ${contentType} with ${tone} tone. All content must be in English.`

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
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI error:', error)
      // Fallback to demo script
      const demoScript = generateDemoScript(product, contentType, tone, duration)
      return NextResponse.json(demoScript)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    try {
      const parsed = JSON.parse(content)
      return NextResponse.json(parsed)
    } catch {
      // If parsing fails, return demo script
      const demoScript = generateDemoScript(product, contentType, tone, duration)
      return NextResponse.json(demoScript)
    }

  } catch (error) {
    console.error('Error generating script:', error)
    return NextResponse.json(
      { error: 'Error generating script' },
      { status: 500 }
    )
  }
}

function generateDemoScript(
  product: ShopifyProduct,
  contentType: ContentType,
  tone: ToneType,
  duration: number
): { script: string; scenes: Scene[] } {
  const scripts: Record<ToneType, (p: ShopifyProduct) => { script: string; scenes: Scene[] }> = {
    divertido: (p) => ({
      script: `Did you know ${p.title} can change your life? I'm not kidding! This product is so amazing you'll want to share it with everyone. For only $${p.priceRange.minVariantPrice.amount}, it's a steal. Treat yourself, you deserve it!`,
      scenes: [
        { text: `Did you know ${p.title} can change your life?`, duration: duration * 0.25 },
        { text: "I'm not kidding! This product is amazing", duration: duration * 0.25 },
        { text: `For only $${p.priceRange.minVariantPrice.amount}, it's a steal`, duration: duration * 0.25 },
        { text: 'Treat yourself, you deserve it!', duration: duration * 0.25 },
      ]
    }),
    profesional: (p) => ({
      script: `Introducing ${p.title}, the solution you've been looking for. ${p.description?.slice(0, 100) || 'Designed with the highest quality standards'}. Available now for $${p.priceRange.minVariantPrice.amount}. Invest in quality.`,
      scenes: [
        { text: `Introducing ${p.title}`, duration: duration * 0.3 },
        { text: p.description?.slice(0, 50) || 'Superior quality guaranteed', duration: duration * 0.3 },
        { text: `Available for $${p.priceRange.minVariantPrice.amount}`, duration: duration * 0.2 },
        { text: 'Invest in quality', duration: duration * 0.2 },
      ]
    }),
    educativo: (p) => ({
      script: `Today I'm going to show you why ${p.title} is different. ${p.description?.slice(0, 80) || 'This product stands out for its innovation and functionality'}. At $${p.priceRange.minVariantPrice.amount}, it's a smart investment. Learn more at our store!`,
      scenes: [
        { text: `Today I'll show you why ${p.title} is different`, duration: duration * 0.25 },
        { text: p.description?.slice(0, 40) || 'Innovation and functionality', duration: duration * 0.25 },
        { text: `Smart investment: $${p.priceRange.minVariantPrice.amount}`, duration: duration * 0.25 },
        { text: 'Learn more at our store!', duration: duration * 0.25 },
      ]
    }),
    emocional: (p) => ({
      script: `I still remember the day I found ${p.title}. It changed everything for me. ${p.description?.slice(0, 60) || 'Sometimes the smallest things make the biggest difference'}. For $${p.priceRange.minVariantPrice.amount}, it's not a purchase, it's a gift to yourself.`,
      scenes: [
        { text: `I still remember the day I found ${p.title}`, duration: duration * 0.25 },
        { text: 'It changed everything for me', duration: duration * 0.25 },
        { text: p.description?.slice(0, 40) || 'Small things, big differences', duration: duration * 0.25 },
        { text: `A gift to yourself: $${p.priceRange.minVariantPrice.amount}`, duration: duration * 0.25 },
      ]
    }),
    urgente: (p) => ({
      script: `STOP! You need to see this. ${p.title} is selling out FAST. ${p.description?.slice(0, 50) || 'Everyone is talking about it'}. Only $${p.priceRange.minVariantPrice.amount} - but not for long. Don't miss out!`,
      scenes: [
        { text: 'STOP! You need to see this', duration: duration * 0.25 },
        { text: `${p.title} is selling out FAST`, duration: duration * 0.25 },
        { text: `Only $${p.priceRange.minVariantPrice.amount} - but not for long`, duration: duration * 0.25 },
        { text: "Don't miss out! Link in bio", duration: duration * 0.25 },
      ]
    }),
  }

  return scripts[tone](product)
}
