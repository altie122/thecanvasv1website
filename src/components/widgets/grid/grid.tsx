/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { api } from "convex@/_generated/api";
import { useQuery } from "convex/react";

export default function Grid({ gridSize, pixelSize }: { gridSize: number; pixelSize: number }) {
  const pixels = useQuery(api.pixels.GetAllPixels);
  console.log(pixels);
  if (!pixels) return null;
  pixels.sort((a, b) => a.x - b.x);
  console.log(pixels);
  return (
    <div className="grid grid-cols-10 gap-2">
      
    </div>
  );
}