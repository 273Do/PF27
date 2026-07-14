// このファイルは自動生成されています。手動で編集しないでください。
// Generated at: 2026-07-14T14:53:18.261Z

import type { MicroCMSImage, MicroCMSDate } from "microcms-js-sdk";

// Custom field: skill
export type SkillObj = {
  skillGenre: string;
  skills: string;
};

// Custom field: tech
export type TechObj = {
  techName?: string;
};

// Custom field: tag
export type TagObj = {
  tagName: string;
};

// Profile (object)
export type ProfileObj = {
  name: string;
  bio: string;
  description?: string;
  skills?: SkillObj[];
};

export type ProfileResponse = ProfileObj & MicroCMSDate;

// Works (list)
export type WorksObj = {
  title: string;
  article: string;
  releaseDate: string;
  techs: TechObj[];
  tags: TagObj[];
  githubLink?: string;
  appLink?: string;
  otherLink?: string;
};

export type WorksResponse = WorksObj & MicroCMSDate;

export type WorksListResponse = {
  contents: WorksResponse[];
  totalCount: number;
  offset: number;
  limit: number;
};

// Sandbox (list)
export type SandboxObj = {
  title: string;
  image: MicroCMSImage;
  tags: TagObj[];
  link: string;
};

export type SandboxResponse = SandboxObj & MicroCMSDate;

export type SandboxListResponse = {
  contents: SandboxResponse[];
  totalCount: number;
  offset: number;
  limit: number;
};
