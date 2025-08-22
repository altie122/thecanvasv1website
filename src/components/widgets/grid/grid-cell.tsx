"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GridCellProps {
  x: number;
  y: number;
  pixelSize: number;
  color: string;
  userId?: number;
}

const GridCell = React.memo(function GridCell({
  x,
  y,
  pixelSize,
  color,
  userId,
}: GridCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Main cell div

  const cellDiv = (
    <div
      style={{
        width: pixelSize,
        height: pixelSize,
        backgroundColor: color,
      }}
      className="flex items-center justify-center"
      onMouseEnter={() => setShowTooltip(true)}
    />
  );

  // If the tooltip is not needed, we can return the cell div directly making the component more efficient

  if (!showTooltip) {
    return cellDiv;
  }

  // If the tooltip is needed, we can render it conditionally

  return (
    <Tooltip key={`${x}-${y}`}>
      <TooltipTrigger>{cellDiv}</TooltipTrigger>
      <TooltipContent>
        <p>{`${x}-${y}`}</p>
        <p>{color}</p>
        {
          userId && <p>{userId}</p>
        }
      </TooltipContent>
    </Tooltip>
  );
});

export default GridCell;
