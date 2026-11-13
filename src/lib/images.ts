import imageCompression from "browser-image-compression";
import { uploadImage } from "@/lib/data";

/** Phone photo (4–8 MB) → ~200 KB WebP, max 1600px → storage. Returns public URL. */
export async function uploadPhoto(file: File): Promise<string> {
  const small = await imageCompression(file, {
    maxSizeMB: 0.25,
    maxWidthOrHeight: 1600,
    fileType: "image/webp",
    useWebWorker: true,
  });
  return uploadImage(small);
}
