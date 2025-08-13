"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAction } from "convex/react";
import { api } from "convex@/_generated/api";

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

  if (!showTooltip) {
    return cellDiv;
  }

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
