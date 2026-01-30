import { NextResponse } from 'next/server'

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

export async function POST(req: Request) {
  try {
    const { productName, productDescription, productPrice } = await req.json()

    if (!productName) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }

    // If Perplexity API key is not configured, use Gemini for research
    if (!PERPLEXITY_API_KEY) {
      return await generateResearchWithGemini(productName, productDescription, productPrice)
    }

    // Use Perplexity API for real-time research
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a product research analyst specializing in social media marketing.
            Research the given product and provide actionable insights for creating viral content.
            Always respond in valid JSON format.`
          },
          {
            role: 'user',
            content: `Research this product for social media marketing:

Product: ${productName}
Description: ${productDescription || 'N/A'}
Price: ${productPrice || 'N/A'}

Provide research in this exact JSON format:
{
  "trends": ["current trend 1", "trend 2", "trend 3"],
  "competitors": ["competitor 1", "competitor 2"],
  "painPoints": ["pain point 1", "pain point 2", "pain point 3"],
  "benefits": ["benefit 1", "benefit 2", "benefit 3"],
  "targetAudience": "description of ideal customer",
  "marketInsights": "current market situation and opportunities",
  "viralAngles": ["viral angle 1", "viral angle 2", "viral angle 3"],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "hooks": ["attention-grabbing hook 1", "hook 2", "hook 3"]
}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('Perplexity API error:', response.status)
      return await generateResearchWithGemini(productName, productDescription, productPrice)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    try {
      const research = JSON.parse(content)
      return NextResponse.json({ research, source: 'perplexity' })
    } catch {
      return await generateResearchWithGemini(productName, productDescription, productPrice)
    }

  } catch (error) {
    console.error('Research error:', error)
    return NextResponse.json(
      { error: 'Failed to research product' },
      { status: 500 }
    )
  }
}

async function generateResearchWithGemini(productName: string, productDescription?: string, productPrice?: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  if (!GEMINI_API_KEY) {
    // Return demo data if no API key
    return NextResponse.json({
      research: getDemoResearch(productName),
      source: 'demo'
    })
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a product research analyst for social media marketing.

Research this product and provide insights for creating viral content:

Product: ${productName}
Description: ${productDescription || 'N/A'}
Price: ${productPrice || 'N/A'}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "trends": ["3-5 current trends related to this product"],
  "competitors": ["2-3 main competitors or alternatives"],
  "painPoints": ["3-5 problems this product solves"],
  "benefits": ["3-5 key benefits"],
  "targetAudience": "detailed description of ideal customer",
  "marketInsights": "current market situation and opportunities",
  "viralAngles": ["3-5 angles that could go viral on social media"],
  "hashtags": ["10 relevant hashtags with # symbol"],
  "hooks": ["5 attention-grabbing hooks for videos/posts"]
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Clean the response
    let cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    try {
      const research = JSON.parse(cleanedText)
      return NextResponse.json({ research, source: 'gemini' })
    } catch {
      return NextResponse.json({
        research: getDemoResearch(productName),
        source: 'demo'
      })
    }
  } catch (error) {
    console.error('Gemini research error:', error)
    return NextResponse.json({
      research: getDemoResearch(productName),
      source: 'demo'
    })
  }
}

function getDemoResearch(productName: string) {
  return {
    trends: [
      `${productName} gaining popularity on TikTok`,
      'Minimalist lifestyle trend',
      'Sustainable and eco-friendly products trending',
      'Self-care and wellness focus',
      'Work-from-home essentials'
    ],
    competitors: [
      'Similar products on Amazon',
      'Direct-to-consumer brands',
      'Traditional retail alternatives'
    ],
    painPoints: [
      'Frustration with low-quality alternatives',
      'Wasted time searching for the right solution',
      'Previous purchases that disappointed',
      'Need for convenience and efficiency',
      'Desire for premium quality at fair price'
    ],
    benefits: [
      'Saves time and effort',
      'Premium quality materials',
      'Easy to use and maintain',
      'Great value for money',
      'Improves daily routine'
    ],
    targetAudience: `People aged 25-45 who value quality and convenience, active on social media, willing to invest in products that improve their lifestyle`,
    marketInsights: `Growing market with increasing demand for quality products. Customers are moving away from cheap alternatives and seeking reliable solutions. Social proof and authentic reviews drive purchasing decisions.`,
    viralAngles: [
      'Before/after transformation',
      '"I wish I found this sooner" narrative',
      'Satisfying unboxing experience',
      'Day in my life featuring the product',
      'Comparison with competitors'
    ],
    hashtags: [
      `#${productName.replace(/\s+/g, '')}`,
      '#MustHave',
      '#TikTokMadeMeBuyIt',
      '#LifeHack',
      '#GameChanger',
      '#QualityProducts',
      '#ShopSmall',
      '#Trending',
      '#Viral',
      '#Recommendation'
    ],
    hooks: [
      `Stop scrolling! ${productName} changed everything...`,
      `POV: You finally found THE ${productName}`,
      `Why is nobody talking about this?`,
      `I was today years old when I discovered this...`,
      `The ${productName} that broke the internet`
    ]
  }
}
