/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { api } from "convex@/_generated/api";
import { useQuery } from "convex/react";

import { CanvasGridLayer } from "./canvas-grid-layer";

interface Pixel {
  x: number;
  y: number;
  color: string;
  userID?: number;
}

// *** SIMPLEST CRS: L.CRS.Simple without any custom resolutions or transformations ***
// This uses Leaflet's default: (0,0) is top-left, Y increases downwards.
// Zoom levels Z: 1 map unit = 2^Z screen pixels.
const defaultSimpleCRS = L.CRS.Simple;

export default function LeafletGrid({
  gridSize,
  pixelSize, // This prop controls initial zoom for visual density
}: {
  gridSize: number;
  pixelSize: number;
}) {
  const pixels =
    (useQuery(api.pixels.GetAllPixels) as Pixel[] | undefined) ?? [];

  const pixelMap = useMemo(() => {
    const map = new Map<string, { color: string; userID?: number }>();
    pixels.forEach((pixel) => {
      map.set(`${pixel.x},${pixel.y}`, {
        color: pixel.color,
        userID: pixel.userID,
      });
    });
    return map;
  }, [pixels]);

  // Map bounds: [[minY, minX], [maxY, maxX]] in conceptual map units.
  // For a grid from (1,1) top-left to (gridSize, gridSize) bottom-right:
  const mapBounds: L.LatLngBoundsExpression = [
    [0, 0],
    [gridSize, gridSize],
  ];

  const TooltipHandler = React.memo(function TooltipHandler({
    pixelMap,
    gridSize,
  }: {
    pixelMap: Map<string, { color: string; userID?: number }>;
    gridSize: number;
  }) {
    const map = useMap();
    const activeMapTooltipRef = useRef<L.Tooltip | null>(null);

    const handleMouseMove = useCallback(
      (e: L.LeafletMouseEvent) => {
        // e.latlng contains map coordinates (Y, X) for the defaultSimpleCRS (Y-down).
        // These are already in our conceptual map units.
        const currentMapX = e.latlng.lng;
        const currentMapY = e.latlng.lat;

        // Convert map units to 0-indexed conceptual grid coordinates
        const cellX_0_indexed = Math.floor(currentMapX);
        const cellY_0_indexed = Math.floor(currentMapY);

        // Convert to 1-indexed for pixelMap lookup.
        // Assuming pixelMap uses Y=1 for the TOP row and Y=gridSize for the BOTTOM row.
        // Since Leaflet's default CRS is Y-down, and `pixelMap` is Y-down,
        // this is a direct translation. NO Y-FLIP NEEDED HERE.
        const pixelMapX = cellX_0_indexed + 1;
        const pixelMapY = cellY_0_indexed * -1;

        if (
          pixelMapX >= 1 &&
          pixelMapX <= gridSize &&
          pixelMapY >= 1 &&
          pixelMapY <= gridSize
        ) {
          const coordKey = `${pixelMapX},${pixelMapY}`;
          const entry = pixelMap.get(coordKey);
          const color = entry?.color ?? "#FFFFFF";
          const userID = entry?.userID;

          const tooltipContent = `X: ${pixelMapX}, Y: ${pixelMapY}<br/>Color: ${color}${
            userID != null ? `<br/>UserID: ${userID}` : ""
          }`;

          if (!activeMapTooltipRef.current) {
            activeMapTooltipRef.current = L.tooltip({
              direction: "top", // Default to top
              permanent: false,
              interactive: false,
              offset: L.point(0, -10), // Pixels offset for visual appearance
              className: "custom-pixel-tooltip",
            })
              .setLatLng(e.latlng)
              .setContent(tooltipContent)
              .addTo(map);
          } else {
            activeMapTooltipRef.current
              .setLatLng(e.latlng)
              .setContent(tooltipContent);
          }
        } else {
          if (activeMapTooltipRef.current) {
            map.removeLayer(activeMapTooltipRef.current);
            activeMapTooltipRef.current = null;
          }
        }
      },
      [gridSize, pixelMap, map],
    );

    const handleMouseOut = useCallback(() => {
      if (activeMapTooltipRef.current) {
        map.removeLayer(activeMapTooltipRef.current);
        activeMapTooltipRef.current = null;
      }
    }, [map]);

    useEffect(() => {
      map.on("mousemove", handleMouseMove);
      map.on("mouseout", handleMouseOut);

      return () => {
        map.off("mousemove", handleMouseMove);
        map.off("mouseout", handleMouseOut);
        if (activeMapTooltipRef.current) {
          map.removeLayer(activeMapTooltipRef.current);
          activeMapTooltipRef.current = null;
        }
      };
    }, [map, handleMouseMove, handleMouseOut]);

    return null;
  });

  // Calculate an appropriate initial zoom level based on desired pixelSize.
  // With L.CRS.Simple, at zoom Z, 1 map unit = 2^Z screen pixels.
  // If you want each conceptual pixel (1 map unit) to initially show as `pixelSize` screen pixels,
  // then the required initial zoom level Z is such that `2^Z = pixelSize`.
  const initialZoom = Math.log2(pixelSize);

  return (
    <div
      style={{
        width: "100dvw", // Use dvw/dvh for dynamic viewport units
        height: "100dvh",
        margin: "0", // Remove default margins
      }}
    >
      <MapContainer
        // Center of the map in conceptual map units (Y, X)
        center={[-gridSize / 2, gridSize / 2]}
        // Initial zoom: Set to calculated value.
        zoom={initialZoom}
        // Use Leaflet's default min/max zoom, or set specific values
        // that are *within* Leaflet's reasonable range for L.CRS.Simple.
        // Allowing negative zooms is fine.
        minZoom={-5} // Allows significant zoom out (e.g. 1/32 screen pixel per map unit)
        maxZoom={10} // Allows significant zoom in (e.g. 1024 screen pixels per map unit)
        zoomSnap={1} // Snap to integer zoom levels for cleaner pixel rendering (optional, can be 0.5 too)
        crs={defaultSimpleCRS} // *** Use default L.CRS.Simple ***
        bounds={mapBounds}
        maxBoundsViscosity={1.0}
        style={{ width: "100%", height: "100%", backgroundColor: "#333" }}
        doubleClickZoom={false}
        attributionControl={false}
      >
        {/* Pass `pixelSize` as 1 to CanvasGridLayer, as it draws 1 map unit = 1 pixel on tile. */}
        <CanvasGridLayer
          pixelMap={pixelMap}
          pixelSize={1}
          gridSize={gridSize}
        />
        <TooltipHandler pixelMap={pixelMap} gridSize={gridSize} />
      </MapContainer>
    </div>
  );
}
