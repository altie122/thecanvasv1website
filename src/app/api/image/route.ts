/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { uploadThing, generateCanvasImage } from "@/lib";
import { api } from "convex@/_generated/api";
import { env } from "@/env";
import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const img = await generateCanvasImage();
  const imageURL = "data:image/png;base64," + img.toString("base64");
  return NextResponse.rewrite(imageURL);
}
