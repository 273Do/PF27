import { useState } from "react";

import { cn } from "@/lib/utils";

type WorkObj = {
  name: string;
  tags: string[];
  imageUrl: string;
};

const works: WorkObj[] = [
  {
    imageUrl: "https://picsum.photos/seed/canvas/600/400",
    name: "Canvas Flow",
    tags: ["Tool", "Creative"],
  },
  {
    imageUrl: "https://picsum.photos/seed/type/600/400",
    name: "Type Grid",
    tags: ["App", "Design"],
  },
  {
    imageUrl: "https://picsum.photos/seed/midi/600/400",
    name: "Midi Map",
    tags: ["Tool", "Music"],
  },
  {
    imageUrl: "https://picsum.photos/seed/sensor/600/400",
    name: "Sensor Viz",
    tags: ["App", "Sensor"],
  },
  {
    imageUrl: "https://picsum.photos/seed/wave/600/400",
    name: "Wave Form",
    tags: ["Tool", "Audio"],
  },
  {
    imageUrl: "https://picsum.photos/seed/palette/600/400",
    name: "Palette Gen",
    tags: ["App", "Design"],
  },
  {
    imageUrl: "https://picsum.photos/seed/log/600/400",
    name: "Log Viewer",
    tags: ["Tool", "DevOps"],
  },
  {
    imageUrl: "https://picsum.photos/seed/font/600/400",
    name: "Font Lab",
    tags: ["App", "Design"],
  },
  {
    imageUrl: "https://picsum.photos/seed/mesh/600/400",
    name: "Mesh Grid",
    tags: ["Tool", "Creative"],
  },
  {
    imageUrl: "https://picsum.photos/seed/noise/600/400",
    name: "Noise Gen",
    tags: ["App", "Creative"],
  },
  {
    imageUrl: "https://picsum.photos/seed/dark/600/400",
    name: "Dark Room",
    tags: ["Tool", "Photo"],
  },
  { imageUrl: "https://picsum.photos/seed/seq/600/400", name: "Seq Step", tags: ["App", "Music"] },
];

export function Sandbox() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="mt-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="w-fit bg-primary leading-tight text-secondary">Sandbox</p>
        <p className="text-muted-foreground">Play Ground, R&D Collection, Experiments</p>
      </div>
      <div className="flex w-full gap-4">
        <div className="w-1/2">
          <div className="group w-full space-y-2 text-muted-foreground">
            {works.map((work, i) => (
              <div
                key={i}
                className={cn(
                  hoveredIndex === null
                    ? "opacity-100"
                    : i === hoveredIndex
                      ? "opacity-100"
                      : "opacity-30",
                  "flex cursor-alias items-center justify-between gap-4 transition-opacity group-hover:opacity-30 hover:opacity-100!",
                )}
                onMouseEnter={() => setHoveredIndex(i)}
              >
                <p className="text-primary">{work.name}</p>
                <p>{work.tags.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-1/2">
          {works.map((work, i) => (
            <img
              key={i}
              src={work.imageUrl}
              alt={work.name}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                hoveredIndex === i ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
