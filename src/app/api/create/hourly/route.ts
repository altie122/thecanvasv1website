/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { uploadThing, generateCanvasImage } from "@/lib";
import { api } from "convex@/_generated/api";
import { env } from "@/env";
import { fetchQuery } from "convex/nextjs";

export async function GET(request: Request) {
  const API_KEY = process.env.CREATE_API_KEY;
  const requestkey = request.headers.get("x-api-key");
  if (requestkey !== API_KEY && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", { status: 401 });
  }
  const modMode = await fetchQuery(api.mod.get);
  const unixTime = Math.floor(Date.now() / 1000);
  if (modMode && modMode !== true) {
    const img = await generateCanvasImage();
    const fimeName = `snapshot_${unixTime}.png`;
    const URL = await uploadThing({ name: fimeName, data: img.buffer });
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
  } else {
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
