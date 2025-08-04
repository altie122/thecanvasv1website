"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

export function DialogOverlay() {
  return (
    <div className="absolute right-0 bottom-0 z-[49] m-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"default"}>
            <Info className="h-12 w-12" />
            <span className="sr-only">Info</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <a
                href="https://www.roblox.com/games/91945887967211/the-canvas"
                className="text-red-600 decoration-wavy"
              >
                The Canvas
              </a>{" "}
              by{" "}
              <a
                href="https://altie122.xyz/"
                className="text-red-600 decoration-wavy"
              >
                DragonForgeRGS
              </a>
            </DialogTitle>
            <DialogDescription>
              Open Source Software used for this project below.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-98 overflow-y-scroll p-4">
            <h1 className="text-xl font-bold">Roblox Game:</h1>
            <ul className="list-disc pl-4">
              <li>
                <a
                  href="https://github.com/OMouta/Rex"
                  className="text-red-600 decoration-wavy"
                >
                  Rex
                </a>{" "}
                {`"The Reactive Roblox Framework"`} by{" "}
                <a
                  href="https://github.com/OMouta"
                  className="text-red-600 decoration-wavy"
                >
                  OMouta
                </a>
              </li>
              <li>
                <a
                  href="https://devforum.roblox.com/t/color-picker-free-and-open-source/2772473"
                  className="text-red-600 decoration-wavy"
                >
                  Color Picker
                </a>{" "}
                {`"Color Picker [free and open source]"`} by{" "}
                <a
                  href="https://devforum.roblox.com/u/brambes230605/summary"
                  className="text-red-600 decoration-wavy"
                >
                  Brambes
                </a>
              </li>
            </ul>
            <h1 className="text-xl font-bold">Website:</h1>
            <ul className="list-disc pl-4">
              <li>
                <a
                  href="https://github.com/vercel/next.js"
                  className="text-red-600 decoration-wavy"
                >
                  Next.js
                </a>{" "}
                {`"The React Framework for the Web"`} by{" "}
                <a
                  href="https://github.com/vercel"
                  className="text-red-600 decoration-wavy"
                >
                  Vercel
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tailwindlabs/tailwindcss"
                  className="text-red-600 decoration-wavy"
                >
                  Tailwind CSS
                </a>{" "}
                {`"Rapidly build modern websites without ever leaving your HTML."`}{" "}
                by{" "}
                <a
                  href="https://github.com/tailwindlabs"
                  className="text-red-600 decoration-wavy"
                >
                  Tailwind Labs
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/shadcn-ui/ui"
                  className="text-red-600 decoration-wavy"
                >
                  Shadcn UI
                </a>{" "}
                {`"The Foundation for your Design System"`} by{" "}
                <a
                  href="https://github.com/shadcn"
                  className="text-red-600 decoration-wavy"
                >
                  Shadcn
                </a>{" "}
                at{" "}
                <a
                  href="https://github.com/vercel"
                  className="text-red-600 decoration-wavy"
                >
                  Vercel
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Leaflet/Leaflet"
                  className="text-red-600 decoration-wavy"
                >
                  Leaflet
                </a>{" "}
                {`"JavaScript library for mobile-friendly interactive maps"`} by{" "}
                <a
                  href="https://github.com/Leaflet"
                  className="text-red-600 decoration-wavy"
                >
                  Leaflet
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/PaulLeCam/react-leaflet"
                  className="text-red-600 decoration-wavy"
                >
                  React Leaflet
                </a>{" "}
                {`"React components for Leaflet maps"`} by{" "}
                <a
                  href="https://github.com/PaulLeCam"
                  className="text-red-600 decoration-wavy"
                >
                  Paul Le Cam
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/pingdotgg/uploadthing"
                  className="text-red-600 decoration-wavy"
                >
                  UploadThing
                </a>{" "}
                {`"File uploads for modern web devs "`} by{" "}
                <a
                  href="https://github.com/pingdotgg"
                  className="text-red-600 decoration-wavy"
                >
                  pingdotgg
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/get-convex/convex-backend"
                  className="text-red-600 decoration-wavy"
                >
                  Convex
                </a>{" "}
                {`"The open-source reactive database for app developers "`} by{" "}
                <a
                  href="https://github.com/get-convex"
                  className="text-red-600 decoration-wavy"
                >
                  Convex
                </a>
              </li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
