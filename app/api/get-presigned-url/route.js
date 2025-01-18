import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return NextResponse.json({ error: 'File path is required' }, { status: 400 });
  }

  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath,
      Expires: 60, 
    };

    const url = s3.getSignedUrl('getObject', params);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json({ error: 'Error generating URL' }, { status: 500 });
  }
}
