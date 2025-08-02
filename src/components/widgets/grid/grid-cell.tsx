// components/GridCell.tsx
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Adjust path as needed

interface GridCellProps {
  x: number;
  y: number;
  pixelSize: number;
  color: string;
}

const GridCell = React.memo(function GridCell({
  x,
  y,
  pixelSize,
  color,
}: GridCellProps) {
  // console.log(`Rendering cell ${x},${y}`); // For debugging re-renders
  return (
    <Tooltip key={`${x}-${y}`}>
      <TooltipTrigger>
        <div
          style={{
            width: pixelSize,
            height: pixelSize,
            backgroundColor: color,
          }}
          className="flex items-center justify-center"
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>{`${x}-${y}`}</p>
        <p>{color}</p>
      </TooltipContent>
    </Tooltip>
  );
});

export default GridCell;