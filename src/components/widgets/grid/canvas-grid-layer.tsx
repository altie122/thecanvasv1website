/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import { useEffect, useRef } from "react";

// No more need to import specific resolution constants or CRS from LeafletGrid,
// as we are relying on Leaflet's defaults.
// import { mapResolutions, MIN_ZOOM_OUT_LEVEL, pixelGridCRS } from "./LeafletGrid";

interface CanvasGridLayerOptions extends L.GridLayerOptions {
  pixelMap: Map<string, { color: string; userID?: number }>;
  pixelSize: number;
  gridSize: number;
}

type CustomGridLayerConstructor = new (
  options: CanvasGridLayerOptions,
) => L.GridLayer;

const CustomGridLayer = L.GridLayer.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize: function (this: any, options: CanvasGridLayerOptions) {
    L.setOptions(this, options);
  },

  createTile: function (
    this: L.GridLayer & { options: CanvasGridLayerOptions },
    coords: L.Coords, // Tile coordinates (z: zoom, x: column, y: row)
    done: L.DoneCallback, // Callback to signal when tile rendering is complete
  ) {
    const tile = L.DomUtil.create("canvas", "leaflet-tile"); // Create a canvas element for the tile
    const tileSize = this.getTileSize(); // Get Leaflet's default tile size (e.g., 256x256 screen pixels)
    const ctx = tile.getContext("2d"); // Get 2D rendering context

    if (!ctx) {
      done(new Error("Canvas context not available"), tile);
      return tile;
    }

    // Set the canvas dimensions to match the tile size (in screen pixels)
    tile.width = tileSize.x;
    tile.height = tileSize.y;

    const { pixelMap, gridSize } = this.options; // pixelSize will be 1 here

    // --- CRITICAL CHANGE: Get current resolution directly from the map instance ---
    // Accessing `this._map` is valid within Leaflet layer methods.
    // `.getCurrentResolution()` or similar is not a standard CRS method.
    // Instead, calculate resolution based on `coords.z`.
    // For L.CRS.Simple, resolution (map units per screen pixel) is 1 / (2^Z).
    const currentResolution = Math.pow(2, -coords.z);
    // --- END CRITICAL CHANGE ---

    // Calculate the map units covered by one tile side at the current resolution.
    // `tileSize.x` is in screen pixels. `currentResolution` is map units/screen pixel.
    const mapUnitsPerTileSide = tileSize.x * currentResolution;

    // Calculate the absolute map units (conceptual grid units) for the top-left of this tile.
    // coords.x/y are tile indices.
    const tileMapX_start = coords.x * mapUnitsPerTileSide;
    const tileMapY_start = coords.y * mapUnitsPerTileSide;

    // Iterate over each *screen pixel* on the tile canvas.
    // This loop ensures every physical pixel on the tile is potentially drawn.
    for (
      let screenY_in_tile = 0;
      screenY_in_tile < tileSize.y;
      screenY_in_tile += 1
    ) {
      for (
        let screenX_in_tile = 0;
        screenX_in_tile < tileSize.x;
        screenX_in_tile += 1
      ) {
        // Calculate the absolute map unit coordinates of the current screen pixel.
        // Convert screen pixel offset within tile to map units, then add tile's map unit start.
        const currentMapX =
          tileMapX_start + screenX_in_tile * currentResolution;
        const currentMapY =
          tileMapY_start + screenY_in_tile * currentResolution;

        // Convert to 0-indexed conceptual grid coordinates.
        // Since 1 map unit = 1 conceptual pixel, it's just flooring.
        const pixelGridX_0_indexed = Math.floor(currentMapX);
        const pixelGridY_0_indexed = Math.floor(currentMapY);

        // Convert to 1-indexed for pixelMap lookup.
        // Assuming pixelMap uses Y=1 for the TOP row and Y=gridSize for the BOTTOM row.
        // Since `L.CRS.Simple` is Y-down, and `pixelMap` is Y-down, this is a direct translation.
        const pixelMapX = pixelGridX_0_indexed + 1;
        const pixelMapY = pixelGridY_0_indexed + 1;

        if (
          pixelMapX >= 1 &&
          pixelMapX <= gridSize &&
          pixelMapY >= 1 &&
          pixelMapY <= gridSize
        ) {
          const coordKey = `${pixelMapX},${pixelMapY}`;
          const entry = pixelMap.get(coordKey);
          const color = entry?.color ?? "#FFFFFF";
          ctx.fillStyle = color;
          // Draw a 1x1 screen pixel at the current screen pixel location on the tile.
          // This creates the sharp pixelated effect.
          ctx.fillRect(screenX_in_tile, screenY_in_tile, 1, 1);
        }
      }
    }
    done(undefined, tile);
    return tile;
  },
});

const canvasGridLayerFactory = (options: CanvasGridLayerOptions) => {
  return new (CustomGridLayer as CustomGridLayerConstructor)(options);
};

export const CanvasGridLayer = ({
  pixelMap,
  pixelSize, // This prop isn't directly used for drawing here; it's always 1 conceptual unit.
  gridSize,
}: CanvasGridLayerOptions) => {
  const context = useLeafletContext();
  const map = context.map;
  const leafletLayerRef = useRef<L.GridLayer | null>(null);

  useEffect(() => {
    if (leafletLayerRef.current && map.hasLayer(leafletLayerRef.current)) {
      map.removeLayer(leafletLayerRef.current);
    }

    // Pass `pixelSize` as 1 to the Leaflet layer, as 1 map unit = 1 conceptual pixel.
    const newLayer = canvasGridLayerFactory({
      pixelMap,
      pixelSize: 1,
      gridSize,
    });
    newLayer.addTo(map);

    leafletLayerRef.current = newLayer;

    return () => {
      if (leafletLayerRef.current && map.hasLayer(leafletLayerRef.current)) {
        map.removeLayer(leafletLayerRef.current);
        leafletLayerRef.current = null;
      }
    };
  }, [map, pixelMap, pixelSize, gridSize]); // Keep pixelSize here if its change should re-render layer

  return null;
};
