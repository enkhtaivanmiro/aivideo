export async function GET() {
  try {
    console.log('Connecting to DB...');
    await connectToDB();
    console.log('Connected to DB.');

    const videos = await Video.find({});
    console.log('Fetched videos:', videos.length);

    const bucket = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    if (!bucket || !region) {
      console.error('Missing AWS env vars:', { bucket, region });
      throw new Error('Missing AWS environment variables');
    }

    const response = videos.map((v) => ({
      key: v.videoKey,
      url: `https://${bucket}.s3.${region}.amazonaws.com/${v.videoKey}`,
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
