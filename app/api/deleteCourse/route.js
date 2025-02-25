import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { deleteFolderFromS3 } from "@/lib/s3Utils";

export async function POST(req) {
  const authHeader = req.headers.get("authorization");
  const idToken = authHeader?.split(" ")[1];

  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("Firebase token verified. User ID:", decodedToken.uid);

    const { folderPath } = await req.json();
    if (!folderPath) {
      return NextResponse.json({ error: "Missing 'folderPath'" }, { status: 400 });
    }

    const deleteResult = await deleteFolderFromS3(folderPath);
    console.log("Folder deleted successfully:", deleteResult);

    return NextResponse.json({ message: "Folder and subfolders deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in API endpoint:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
