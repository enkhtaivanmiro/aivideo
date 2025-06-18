import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFile, writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'
import crypto from 'crypto'

const filePath = path.join(process.cwd(), 'data', 'videoList.json')

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

function generateFileName(originalName) {
  const ext = originalName.split('.').pop()
  return `${crypto.randomUUID()}.${ext}`
}

export async function POST(req) {
  const formData = await req.formData()
  const prompt = formData.get('prompt')
  const video = formData.get('video')

  if (!prompt || !video) {
    return NextResponse.json({ message: 'Missing prompt or video' }, { status: 400 })
  }

  const bytes = await video.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const uniqueFileName = generateFileName(video.name)

  try {
    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uniqueFileName}`,
      Body: buffer,
      ContentType: video.type,
    })

    await s3.send(uploadCommand)

    const jsonData = await readFile(filePath, 'utf-8')
    const videoList = JSON.parse(jsonData)

    const newVideo = {
      id: Date.now(),
      title: prompt,
      image: '/images/cover.webp',
      labels: ['In Review'],
      videoPath: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFileName}`,
    }

    videoList.push(newVideo)
    await writeFile(filePath, JSON.stringify(videoList, null, 2))

    return NextResponse.json({ message: 'Upload successful' })
  } catch (err) {
    console.error('S3 Upload error:', err)
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 })
  }
}
