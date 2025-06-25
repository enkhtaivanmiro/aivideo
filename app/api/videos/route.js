import { connectToDB } from '@/lib/mongodb';
import Video from '@/models/Video';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();

    const videos = await Video.find({ reviewLabel: 'Accepted' });
    console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);
    console.log("AWS_REGION:", process.env.AWS_REGION);
    const response = videos.map((v) => ({
      key: v.videoKey,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${v.videoKey}`,
      title: v.title,
      uploadedBy: v.userId,
      createdAt: v.createdAt,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error('Failed to fetch videos:', err);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
