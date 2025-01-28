import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin"; 
import { generateUploadPresignedUrl } from "@/lib/s3Utils";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  const idToken = authHeader?.split(" ")[1];

  if (!idToken) {
    console.error("No ID token found in the request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("Firebase token verified. User ID:", decodedToken.uid);

    const { filepath, contentType } = await req.json();
    if (!filepath || !contentType) {
      console.error("Missing 'filepath' or 'contentType' in the request body");
      return NextResponse.json(
        { error: "Missing 'filepath' or 'contentType'" },
        { status: 400 }
      );
    }

    const uploadUrl = await generateUploadPresignedUrl(filepath, contentType);
    console.log("Presigned URL generated successfully:", uploadUrl);

    return NextResponse.json({ uploadUrl }, { status: 200 });
  } catch (error) {
    console.error("Error in API endpoint:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}