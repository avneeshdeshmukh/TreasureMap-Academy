import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin"; // Your Firebase admin config
import { generatePresignedUrl } from "@/lib/s3Utils"; // Your S3 helper for presigned URL

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  const idToken = authHeader?.split(" ")[1];

  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { filepath } = await req.json();

    // Optional: Add additional checks like course access or progress
    console.log("User ID:", decodedToken.uid);

    // Generate a presigned URL for the video
    const videoUrl = await generatePresignedUrl(filepath);
    return NextResponse.json({ videoUrl }, { status: 200 });
  } catch (error) {
    console.error("Error details:", error);

    // Handle Firebase token verification errors
    if (error.code === "auth/argument-error") {
      console.error("Firebase token verification failed.");
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
