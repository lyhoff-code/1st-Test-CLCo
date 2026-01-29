/**
 * CapCut Open Platform Integration
 *
 * To use this integration:
 * 1. Sign up at https://open.capcut.com/
 * 2. Create an application and get your credentials
 * 3. Add CAPCUT_APP_ID and CAPCUT_APP_SECRET to your environment variables
 */

const CAPCUT_API_BASE = 'https://open.capcut.com/api/v1'

interface CapCutTemplate {
  id: string
  name: string
  thumbnail: string
  duration: number
  category: string
}

interface CapCutExportData {
  title: string
  scenes: {
    text: string
    imageUrl?: string
    audioUrl?: string
    duration: number
  }[]
  templateId?: string
}

interface CapCutExportResult {
  success: boolean
  projectId?: string
  editUrl?: string
  error?: string
}

// Check if CapCut is configured
export function isCapCutConfigured(): boolean {
  return !!(process.env.CAPCUT_APP_ID && process.env.CAPCUT_APP_SECRET)
}

// Get CapCut templates
export async function getCapCutTemplates(category?: string): Promise<CapCutTemplate[]> {
  if (!isCapCutConfigured()) {
    // Return mock templates for demo
    return [
      { id: 'tpl_1', name: 'Product Showcase', thumbnail: '/templates/capcut-1.jpg', duration: 15, category: 'product' },
      { id: 'tpl_2', name: 'Story Time', thumbnail: '/templates/capcut-2.jpg', duration: 30, category: 'storytelling' },
      { id: 'tpl_3', name: 'Quick Promo', thumbnail: '/templates/capcut-3.jpg', duration: 10, category: 'promo' },
      { id: 'tpl_4', name: 'Tutorial Style', thumbnail: '/templates/capcut-4.jpg', duration: 60, category: 'education' },
    ]
  }

  try {
    const response = await fetch(`${CAPCUT_API_BASE}/templates?category=${category || 'all'}`, {
      headers: {
        'Authorization': `Bearer ${await getCapCutAccessToken()}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch templates')
    }

    const data = await response.json()
    return data.templates
  } catch (error) {
    console.error('CapCut API error:', error)
    return []
  }
}

// Export content to CapCut
export async function exportToCapCut(data: CapCutExportData): Promise<CapCutExportResult> {
  if (!isCapCutConfigured()) {
    // Simulate export for demo
    return {
      success: true,
      projectId: `demo_${Date.now()}`,
      editUrl: 'https://www.capcut.com/editor',
    }
  }

  try {
    const response = await fetch(`${CAPCUT_API_BASE}/projects/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getCapCutAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.title,
        template_id: data.templateId,
        clips: data.scenes.map((scene, index) => ({
          order: index,
          text_overlay: scene.text,
          media_url: scene.imageUrl,
          audio_url: scene.audioUrl,
          duration_ms: scene.duration * 1000,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create project')
    }

    const result = await response.json()
    return {
      success: true,
      projectId: result.project_id,
      editUrl: result.edit_url,
    }
  } catch (error) {
    console.error('CapCut export error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Export failed',
    }
  }
}

// Get access token (implement OAuth flow)
async function getCapCutAccessToken(): Promise<string> {
  // This would implement the OAuth token exchange
  // For now, return the stored token
  return process.env.CAPCUT_ACCESS_TOKEN || ''
}
