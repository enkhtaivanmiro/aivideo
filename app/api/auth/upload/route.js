import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'


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
  try {
    const formData = await req.formData()
    const prompt = formData.get('prompt')
    const video = formData.get('video')

    if (!prompt || !video) {
      return NextResponse.json({ message: 'Missing prompt or video' }, { status: 400 })
    }

    const cookieStore = cookies()
    const cognitoIdToken = cookieStore.get('CognitoIdentityServiceProvider.2e3iko2tmgo88146l0sqb0nenm.b714aab8-b081-7061-45c7-a4e7b090f343.idToken')?.value
    const token = cookieStore.get('token')?.value || cognitoIdToken

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 })
    }

    const decoded = jwt.decode(token)
    const userId = decoded?.sub

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    const bytes = await video.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uniqueFileName = generateFileName(video.name)

    console.log('Uploading file with key:', `uploads/${userId}/${uniqueFileName}`)
    console.log('UserId:', userId)
    console.log('Video name:', video.name)
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${userId}/${uniqueFileName}`,
      Body: buffer,
      ContentType: video.type,
    })

    await s3.send(uploadCommand)

    return NextResponse.json({
      message: 'Upload successful',
      videoPath: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${userId}/${uniqueFileName}`,
      title: prompt,
      userId,
      labels: 'In Review',
    })
  } catch (err) {
    console.error('S3 Upload error:', err)
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 })
  }
}
