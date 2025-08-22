/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { uploadThing, generateCanvasImage } from "@/lib";
import { api } from "convex@/_generated/api";
import { env } from "@/env";
import { fetchQuery } from "convex/nextjs";

// Handle hourly snapshot requests
export async function GET(request: Request) {
  const API_KEY = env.CREATE_API_KEY;
  const requestkey = request.headers.get("x-api-key");
  // Check if the request key matches the API key and if the environment is production
  if (requestkey !== API_KEY && env.NODE_ENV === "production") {
    return new Response("Unauthorized", { status: 401 });
  }
  const modMode = await fetchQuery(api.mod.get); // Get the current mod mode status
  const unixTime = Math.floor(Date.now() / 1000); // Get the current Unix timestamp
  // If the mod mode is not active, generate a canvas image and upload it to UploadThing and send a snapshot message to Discord
  if (!modMode) {
    const img = await generateCanvasImage();
    const fileName = `snapshot_${unixTime}.png`;
    const URL = await uploadThing({ name: fileName, data: img.buffer as ArrayBuffer });
    await fetch(
      env.DISCORD_WEBHOOK,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `<t:${unixTime}:F> New snapshot uploaded! ${URL}`,
        }),
      }
    )
    return new Response(URL);
  } else { // If the mod mode is active, send an error message to Discord
    await fetch(
      env.DISCORD_WEBHOOK,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `<t:${unixTime}:F> Snapshot Failed; Moderation Mode is active.`,
        }),
      }
    )
  }
}
