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

  if (!modMode) {
    const img = await generateCanvasImage(); // Buffer
    const fileName = `snapshot_${unixTime}.png`;

    // Convert Buffer -> ArrayBuffer (proper, not ArrayBufferLike)
    const arrayBuffer = img.buffer.slice(
      img.byteOffset,
      img.byteOffset + img.byteLength
    );

    const URL = await uploadThing({
      name: fileName,
      data: arrayBuffer,
    });

    await fetch(env.DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `<t:${unixTime}:F> New snapshot uploaded! ${URL}`,
      }),
    });

    return new Response(URL);
  } else {
    await fetch(env.DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `<t:${unixTime}:F> Snapshot Failed; Moderation Mode is active.`,
      }),
    });

    return new Response("Moderation mode active", { status: 409 });
  }
}