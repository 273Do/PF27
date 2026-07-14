// このファイルは自動生成されています。手動で編集しないでください。
// Generated at: 2026-07-14T13:27:09.285Z

import type { MicroCMSImage, MicroCMSDate } from "microcms-js-sdk";

// Custom field: skill
export type Skill = {
  skillGenre: string;
  skills: string;
};

// Custom field: tech
export type Tech = {
  techName?: string;
};

// Custom field: tag
export type Tag = {
  tagName: string;
};

// Profile (object)
export type Profile = {
  name: string;
  bio: string;
  description?: string;
  skills?: Skill[];
};

export type ProfileResponse = Profile & MicroCMSDate;

// Works (list)
export type Works = {
  title: string;
  article: string;
  releaseDate: string;
  techs: Tech[];
  tags: Tag[];
  githubLink?: string;
  appLink?: string;
  otherLink?: string;
};

export type WorksResponse = Works & MicroCMSDate;

export type WorksListResponse = {
  contents: WorksResponse[];
  totalCount: number;
  offset: number;
  limit: number;
};

// Sandbox (list)
export type Sandbox = {
  title: string;
  image: MicroCMSImage;
  tags: Tag[];
  link: string;
};

export type SandboxResponse = Sandbox & MicroCMSDate;

export type SandboxListResponse = {
  contents: SandboxResponse[];
  totalCount: number;
  offset: number;
  limit: number;
};
