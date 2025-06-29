"use client";
import dynamic from "next/dynamic";

const Grid = dynamic(() => import("./grid"), { ssr: false });

export default Grid;