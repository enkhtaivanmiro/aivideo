import { connectToDB } from '@/lib/mongodb';
import Video from '@/models/Video';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    await connectToDB();

    const cookie = req.cookies.get('token')?.value 
      || req.cookies.get('idToken')?.value;

    if (!cookie) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
    }

    const decoded = jwt.decode(cookie);
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const videos = await Video.find({ userId });

    const response = videos.map(v => ({
      id: v._id.toString(),
      videoKey: v.videoKey,
      url: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${v.videoKey}`,
      title: v.title,
      userId: v.userId,
      labels: v.reviewLabel,
      createdAt: v.createdAt,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Fetch user videos error:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
