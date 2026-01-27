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
}

const TONE_INSTRUCTIONS: Record<ToneType, string> = {
  divertido: 'Usa un tono casual, divertido y entretenido. Incluye emojis mentales, juegos de palabras y mantén la energía alta. Habla como si fueras un amigo emocionado.',
  profesional: 'Usa un tono serio, profesional y corporativo. Enfócate en los beneficios y características técnicas. Mantén un estilo formal pero accesible.',
  educativo: 'Usa un tono informativo y didáctico. Explica los beneficios de forma clara, incluye datos interesantes y educa al espectador sobre el producto.',
}

const CONTENT_INSTRUCTIONS: Record<ContentType, string> = {
  reel: 'Crea un guion para un video vertical de 30 segundos. Debe tener un gancho fuerte en los primeros 3 segundos, mantener el interés y terminar con un call-to-action.',
  story: 'Crea un guion breve y directo para un story de 15 segundos. Debe ser impactante e ir al grano rápidamente.',
  post: 'Crea un guion para un video cuadrado de 20 segundos. Equilibra información con entretenimiento.',
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

    const systemPrompt = `Eres un experto creador de contenido para redes sociales especializado en e-commerce.
Tu tarea es crear guiones de video que vendan productos de forma efectiva.

${TONE_INSTRUCTIONS[tone]}
${CONTENT_INSTRUCTIONS[contentType]}

IMPORTANTE:
- El guion debe durar aproximadamente ${duration} segundos cuando se lee en voz alta
- Divide el guion en escenas claras (3-5 escenas)
- Cada escena debe tener un texto corto y memorable
- NO incluyas instrucciones de cámara o técnicas, solo el texto que se dirá
- Responde SOLO con JSON válido en el siguiente formato:
{
  "script": "El guion completo aquí",
  "scenes": [
    { "text": "Texto de la escena 1", "duration": 5 },
    { "text": "Texto de la escena 2", "duration": 8 }
  ]
}
`

    const userPrompt = `Crea un guion para promocionar este producto:

Nombre: ${product.title}
Descripción: ${product.description || 'Sin descripción disponible'}
Precio: $${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}

El guion debe ser para un ${contentType} con tono ${tone}.`

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
      script: `¿Sabías que ${p.title} puede cambiar tu vida? ¡No es broma! Este producto es tan increíble que vas a querer compartirlo con todos. Por solo $${p.priceRange.minVariantPrice.amount}, es una ganga. ¡Date el gusto, te lo mereces!`,
      scenes: [
        { text: `¿Sabías que ${p.title} puede cambiar tu vida?`, duration: duration * 0.25 },
        { text: '¡No es broma! Este producto es increíble', duration: duration * 0.25 },
        { text: `Por solo $${p.priceRange.minVariantPrice.amount}, es una ganga`, duration: duration * 0.25 },
        { text: '¡Date el gusto, te lo mereces!', duration: duration * 0.25 },
      ]
    }),
    profesional: (p) => ({
      script: `Presentamos ${p.title}, la solución que estabas buscando. ${p.description?.slice(0, 100) || 'Diseñado con los más altos estándares de calidad'}. Disponible ahora por $${p.priceRange.minVariantPrice.amount}. Invierte en calidad.`,
      scenes: [
        { text: `Presentamos ${p.title}`, duration: duration * 0.3 },
        { text: p.description?.slice(0, 50) || 'Calidad superior garantizada', duration: duration * 0.3 },
        { text: `Disponible por $${p.priceRange.minVariantPrice.amount}`, duration: duration * 0.2 },
        { text: 'Invierte en calidad', duration: duration * 0.2 },
      ]
    }),
    educativo: (p) => ({
      script: `Hoy te voy a enseñar por qué ${p.title} es diferente. ${p.description?.slice(0, 80) || 'Este producto destaca por su innovación y funcionalidad'}. Con un precio de $${p.priceRange.minVariantPrice.amount}, es una inversión inteligente. ¡Aprende más en nuestra tienda!`,
      scenes: [
        { text: `Hoy te enseño por qué ${p.title} es diferente`, duration: duration * 0.25 },
        { text: p.description?.slice(0, 40) || 'Innovación y funcionalidad', duration: duration * 0.25 },
        { text: `Inversión inteligente: $${p.priceRange.minVariantPrice.amount}`, duration: duration * 0.25 },
        { text: '¡Aprende más en nuestra tienda!', duration: duration * 0.25 },
      ]
    }),
  }

  return scripts[tone](product)
}
