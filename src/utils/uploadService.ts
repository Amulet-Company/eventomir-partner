import { apiRequest } from "./api-client";
import imageCompression from "browser-image-compression";

interface UploadResponse {
  publicUrl: string;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  publicUrl: string;
  mimeType: string;
}

/**
 * Uploads a file directly to the cloud (MinIO/S3) using a Presigned URL.
 * Includes client-side compression for images to prevent browser freezes and save bandwidth.
 */
export const uploadFileDirectly = async (
  file: File,
  folder: string,
): Promise<UploadResponse> => {
  let fileToUpload = file;
  let finalFileName = file.name;

  // 1. Client-Side Compression (for images only, skip GIFs to preserve animation)
  if (file.type.startsWith("image/") && file.type !== "image/gif") {
    // 🚨 Match the exact folder name your backend allows
    const isProfile = folder === "profileImage";

    const options = {
      maxSizeMB: isProfile ? 0.3 : 1.0, // 300KB for avatars, 1MB for covers/gallery
      maxWidthOrHeight: isProfile ? 600 : 1920,
      useWebWorker: true,
      fileType: "image/jpeg", // Normalize output to JPEG
    };

    try {
      const compressedBlob = await imageCompression(file, options);

      // 🚨 FIX: If we forced the file to be a JPEG, we MUST change the extension
      // to .jpg so the Node.js backend validation doesn't fail on a .png name.
      finalFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";

      // 🚨 FIX: Repackage the returned Blob back into a proper File object
      fileToUpload = new File([compressedBlob], finalFileName, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error(
        "Client-side compression failed, proceeding with original file:",
        error,
      );
      // Fallback to original file if compression fails
    }
  }

  // 2. Request the Presigned URL from Node.js Backend
  // 🚨 FIX: Ensure this matches your backend mount point (usually /api/upload, not /uploads)
  const urlResponse = await apiRequest<PresignedUrlResponse>({
    method: "post",
    url: "/api/uploads/presigned-url",
    data: {
      fileName: finalFileName,
      folder: folder,
    },
  });

  const { presignedUrl, publicUrl, mimeType } = urlResponse;

  // 3. Upload directly to Cloud Storage via PUT request
  // Using native fetch because Axios intercepts and we don't want to send our Auth header to MinIO
  const uploadResult = await fetch(presignedUrl, {
    method: "PUT",
    body: fileToUpload,
    headers: {
      "Content-Type": mimeType || fileToUpload.type,
    },
  });

  if (!uploadResult.ok) {
    throw new Error(
      `Failed to upload file to storage bucket: ${uploadResult.status} ${uploadResult.statusText}`,
    );
  }

  // 4. Return the public URL so it can be saved in the database
  return { publicUrl };
};
