import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

// Default voice IDs - user can customize these
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB' // Adam

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({
        audioUrl: null,
        useBrowserTTS: true,
        text,
        message: 'ElevenLabs API key not configured. Add ELEVENLABS_API_KEY to .env',
      })
    }

    const selectedVoiceId = voiceId || DEFAULT_VOICE_ID

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs error:', error)
      return NextResponse.json({
        audioUrl: null,
        useBrowserTTS: true,
        text,
        error: 'ElevenLabs API error',
      })
    }

    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`

    return NextResponse.json({ audioUrl })
  } catch (error) {
    console.error('Error generating speech:', error)
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 })
  }
}
