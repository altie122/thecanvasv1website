/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { env } from "@/env";
import { fetchMutation } from "convex/nextjs";
import { api } from "convex@/_generated/api";

type expectedData = {
  x: number;
  y: number;
  color: string;
  userID?: number;
}

type expectedDataRaw = {
  x: string;
  y: string;
  hex: string;
  userID?: string;
}

// Handle new pixel submissions from roblox
export async function POST(request: Request) {
  const API_KEY = env.CREATE_API_KEY;
  const requestkey = request.headers.get("x-api-key");
  // Check if the request key matches the API key and if the environment is production
  if (requestkey !== API_KEY && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", { status: 401 });
  }
  // Parse the request body as JSON
  const data: expectedDataRaw = await request.json();
  const { x, y, hex, userID } = data;
  const FormattedData: expectedData = {
    x: parseInt(x),
    y: parseInt(y),
    color: `#${hex}`,
    userID: userID ? parseInt(userID) : undefined,
  };
  // Update the pixel in the database
  const response = await fetchMutation(api.pixels.UpdatePixel, FormattedData);
  if (response === "Success") {
    return new Response("Success", { status: 200 });
  } else {
    return new Response("Error", { status: 500 });
  }
}