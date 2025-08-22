/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import sharp from "sharp";
import { env } from "@/env";

const UNIVERSE_ID = env.ROBLOX_UNIVERSE_ID;
const API_KEY = env.ROBLOX_API_KEY;
const GRID_SIZE = 120; // # of pixels in the grid, this should match the grid size in Roblox
const SCALE_FACTOR = 10; // Size of a given pixel in the canvas
const OUTPUT_SIZE = GRID_SIZE * SCALE_FACTOR;

interface ColorData {
  r: number;
  g: number;
  b: number;
}

interface ApiResponse {
  value: Record<string, ColorData>;
}

export async function generateCanvasImage(): Promise<Buffer> {
  try {
    // Get DataStore data using the correct endpoint
    const response = await fetch(
      `https://apis.roblox.com/cloud/v2/universes/${UNIVERSE_ID}/data-stores/PixelGrid/entries/PixelGrid`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    const pixelData = data.value;
    console.log("Received pixel data:", pixelData);

    // Create an RGBA pixel array for the scaled image
    const imageData = new Uint8Array(GRID_SIZE * GRID_SIZE * 4);

    // Fill with white by default
    imageData.fill(255);

    // Fill in the pixels from the data
    Object.entries(pixelData).forEach(([coordString, colorData]) => {
      const coords = JSON.parse(coordString);
      
      const x = coords[0] - 1; // Convert 1-based x to 0-based x
      const y = coords[1] - 1; // Convert 1-based y to 0-based y

      // Calculate array index
      const index = y * GRID_SIZE * 4 + x * 4;

      if (index >= 0 && index < imageData.length - 3) {
        imageData[index] = Math.round(colorData.r * 255); // R
        imageData[index + 1] = Math.round(colorData.g * 255); // G
        imageData[index + 2] = Math.round(colorData.b * 255); // B
        imageData[index + 3] = 255; // Alpha (fully opaque)
      } else {
        console.warn(
          `Coordinates (${coords[0]}, ${coords[1]}) resulted in out-of-bounds index: ${index}`
        );
      }
    });

    // Create and return the PNG buffer with scaling
    const buffer = await sharp(imageData, {
      raw: {
        width: GRID_SIZE,
        height: GRID_SIZE,
        channels: 4,
      },
    })
      .resize({
        width: OUTPUT_SIZE,
        height: OUTPUT_SIZE,
        kernel: "nearest", // Use nearest neighbor interpolation to maintain pixel art look
      })
      .png({
        quality: 100,
        compressionLevel: 9, // Maximum compression
      })
      .toBuffer();
    return buffer;
  } catch (error) {
    console.error("Error generating canvas image:", error);
    throw error;
  }
}
