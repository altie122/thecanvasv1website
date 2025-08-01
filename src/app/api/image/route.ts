// pages/api/generate-image.ts or app/api/generate-image/route.ts
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { uploadThing, generateCanvasImage } from "@/lib"; // Assuming these are defined in your project
import { api } from "convex@/_generated/api"; // Unused in this specific GET, but kept for context
import { env } from "@/env"; // Unused in this specific GET, but kept for context
import { fetchQuery } from "convex/nextjs"; // Unused in this specific GET, but kept for context

export async function GET(request: Request) {
  try {
    const imgBuffer = await generateCanvasImage(); // Assuming this returns a Buffer
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