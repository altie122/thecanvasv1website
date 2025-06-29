/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { fetchMutation } from "convex/nextjs";
import { api } from "convex@/_generated/api";

type expectedData = {
  x: number;
  y: number;
  color: string;
}

type expectedDataRaw = {
  x: string;
  y: string;
  hex: string;
}

export async function POST(request: Request) {
  const API_KEY = process.env.CREATE_API_KEY;
  const requestkey = request.headers.get("x-api-key");
  if (requestkey !== API_KEY && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", { status: 401 });
  }
  const data: expectedDataRaw = await request.json();
  const { x, y, hex } = data;
  const FormattedData: expectedData = {
    x: parseInt(x),
    y: parseInt(y),
    color: `#${hex}`,
  };
  const response = await fetchMutation(api.pixels.UpdatePixel, FormattedData);
  if (response === "Success") {
    return new Response("Success", { status: 200 });
  } else {
    return new Response("Error", { status: 500 });
  }
}