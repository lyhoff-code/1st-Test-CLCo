import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface GeneratePromptsRequest {
  productName: string
  productDescription: string
  totalCuts: number
  videoStructure: string
  cutNames: string[]
  hasVoice: boolean
  language?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePromptsRequest = await request.json()
    const { productName, productDescription, totalCuts, videoStructure, cutNames, hasVoice, language = 'es' } = body

    if (!productName || !totalCuts || !videoStructure) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      // Demo mode: generate sample prompts
      const demoPrompts = cutNames.map((name, i) => ({
        cutIndex: i,
        cutName: name,
        imagePrompt: `Professional product photo of ${productName}, ${name.toLowerCase()} scene, studio lighting, clean background, high quality, 4K`,
        animationPrompt: `Smooth slow zoom in with subtle particle effects, cinematic motion, 4 seconds, seamless loop`,
        speechText: hasVoice ? `${name}: This is where you showcase ${productName} in a compelling way.` : '',
        hasVoice,
      }))
      return NextResponse.json({ prompts: demoPrompts, aiSuggestedStructure: videoStructure })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are an expert video content creator for e-commerce products. You generate precise prompts for AI image generation (like Grok Imagine or Midjourney), animation prompts, and voiceover scripts.

Your output must be ONLY valid JSON, no markdown, no code blocks, no explanations.

Rules for image prompts:
- Be very specific and descriptive
- Include lighting, composition, mood, camera angle
- Optimized for AI image generators (Grok Imagine, DALL-E, Midjourney style)
- Always mention the product naturally in the scene

Rules for animation prompts:
- Describe camera movement (zoom in, pan, tilt, etc.)
- Mention speed (slow, medium, fast)
- Include effects (particles, light rays, blur transitions)
- Keep it to ~4-8 seconds of animation

Rules for speech text:
- ${language === 'es' ? 'Write in Spanish' : 'Write in English'}
- Short, punchy, engaging
- Match the video structure style
- Each cut speech should be 2-4 seconds when spoken
- If hasVoice is false, return empty string for speechText

Product: ${productName}
Description: ${productDescription}
Video structure type: ${videoStructure}
Total cuts: ${totalCuts}
Cut names: ${cutNames.join(', ')}
Has voice: ${hasVoice}

Generate prompts for each cut. Return ONLY a JSON object with this exact structure:
{
  "prompts": [
    {
      "cutIndex": 0,
      "cutName": "Cut Name",
      "imagePrompt": "detailed image generation prompt",
      "animationPrompt": "detailed animation prompt",
      "speechText": "voiceover text for this cut",
      "hasVoice": true
    }
  ]${videoStructure === 'other' ? ',\n  "aiSuggestedStructure": "suggested_type"' : ''}
}

${videoStructure === 'other' ? 'First analyze the product and suggest the best video structure type, then generate the prompts accordingly.' : ''}`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    if (!text) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Clean response - remove markdown code blocks if present
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleanedText)
    const prompts = parsed.prompts || parsed
    const aiSuggestedStructure = parsed.aiSuggestedStructure || videoStructure

    return NextResponse.json({ prompts: Array.isArray(prompts) ? prompts : [prompts], aiSuggestedStructure })
  } catch (error) {
    console.error('Error generating prompts:', error)
    return NextResponse.json({ error: 'Failed to generate prompts' }, { status: 500 })
  }
}
