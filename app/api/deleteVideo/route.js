import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin"; 
import { generateDeletePresignedUrl } from "@/lib/s3Utils";

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

    const { filepath } = await req.json();
    if (!filepath) {
      console.error("Missing 'filepath' in the request body");
      return NextResponse.json(
        { error: "Missing 'filepath'" },
        { status: 400 }
      );
    }

    const deleteUrl = await generateDeletePresignedUrl(filepath);
    console.log("Presigned URL for delete generated successfully:", deleteUrl);

    return NextResponse.json({ deleteUrl }, { status: 200 });
  } catch (error) {
    console.error("Error in API endpoint:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
