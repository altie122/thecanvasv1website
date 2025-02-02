import { utapi } from "~/server/uploadthing";

// Define our local SerializedUploadThingError interface
interface SerializedUploadThingError {
  message: string;
}

// Avoid naming collisions by renaming our interface.
interface MyUploadFileResult {
  data: {
    url: string;
  } | null;
  error: SerializedUploadThingError | null;
}

/**
 * Uploads a file using UploadThing and returns the URL of the uploaded file.
 *
 * @param file An object with a name and the file data as an ArrayBuffer.
 * @returns The URL of the uploaded file.
 * @throws An error if the upload fails.
 */
export async function uploadThing(file: { name: string; data: ArrayBuffer }): Promise<string> {
  const fileObject = new File([file.data], file.name);

  const results = (await utapi.uploadFiles([fileObject])) as MyUploadFileResult[];

  if (results.length === 0) {
    throw new Error("Upload failed: no response from server.");
  }

  // Since we've ensured that results is not empty, we can safely assert that results[0] is defined.
  const result = results[0]!;

  if (result.error) {
    throw new Error(result.error.message);
  }

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!result.data || !result.data.url) {
    throw new Error("Upload failed: no URL returned.");
  }

  return result.data.url;
}
