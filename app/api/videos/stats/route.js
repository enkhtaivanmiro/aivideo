import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Video from '@/models/Video';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('idToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.decode(token);
    const userId = decoded?.sub;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const videos = await Video.find({ userId });

    const stats = {
      Uploaded: videos.length,
      Accepted: videos.filter(v => v.reviewLabel === 'Accepted').length,
      Rejected: videos.filter(v => v.reviewLabel === 'Rejected').length,
      Review: videos.filter(v => v.reviewLabel === 'In Review').length,
    };

    return NextResponse.json(stats);
  } catch (err) {
    console.error('[API] /api/videos/stats error:', err);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
