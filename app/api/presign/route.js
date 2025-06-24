import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

function generateFileName(originalName) {
  const ext = originalName?.split('.').pop() || 'bin'
  return `${crypto.randomUUID()}.${ext}`
}

export async function POST(req) {
  try {
    const { originalFilename, contentType } = await req.json()

    if (!originalFilename || !contentType) {
      return NextResponse.json({ message: 'Missing filename or contentType' }, { status: 400 })
    }

    const cookieStore = await cookies()

    const allCookies = cookieStore.getAll()
    const idToken = allCookies.find((c) => c.name === 'idToken')?.value
    const token = idToken || cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 })
    }

    const decoded = jwt.decode(token)
    console.log('Decoded token:', decoded)

    const userId = decoded?.sub
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    const uniqueFileName = generateFileName(originalFilename)
    const key = `uploads/${userId}/${uniqueFileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(s3, command, { expiresIn: 60 })

    return NextResponse.json({ url, key, userId })
  } catch (error) {
    console.error('Presign error:', error)
    return NextResponse.json({ message: 'Failed to generate presigned URL' }, { status: 500 })
  }
}
