/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { api } from "convex@/_generated/api";
import { useQuery } from "convex/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Grid({
  gridSize,
  pixelSize,
}: {
  gridSize: number;
  pixelSize: number;
}) {
  // Ensure pixels is never undefined by providing a default empty array
  const pixels = useQuery(api.pixels.GetAllPixels) ?? [];

  // Create a map for quick lookup of pixel colors by their coordinates
  // This helps in efficiently setting the color for each grid cell.
  const pixelMap = new Map<string, string>();
  pixels.forEach((pixel) => {
    pixelMap.set(`${pixel.x},${pixel.y}`, pixel.color);
  });

  const gridCells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const coordKey = `${x + 1},${y + 1}`; // Assuming your pixel data is 1-indexed
      const color = pixelMap.get(coordKey) ?? "#FFFFFF"; // Default to white if no color is found

      gridCells.push(
        <Tooltip key={`${x}-${y}`}>
          <TooltipTrigger>
            <div
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: color,
                // Add a border for visualization if needed, remove for a solid look
                // border: "1px solid #eee",
              }}
              className="flex items-center justify-center" // Basic centering, adjust as needed
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{`${x}-${y}`}</p>
          </TooltipContent>
        </Tooltip>,
      );
    }
  }

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
        gap: 0, // No gap between pixels for a continuous look
        width: gridSize * pixelSize,
        height: gridSize * pixelSize,
        // border: "1px solid #ccc", // Optional: Border around the entire grid
      }}
    >
      {gridCells}
    </div>
  );
}
