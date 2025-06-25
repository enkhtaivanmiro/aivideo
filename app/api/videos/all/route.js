// app/api/videos/all/route.js
import { connectToDB } from '@/lib/mongodb';
import Video from '@/models/Video';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();

    const videos = await Video.find({});

    const response = videos.map((v) => ({
      key: v.videoKey,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${v.videoKey}`,
      title: v.title,
      uploadedBy: v.userId,
      createdAt: v.createdAt,
      reviewLabel: v.reviewLabel,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error('Failed to fetch all videos:', err);
    return NextResponse.json({ error: 'Failed to fetch all videos' }, { status: 500 });
  }
}
