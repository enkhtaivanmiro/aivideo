import { writeFile, readFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

const filePath = path.join(process.cwd(), 'data', 'videoList.json')

export async function POST(req) {
  const formData = await req.formData()
  const prompt = formData.get('prompt')
  const video = formData.get('video')

  if (!prompt || !video) {
    return NextResponse.json({ message: 'Missing prompt or video' }, { status: 400 })
  }

  const fileName = video.name
  const bytes = await video.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName)

  await writeFile(uploadPath, buffer)

  const jsonData = await readFile(filePath, 'utf-8')
  const videoList = JSON.parse(jsonData)

  const newVideo = {
    id: Date.now(),
    title: prompt,
    image: '/images/cover.webp',
    labels: ['In Review'],
    videoPath: `/uploads/${fileName}`,
  }

  videoList.push(newVideo)
  await writeFile(filePath, JSON.stringify(videoList, null, 2))

  return NextResponse.json({ message: 'Upload successful' })
}
