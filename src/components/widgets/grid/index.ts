"use client";
import dynamic from "next/dynamic";

// Make the Grid component not use SSR
const Grid = dynamic(() => import("./grid"), { ssr: false });

export default Grid;