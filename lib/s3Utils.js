import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const generatePresignedUrl = async (filepath) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, 
    Key: filepath,
  };

  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
};

export const generateUploadPresignedUrl = async (filepath, contentType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filepath,
    ContentType: contentType, 
  };

  try {
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating upload presigned URL:", error);
    throw error;
  }
};

export const generateDeletePresignedUrl = async (filepath) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, 
    Key: filepath,
  };

  try {
    const command = new DeleteObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating delete presigned URL:", error);
    throw error;
  }
};

export const deleteFolderFromS3 = async (folderPath) => {
  const prefix = folderPath.endsWith("/") ? folderPath : `${folderPath}/`;
  let isTruncated = true;
  let continuationToken = null;

  try {
    while (isTruncated) {
      // List all objects under the folder
      const listParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken, // Handle pagination
      };

      const listResponse = await s3.send(new ListObjectsV2Command(listParams));

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        return { message: "No objects found in folder." };
      }

      // Delete all listed objects
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
          Objects: listResponse.Contents.map((obj) => ({ Key: obj.Key })),
        },
      };

      await s3.send(new DeleteObjectsCommand(deleteParams));
      console.log(`Deleted ${listResponse.Contents.length} objects from ${folderPath}`);

      isTruncated = listResponse.IsTruncated;
      continuationToken = listResponse.NextContinuationToken;
    }

    return { success: true, message: "Folder and all subfolders deleted successfully." };
  } catch (error) {
    console.error("Error deleting folder from S3:", error);
    throw error;
  }
};