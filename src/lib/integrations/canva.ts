/**
 * Canva Connect API Integration
 *
 * To use this integration:
 * 1. Sign up at https://www.canva.com/developers/
 * 2. Create an application and get your credentials
 * 3. Add CANVA_CLIENT_ID and CANVA_CLIENT_SECRET to your environment variables
 */

const CANVA_API_BASE = 'https://api.canva.com/rest/v1'

interface CanvaTemplate {
  id: string
  name: string
  thumbnail: string
  width: number
  height: number
  category: string
}

interface CanvaExportData {
  title: string
  content: {
    text: string
    imageUrl?: string
    position: 'top' | 'center' | 'bottom'
  }[]
  templateId?: string
  format: 'video' | 'image' | 'gif'
}

interface CanvaExportResult {
  success: boolean
  designId?: string
  editUrl?: string
  downloadUrl?: string
  error?: string
}

// Check if Canva is configured
export function isCanvaConfigured(): boolean {
  return !!(process.env.CANVA_CLIENT_ID && process.env.CANVA_CLIENT_SECRET)
}

// Get Canva templates
export async function getCanvaTemplates(type: 'video' | 'instagram' | 'story'): Promise<CanvaTemplate[]> {
  if (!isCanvaConfigured()) {
    // Return mock templates for demo
    const mockTemplates: Record<string, CanvaTemplate[]> = {
      video: [
        { id: 'canva_v1', name: 'Modern Product Video', thumbnail: '/templates/canva-v1.jpg', width: 1080, height: 1920, category: 'video' },
        { id: 'canva_v2', name: 'Minimal Story', thumbnail: '/templates/canva-v2.jpg', width: 1080, height: 1920, category: 'video' },
      ],
      instagram: [
        { id: 'canva_i1', name: 'Instagram Reel', thumbnail: '/templates/canva-i1.jpg', width: 1080, height: 1920, category: 'instagram' },
        { id: 'canva_i2', name: 'Carousel Post', thumbnail: '/templates/canva-i2.jpg', width: 1080, height: 1080, category: 'instagram' },
      ],
      story: [
        { id: 'canva_s1', name: 'Story Template', thumbnail: '/templates/canva-s1.jpg', width: 1080, height: 1920, category: 'story' },
        { id: 'canva_s2', name: 'Story Animation', thumbnail: '/templates/canva-s2.jpg', width: 1080, height: 1920, category: 'story' },
      ],
    }
    return mockTemplates[type] || []
  }

  try {
    const response = await fetch(`${CANVA_API_BASE}/templates?type=${type}`, {
      headers: {
        'Authorization': `Bearer ${await getCanvaAccessToken()}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch templates')
    }

    const data = await response.json()
    return data.templates
  } catch (error) {
    console.error('Canva API error:', error)
    return []
  }
}

// Export content to Canva
export async function exportToCanva(data: CanvaExportData): Promise<CanvaExportResult> {
  if (!isCanvaConfigured()) {
    // Simulate export for demo
    return {
      success: true,
      designId: `demo_design_${Date.now()}`,
      editUrl: 'https://www.canva.com/design/new',
    }
  }

  try {
    // Create a new design
    const createResponse = await fetch(`${CANVA_API_BASE}/designs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getCanvaAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.title,
        template_id: data.templateId,
        design_type: data.format === 'video' ? 'video' : 'image',
      }),
    })

    if (!createResponse.ok) {
      throw new Error('Failed to create design')
    }

    const design = await createResponse.json()

    // Add content to design
    for (const item of data.content) {
      await fetch(`${CANVA_API_BASE}/designs/${design.id}/elements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getCanvaAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'text',
          text: item.text,
          position: item.position,
        }),
      })

      if (item.imageUrl) {
        await fetch(`${CANVA_API_BASE}/designs/${design.id}/elements`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await getCanvaAccessToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'image',
            url: item.imageUrl,
          }),
        })
      }
    }

    return {
      success: true,
      designId: design.id,
      editUrl: design.edit_url,
    }
  } catch (error) {
    console.error('Canva export error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    }
  }
}

// Download design from Canva
export async function downloadFromCanva(designId: string, format: 'mp4' | 'png' | 'gif'): Promise<CanvaExportResult> {
  if (!isCanvaConfigured()) {
    return {
      success: true,
      downloadUrl: `https://example.com/download/${designId}.${format}`,
    }
  }

  try {
    const response = await fetch(`${CANVA_API_BASE}/designs/${designId}/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getCanvaAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format }),
    })

    if (!response.ok) {
      throw new Error('Failed to export design')
    }

    const result = await response.json()
    return {
      success: true,
      downloadUrl: result.url,
    }
  } catch (error) {
    console.error('Canva download error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Download failed',
    }
  }
}

// Get access token (implement OAuth flow)
async function getCanvaAccessToken(): Promise<string> {
  return process.env.CANVA_ACCESS_TOKEN || ''
}
