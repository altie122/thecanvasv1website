/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { generateCanvasImage } from "@/lib";

// Handle image generation requests
export async function GET(_request: Request) {
  try {
    const imgBuffer = await generateCanvasImage();
    // Return the image buffer directly with PNG content type
    return new Response(new Uint8Array(imgBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error generating canvas image:", error);
    return new Response(JSON.stringify({ error: "Failed to generate image" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
