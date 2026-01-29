import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AssistantRequest {
  message: string
  productName?: string
  productDescription?: string
  conversationHistory?: Message[]
}

const SYSTEM_PROMPT = `You are an expert Content Marketing Assistant specialized in social media content creation, specifically for e-commerce and product marketing. Your name is "Content Assistant" and you're part of Tada.media.

Your expertise includes:
- Creating viral hooks for Reels, TikTok, and Stories
- Writing persuasive product descriptions and scripts
- Hashtag strategies for maximum reach
- Understanding social media algorithms
- Target audience analysis
- Content calendars and posting strategies
- Storytelling frameworks (Hook → Problem → Agitation → Solution → Result → CTA)
- Trending content formats and sounds

Personality:
- Friendly and enthusiastic
- Give actionable, specific advice
- Use bullet points and clear formatting
- Include examples when helpful
- Keep responses concise but valuable
- Use emojis sparingly to add warmth

When the user has a product:
- Tailor your suggestions to their specific product
- Consider their target audience
- Suggest content angles that highlight product benefits

Always respond in the same language the user writes in (English or Spanish).`

export async function POST(request: NextRequest) {
  try {
    const body: AssistantRequest = await request.json()
    const { message, productName, productDescription, conversationHistory } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // If Gemini is not configured, return a helpful fallback response
    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        response: getFallbackResponse(message),
      })
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Build context with product info if available
    let contextMessage = SYSTEM_PROMPT
    if (productName || productDescription) {
      contextMessage += `\n\nCurrent product context:
- Product Name: ${productName || 'Not specified'}
- Description: ${productDescription || 'Not specified'}`
    }

    // Build conversation history for context
    const historyParts = conversationHistory?.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })) || []

    // Start chat with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: contextMessage }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood! I\'m your Content Assistant, ready to help you create amazing social media content. What can I help you with?' }],
        },
        ...historyParts.slice(0, -1), // Exclude the current message
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    })

    const result = await chat.sendMessage(message)
    const response = result.response.text()

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Assistant error:', error)
    return NextResponse.json(
      { response: "I'm having trouble processing that right now. Please try again in a moment." },
      { status: 200 } // Return 200 with error message for better UX
    )
  }
}

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('hook') || lowerMessage.includes('gancho')) {
    return `Here are some powerful hook formulas:

**Pattern Interrupts:**
• "Stop scrolling if you..."
• "Nobody's talking about this..."
• "Wait, this actually works?"

**Curiosity Gaps:**
• "The secret to [result] is..."
• "I tried [thing] for 30 days and..."
• "What happens when you [action]?"

**Controversial Openers:**
• "Unpopular opinion: [statement]"
• "[Common advice] is actually wrong"
• "This changed everything for me"

Try these formats for your next video!`
  }

  if (lowerMessage.includes('hashtag')) {
    return `**Hashtag Strategy for Maximum Reach:**

**Mix these 3 types:**
1. **Big hashtags** (1M+ posts) - 2-3 tags
2. **Medium hashtags** (100K-1M) - 3-5 tags
3. **Niche hashtags** (10K-100K) - 5-7 tags

**Best practices:**
• Use 20-25 hashtags on Instagram
• Use 3-5 on TikTok
• Put them in comments (Instagram) or description (TikTok)
• Create a branded hashtag for your products

Research trending hashtags in your niche using the search function!`
  }

  if (lowerMessage.includes('viral') || lowerMessage.includes('trending')) {
    return `**What Makes Content Go Viral:**

**Key elements:**
• Strong hook in first 1-3 seconds
• Emotional trigger (surprise, joy, curiosity)
• Easy to share/relate to
• Good audio (trending sounds help!)
• Call to action that encourages engagement

**Current trends:**
• Before/after transformations
• "Day in my life" content
• Tutorial with personality
• Storytelling with twists
• POV/roleplay content

Would you like me to suggest specific content angles for your product?`
  }

  return `I'd love to help with that! Here are some things I can assist with:

• **Content Ideas** - Creative angles for your products
• **Hook Writing** - Attention-grabbing openers
• **Hashtag Strategy** - Maximize your reach
• **Script Improvement** - Make content more engaging
• **Viral Tips** - What makes content shareable
• **Target Audience** - Who to create content for

To give you the best advice, tell me more about:
1. What product/service are you promoting?
2. What platform are you focusing on?
3. What's your current challenge?`
}
