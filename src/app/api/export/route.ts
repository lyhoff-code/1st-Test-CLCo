import { NextRequest, NextResponse } from 'next/server'
import { exportToCapCut, isCapCutConfigured } from '@/lib/integrations/capcut'
import { exportToCanva, isCanvaConfigured } from '@/lib/integrations/canva'

interface ExportRequest {
  platform: 'capcut' | 'canva'
  title: string
  scenes: {
    text: string
    imageUrl?: string
    audioUrl?: string
    duration: number
  }[]
  templateId?: string
  format?: 'video' | 'image' | 'gif'
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json()
    const { platform, title, scenes, templateId, format } = body

    if (!title || !scenes || scenes.length === 0) {
      return NextResponse.json(
        { error: 'Title and scenes are required' },
        { status: 400 }
      )
    }

    if (platform === 'capcut') {
      const result = await exportToCapCut({
        title,
        scenes,
        templateId,
      })

      return NextResponse.json({
        success: result.success,
        platform: 'capcut',
        projectId: result.projectId,
        editUrl: result.editUrl,
        error: result.error,
        isConfigured: isCapCutConfigured(),
      })
    }

    if (platform === 'canva') {
      const result = await exportToCanva({
        title,
        content: scenes.map(s => ({
          text: s.text,
          imageUrl: s.imageUrl,
          position: 'center' as const,
        })),
        templateId,
        format: format || 'video',
      })

      return NextResponse.json({
        success: result.success,
        platform: 'canva',
        designId: result.designId,
        editUrl: result.editUrl,
        error: result.error,
        isConfigured: isCanvaConfigured(),
      })
    }

    return NextResponse.json(
      { error: 'Invalid platform. Use "capcut" or "canva".' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export content' },
      { status: 500 }
    )
  }
}

// Get integration status
export async function GET() {
  return NextResponse.json({
    capcut: {
      configured: isCapCutConfigured(),
      name: 'CapCut',
      description: 'Export to CapCut for professional video editing',
    },
    canva: {
      configured: isCanvaConfigured(),
      name: 'Canva',
      description: 'Export to Canva for design customization',
    },
  })
}
