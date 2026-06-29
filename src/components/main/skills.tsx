import { useState } from "react";

import { cn } from "@/lib/utils";

const skills: string[] = ["Language", "Frontend", "Backend", "DevOps", "Creative", "Piano"];
const skillList: string[] = [
  "TypeScript, Python, PHP, GLSL",
  "React, Next.js, Vue.js, Astro, React Native, Tailwind CSS, R3F, GSAP, p5.js",
  "FastAPI, Flask, Laravel, MySQL, PostgreSQL, BaaS",
  "Docker, Github Actions, AWS, Devcontainer, Zed, Claude Code",
  "Figma, Blender, Affinity, Cavalry",
  "KORG SV-1",
];

export function Skills() {
  const [currentSkill, setCurrentSkill] = useState<number>(1);

  return (
    <div className="mt-6 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="w-fit bg-primary leading-tight text-secondary">Skills</p>
        {currentSkill && <p className="text-muted-foreground">{skillList[currentSkill - 1]}</p>}
      </div>
      <div className="mt-2 flex gap-2 text-muted-foreground">
        {skills.map((skill, i) => (
          <div key={i} className="flex">
            <p
              className={cn(
                currentSkill === i + 1 && "w-fit bg-primary leading-tight text-secondary",
                "cursor-pointer transition-all",
              )}
              onMouseEnter={() => setCurrentSkill(i + 1)}
            >
              {skill}
            </p>
            <span>{i < skills.length - 1 && ","}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
