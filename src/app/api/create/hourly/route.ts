import { uploadThing, generateCanvasImage } from "@/lib";

export async function GET(request: Request) {
  const API_KEY = process.env.CREATE_API_KEY;
  const requestkey = request.headers.get("x-api-key");
  if (requestkey !== API_KEY && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", { status: 401 });
  }
  const img = await generateCanvasImage();
  const unixTime = Date.now()/1000;
  const fimeName = `snapshot_${unixTime}.png`;
  const URL = await uploadThing({ name: fimeName, data: img.buffer });
  await fetch(
    process.env.DISCORD_WEBHOOK,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `<t:${unixTime}:F> New snapshot uploaded!\n<${URL}> ${URL}`,
      }),
    }
  )
  return new Response(URL);
}