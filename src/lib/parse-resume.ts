import { z } from "astro/zod";

import { ResumeSchema, type Resume } from "@/types/resume";

const ResumeJsonSchema = z
  .string()
  .transform((text, ctx) => {
    try {
      return JSON.parse(text);
    } catch {
      ctx.addIssue({ code: "custom", message: "resume: Failed to parse JSON" });
      return z.NEVER;
    }
  })
  .pipe(ResumeSchema);

export const parseResume = (text: string): Resume => {
  const result = ResumeJsonSchema.safeParse(text);
  if (!result.success) {
    throw new Error(`resume: Data format is invalid\n${z.prettifyError(result.error)}`, {
      cause: result.error,
    });
  }

  return result.data;
};
