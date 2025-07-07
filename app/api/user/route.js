import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION;

const s3 = new S3Client({ region: REGION });

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const prefix = `uploads/${userId}/videos/`;

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
    });

    const listResult = await s3.send(listCommand);

    if (!listResult.Contents || listResult.Contents.length === 0) {
      return NextResponse.json([]);
    }

    const videos = await Promise.all(
      listResult.Contents.filter((obj) => obj.Key.endsWith(".mp4")).map(async (obj) => {
        const signedUrl = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: BUCKET,
            Key: obj.Key,
          }),
          { expiresIn: 3600 }
        );

        return {
          videoKey: obj.Key,
          url: signedUrl,
          title: obj.Key.split("/").pop(),
          userId,
          labels: "In Review",
        };
      })
    );

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
