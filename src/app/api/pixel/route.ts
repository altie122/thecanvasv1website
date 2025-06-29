/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { fetchMutation } from "convex/nextjs";
import { api } from "convex@/_generated/api";

export async function POST(request: Request) {
  const API_KEY = process.env.CREATE_API_KEY;
  const requestkey = request.headers.get("x-api-key");
  if (requestkey !== API_KEY && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", { status: 401 });
  }
  const data = await request.json();
  const { xraw, yraw, hexraw } = data;
  const x = parseInt(xraw);
  const y = parseInt(yraw);
  const color = `#${hexraw}`;
  await fetchMutation(api.pixels.UpdatePixel, { x, y, color });
}