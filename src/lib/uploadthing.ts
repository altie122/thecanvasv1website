/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { utapi } from "~/server/uploadthing";

export async function uploadThing(file: { name: string; data: ArrayBuffer }) {
  const response = await utapi.uploadFiles(new File([file.data], file.name));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (response.error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (response.error == undefined) {
      throw new Error("Unknown error");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    throw new Error(response.error);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return response.data?.url;
}