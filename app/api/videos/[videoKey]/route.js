import { connectToDB } from '@/lib/mongodb';
import Video from '@/models/Video';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    const { videoKey } = params;
    const { action } = await req.json();

    if (!videoKey || !['accept', 'reject'].includes(action)) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    await connectToDB();

    const reviewLabel = action === 'accept' ? 'Accepted' : 'Rejected';

    const updatedVideo = await Video.findOneAndUpdate(
      { videoKey },
      { reviewLabel },
      { new: true }
    );

    if (!updatedVideo) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ message: `${reviewLabel} successfully`, video: updatedVideo });
  } catch (err) {
    console.error('Review update error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
