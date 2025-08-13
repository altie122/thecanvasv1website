import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "The Canvas",
  description: "A Roblox game where you can draw on the screen for all to see! Inspired by r/place. Made by Altie122 Studios - RGS.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body>
        <ConvexClientProvider>
        {/* <header className="p-4 sticky top-0 bg-transparent">
          <a href="https://www.roblox.com/games/91945887967211/the-canvas" className="decoration-wavy">The Canvas</a> by <a href="https://altie122.xyz/" className="decoration-wavy">DragonForgeRGS</a>
        </header> */}
        {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
