import { z } from "astro/zod";

export const DateStringSchema = z.iso.date();

export const PeriodSchema = z.object({
  start: DateStringSchema,
  end: z.union([z.literal("").transform(() => undefined), DateStringSchema]).optional(),
});

export const ProjectSchema = z.object({
  name: z.string(),
  period: PeriodSchema,
  roles: z.array(z.string()),
  techs: z.array(z.string()),
  description: z.string(),
  achievements: z.array(z.string()),
});

export const CompanySchema = z.object({
  name: z.string(),
  description: z.string(),
  projects: z.array(ProjectSchema),
});

export const ResumeSchema = z.object({
  title: z.string(),
  companies: z.array(CompanySchema),
  updatedAt: DateStringSchema,
});

export type DateString = z.infer<typeof DateStringSchema>;
export type Period = z.infer<typeof PeriodSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type Resume = z.infer<typeof ResumeSchema>;
