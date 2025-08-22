/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Widgets } from "@/components/widgets";
import { generateCanvasImage } from "@/lib";
import { headers } from "next/headers";
import { Suspense } from "react";
import { api } from "convex@/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { DialogOverlay } from "@/components/dialog";

// Mark the page as dynamic to ensure SSR on every request
export const dynamic = "force-dynamic";

// Metadata for the page
export async function generateMetadata() {
  const headersList = await headers();
  const protocol =
    headersList.get("protocol") ??
    headersList.get("x-forwarded-proto") ??
    "https";
  const protocolFormatted = protocol.endsWith("://")
    ? protocol
    : protocol + "://";
  const siteUrl = protocolFormatted + headersList.get("host");
  const img = await generateCanvasImage();
  const base64String = `data:image/png;base64,${img.toString("base64")}`;
  return {
    title: "The Canvas",
    description:
      "A Roblox game where you can draw on the screen for all to see! Inspired by r/place. Made by Altie122 Studios - RGS.",
    icons: [
      {
        rel: "icon",
        url: base64String,
      },
    ],
    openGraph: {
      card: "summary_large_image",
      title: "The Canvas",
      description:
        "A Roblox game where you can draw on the screen for all to see! Inspired by r/place. Made by Altie122 Studios - RGS.",
      url: `${siteUrl}/`,
      siteName: "The Canvas",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: base64String,
          width: 1000,
          height: 1000,
          alt: "The Canvas",
        },
      ],
    },
    twitter: {
      title: "The Canvas",
      description:
        "A Roblox game where you can draw on the screen for all to see! Inspired by r/place. Made by Altie122 Studios - RGS.",
      siteId: "866355501432438784",
      site: "@altie122",
      creator: "@altie122",
      creatorId: "866355501432438784",
      images: [
        {
          url: base64String,
          width: 1000,
          height: 1000,
          alt: "The Canvas",
        },
      ],
    },
  };
}

export default async function HomePage() {
  const gridSize = 120; // This should match the grid size in Roblox
  const pixelSize = 5; // Size of a given pixel in the canvas
  const modMode = await fetchQuery(api.mod.get);

  if (modMode) {
    // If modMode is truthy (e.g., true, or any other value indicating outage)
    return (
      <div className="flex h-dvh w-dvw items-center justify-center">
        <h1 className="text-9xl font-black">
          TheCanvas is currently in a Moderation Outage, check back soon!
        </h1>
      </div>
    );
  } else {
    // If modMode is falsy (e.g., false, null, undefined)
    return (
      <main>
        <DialogOverlay />
        <div className="flex flex-row justify-center items-center h-dvh w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <Widgets.Grid.default gridSize={gridSize} pixelSize={pixelSize} />
          </Suspense>
        </div>
      </main>
    );
  }
}
