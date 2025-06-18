import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const REGION = 'ap-northeast-1';
const BUCKET_NAME = 'aivideo-bucket';

const s3Client = new S3Client({
  region: REGION,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'uploads/',
    });

    const response = await s3Client.send(command);

    const videos = (response.Contents || []).map((obj) => {
      const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${obj.Key}`;
      return {
        key: obj.Key,
        url,
        lastModified: obj.LastModified,
        size: obj.Size,
      };
    });

    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error listing S3 objects:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to list videos' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
