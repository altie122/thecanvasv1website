import { env } from "@/env";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "The Canvas",
  description: "A Roblox game where you can draw on the screen for all to see! Inspired by r/place. Made by DragonForgeRGS/Altie122.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  other: {
    versionId: `${env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID}-${env.NEXT_PUBLIC_VERCEL_TARGET_ENV}-${env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} bg-white text-black`}>
      <body>
        <header className="p-4 sticky top-0 bg-transparent">
          <a href="https://www.roblox.com/games/91945887967211/the-canvas" className="decoration-wavy">The Canvas</a> by <a href="https://altie122.xyz/" className="decoration-wavy">DragonForgeRGS</a>
        </header>
        {children}
      </body>
    </html>
  );
}
