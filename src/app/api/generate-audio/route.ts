import { NextRequest, NextResponse } from 'next/server'
import { ToneType } from '@/types'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

interface GenerateAudioRequest {
  script: string
  tone: ToneType
}

// Voice IDs from ElevenLabs - you can customize these
const VOICE_MAP: Record<ToneType, string> = {
  divertido: 'pNInz6obpgDQGcFmaJgB', // Adam - energetic
  profesional: 'ErXwobaYiN019PkySvjV', // Antoni - professional
  educativo: 'VR6AewLTigWG4xSOukaG', // Arnold - clear and educational
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateAudioRequest = await request.json()
    const { script, tone } = body

    if (!script || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If ElevenLabs is not configured, use browser TTS fallback
    if (!ELEVENLABS_API_KEY) {
      // Return a special response indicating browser TTS should be used
      return NextResponse.json({
        audioUrl: null,
        useBrowserTTS: true,
        script: script,
        message: 'Usando Text-to-Speech del navegador. Configura ElevenLabs para voces premium.'
      })
    }

    const voiceId = VOICE_MAP[tone]

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: tone === 'divertido' ? 0.8 : 0.3,
            use_speaker_boost: true
          }
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs error:', error)
      // Fallback to browser TTS
      return NextResponse.json({
        audioUrl: null,
        useBrowserTTS: true,
        script: script
      })
    }

    // Convert audio to base64 data URL
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`

    return NextResponse.json({ audioUrl })

  } catch (error) {
    console.error('Error generating audio:', error)
    return NextResponse.json(
      {
        audioUrl: null,
        useBrowserTTS: true,
        error: 'Error generating audio, using browser TTS fallback'
      },
      { status: 200 } // Return 200 with fallback
    )
  }
}
