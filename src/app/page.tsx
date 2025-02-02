import { generateCanvasImage } from "@/lib";
import { Suspense } from "react";

// Mark the page as dynamic to ensure SSR on every request
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const img = await generateCanvasImage();
  const base64String = `data:image/png;base64,${img.toString("base64")}`;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <img src={base64String} className="w-full h-full top-0" />
    </Suspense>
  );
}
