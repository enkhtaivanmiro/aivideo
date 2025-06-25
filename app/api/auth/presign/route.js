import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function POST(req) {
  const { filename, contentType } = await req.json()

  if (!filename || !contentType) {
    return new Response(JSON.stringify({ message: 'Missing filename or contentType' }), { status: 400 })
  }

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${filename}`,
    ContentType: contentType,
  })

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 })

  return new Response(JSON.stringify({ url: signedUrl }))
}
