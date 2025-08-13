"use client";
import { api } from "convex@/_generated/api";
import { useQuery } from "convex/react";
import GridCell from "./grid-cell"; // Import the memoized component
import React, { useMemo } from "react"; // Import useMemo

export default function Grid({
  gridSize,
  pixelSize,
}: {
  gridSize: number;
  pixelSize: number;
}) {
  // Allow 'pixels' to be undefined when loading
  const pixels = useQuery(api.pixels.GetAllPixels);

  // Use useMemo to create the pixelMap only when 'pixels' changes
  const pixelMap = useMemo(() => {
    const map = new Map<string, { color: string; userID?: number }>();
    // Only iterate if pixels is defined
    pixels?.forEach((pixel) => {
      map.set(`${pixel.x},${pixel.y}`, {
        color: pixel.color,
        userID: pixel.userID,
      });
    });
    return map;
  }, [pixels]); // Dependency array: recreate map only if pixels array reference changes

  const gridCells = useMemo(() => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const coordKey = `${x + 1},${y + 1}`; // Assuming 1-indexed for data
        const color = pixelMap.get(coordKey)?.color ?? "#FFFFFF";

        cells.push(
          <GridCell
            key={`${x}-${y}`} // Key is still important here!
            x={x + 1} // Pass 1-indexed if your tooltips need it
            y={y + 1} // Pass 1-indexed if your tooltips need it
            pixelSize={pixelSize}
            color={color}
            userId={pixelMap.get(coordKey)?.userID}
          />,
        );
      }
    }
    return cells;
  }, [gridSize, pixelSize, pixelMap]); // Recreate gridCells only if these change

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
        gap: 0,
        width: gridSize * pixelSize,
        height: gridSize * pixelSize,
      }}
    >
      {gridCells}
    </div>
  );
}