import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/splits')

async function ensureDir(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File
    const parts = parseInt(formData.get('parts') as string) || 2

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    await ensureDir(UPLOAD_DIR)

    // Save uploaded file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const inputFilename = `input-${Date.now()}.mp4`
    const inputPath = path.join(UPLOAD_DIR, inputFilename)
    await fs.writeFile(inputPath, buffer)

    // Get video duration using ffprobe
    let duration: number
    try {
      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`
      )
      duration = parseFloat(stdout.trim())
    } catch {
      // Fallback: assume 8 seconds if ffprobe fails
      duration = 8
    }

    const partDuration = duration / parts
    const results = []

    // Split video into parts
    for (let i = 0; i < parts; i++) {
      const startTime = i * partDuration
      const outputFilename = `split-${Date.now()}-part${i + 1}.mp4`
      const outputPath = path.join(UPLOAD_DIR, outputFilename)

      try {
        await execAsync(
          `ffmpeg -y -i "${inputPath}" -ss ${startTime} -t ${partDuration} -c copy "${outputPath}"`
        )

        results.push({
          index: i,
          fileName: outputFilename,
          startTime: Math.round(startTime * 100) / 100,
          endTime: Math.round((startTime + partDuration) * 100) / 100,
          duration: Math.round(partDuration * 100) / 100,
          url: `/uploads/splits/${outputFilename}`,
          selected: true,
        })
      } catch (error) {
        console.error(`Error splitting part ${i + 1}:`, error)
      }
    }

    // Clean up input file
    try {
      await fs.unlink(inputPath)
    } catch {
      // Ignore cleanup errors
    }

    return NextResponse.json({
      totalDuration: Math.round(duration * 100) / 100,
      parts: results,
    })
  } catch (error) {
    console.error('Error splitting video:', error)
    return NextResponse.json({ error: 'Failed to split video' }, { status: 500 })
  }
}
