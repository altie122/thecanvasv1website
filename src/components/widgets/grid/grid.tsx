/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { api } from "convex@/_generated/api";
import { useQuery } from "convex/react";
import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Your Shadcn UI tooltip

// Define the shape of a pixel from your Convex query
interface Pixel {
  x: number;
  y: number;
  color: string;
  // Add other properties if they exist, like _id, _creationTime
}

export default function Grid({
  gridSize,
  pixelSize,
}: {
  gridSize: number;
  pixelSize: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixels = useQuery(api.pixels.GetAllPixels) as Pixel[] | undefined ?? [];

  // State for controlling the custom tooltip
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Memoize pixelMap for quick lookups
  const pixelMap = useMemo(() => {
    const map = new Map<string, string>();
    pixels.forEach((pixel) => {
      map.set(`${pixel.x},${pixel.y}`, pixel.color);
    });
    return map;
  }, [pixels]);

  // Effect to draw pixels on the canvas whenever `pixels` or canvas dimensions change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = gridSize * pixelSize;
    canvas.height = gridSize * pixelSize;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all pixels
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Correctly calculate 1-indexed coordinates for map lookup
        const coordKey = `${x + 1},${y + 1}`;
        const color = pixelMap.get(coordKey) ?? "#FFFFFF";

        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }
  }, [pixels, gridSize, pixelSize, pixelMap]);

  // Handle mouse move to show tooltips
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // Account for CSS scaling
    const scaleY = canvas.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    // Calculate which grid cell the mouse is over (0-indexed)
    const cellX = Math.floor(mouseX / pixelSize);
    const cellY = Math.floor(mouseY / pixelSize);

    // Check if within bounds
    if (cellX >= 0 && cellX < gridSize && cellY >= 0 && cellY < gridSize) {
      // Get 1-indexed coordinates for data lookup
      const actualX = cellX + 1;
      const actualY = cellY + 1;
      const coordKey = `${actualX},${actualY}`;
      const color = pixelMap.get(coordKey) ?? "#FFFFFF";

      setTooltipContent(`X: ${actualX}, Y: ${actualY}, Color: ${color}`);
      setTooltipPosition({
        x: event.clientX, // Use clientX/Y for positioning the tooltip relative to viewport
        y: event.clientY,
      });
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }
  }, [gridSize, pixelSize, pixelMap]); // Dependencies for useCallback

  const handleMouseOut = useCallback(() => {
    setTooltipVisible(false);
  }, []);

  return (
    <div
      style={{
        position: "relative", // Needed for absolute positioning of the custom tooltip
        width: gridSize * pixelSize,
        height: gridSize * pixelSize,
        // Optional: Border around the entire grid
        // border: "1px solid #ccc",
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        className="block" // Ensures no extra margin/padding from inline-block default
      />

      {/* Custom Tooltip using Shadcn's Tooltip components directly */}
      {tooltipVisible && tooltipPosition && (
        <Tooltip open={tooltipVisible}>
          <TooltipTrigger asChild>
            {/* An invisible div positioned where the mouse is.
                This is a workaround to use Shadcn's TooltipTrigger effectively
                without having a real element at the pixel's location.
                Alternatively, you might need to build your own custom tooltip
                component from scratch if this feels too hacky or doesn't behave
                as expected with complex tooltips.
            */}
            <div
              style={{
                position: "fixed", // Position relative to the viewport
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                // Make it tiny and invisible
                width: 1,
                height: 1,
                pointerEvents: "none", // Ensure it doesn't block mouse events on canvas
                transform: "translate(-50%, -100%)", // Adjust to position tooltip above cursor
              }}
            />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            // Override default content styling to appear correctly
            style={{
                position: "fixed",
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: "translate(-50%, calc(-100% - 10px))", // Adjust to move above cursor with padding
                pointerEvents: "none", // Tooltip content should not capture mouse events
                zIndex: 1000, // Ensure it's on top
            }}
          >
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}