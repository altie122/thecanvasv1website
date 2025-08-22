/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { generateCanvasImage } from "@/lib";

// Handle image generation requests
export async function GET(_request: Request) {
  try {
    const imgBuffer = await generateCanvasImage();
    const base64Image = imgBuffer.toString("base64");
    // Return a JSON object with the Base64 string, so it's easier to parse
    return new Response(
      JSON.stringify({ base64Image: base64Image }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error generating canvas image:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate image" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
}