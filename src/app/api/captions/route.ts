import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'src/data/captions.json')

async function readCaptions() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeCaptions(captions: unknown[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(captions, null, 2))
}

export async function GET() {
  const captions = await readCaptions()
  return NextResponse.json({ captions })
}

export async function POST(request: NextRequest) {
  try {
    const captionData = await request.json()
    const captions = await readCaptions()

    const newCaption = {
      ...captionData,
      id: `cap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    captions.push(newCaption)
    await writeCaptions(captions)

    return NextResponse.json({ caption: newCaption })
  } catch (error) {
    console.error('Error creating caption:', error)
    return NextResponse.json({ error: 'Failed to create caption' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updated = await request.json()
    const captions = await readCaptions()
    const index = captions.findIndex((c: { id: string }) => c.id === updated.id)

    if (index === -1) {
      return NextResponse.json({ error: 'Caption not found' }, { status: 404 })
    }

    captions[index] = { ...captions[index], ...updated, updatedAt: new Date().toISOString() }
    await writeCaptions(captions)

    return NextResponse.json({ caption: captions[index] })
  } catch (error) {
    console.error('Error updating caption:', error)
    return NextResponse.json({ error: 'Failed to update caption' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    const captions = await readCaptions()
    const filtered = captions.filter((c: { id: string }) => c.id !== id)
    await writeCaptions(filtered)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting caption:', error)
    return NextResponse.json({ error: 'Failed to delete caption' }, { status: 500 })
  }
}
