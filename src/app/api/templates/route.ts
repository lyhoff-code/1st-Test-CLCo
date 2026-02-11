import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'src/data/templates.json')

async function readTemplates() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeTemplates(templates: unknown[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(templates, null, 2))
}

export async function GET() {
  const templates = await readTemplates()
  return NextResponse.json({ templates })
}

export async function POST(request: NextRequest) {
  try {
    const template = await request.json()
    const templates = await readTemplates()

    const newTemplate = {
      ...template,
      id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    templates.push(newTemplate)
    await writeTemplates(templates)

    return NextResponse.json({ template: newTemplate })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updated = await request.json()
    const templates = await readTemplates()
    const index = templates.findIndex((t: { id: string }) => t.id === updated.id)

    if (index === -1) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    templates[index] = { ...templates[index], ...updated, updatedAt: new Date().toISOString() }
    await writeTemplates(templates)

    return NextResponse.json({ template: templates[index] })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const templates = await readTemplates()
    const filtered = templates.filter((t: { id: string }) => t.id !== id)
    await writeTemplates(filtered)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
